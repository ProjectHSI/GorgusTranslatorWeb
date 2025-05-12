//import RAIIPythonWorker from "$lib/PythonWorker?worker";
import {PythonWorker} from "$lib/PythonWorker.Types";
import CommandType = PythonWorker.CommandType;

//import Python from "$lib/python/wasm/python.mjs";

interface TranslationRequest {
    type: "E" | "G";
    text: string;
}

export class RAIITranslator {
    private pythonWorker: Worker | undefined = undefined;
    private vmActive: boolean = false;
    private pythonWorkerStdIn: SharedArrayBuffer | undefined = undefined;
    private pythonWorkerStdInInt32: Int32Array | undefined = undefined;

    private stdoutCallbacks: ((data: string) => void)[] = [];

    //private _isTranslatorReady: boolean = false;
    isTranslatorReady() {
        return this.vmActive;
    }

    constructor(fetchFunction: (arg0: string) => Promise<Response>, _runtimeReadyCallback?: (() => void)) {
        //console.log("testo")

        this.pythonWorker = new Worker(new URL('./PythonWorker', import.meta.url), {
            type: import.meta.env.DEV ? 'module' : 'classic'
        });

        this.pythonWorker.onmessage = (e: MessageEvent<PythonWorker.Command>) => {
            switch (e.data.command_type) {
                case PythonWorker.CommandType.VM_Ready:
                    console.log(e);
                    this.pythonWorkerStdIn = e.data.stdInBuffer;
                    this.pythonWorkerStdInInt32 = new Int32Array<ArrayBufferLike>(this.pythonWorkerStdIn);

                    this.pythonWorker.postMessage({
                        command_type: CommandType.Run_VM,
                        args: ["translate_to_gorgus.py"]
                    } as PythonWorker.RunCommand);

                    this.vmActive = true;
                    break;

                case PythonWorker.CommandType.VM_Stdout:
                    //this.stdoutPromises[{ type: "G", text: "abd" }].
                    for (const stdoutCallback of this.stdoutCallbacks) {
                        stdoutCallback(e.data.stream_text);
                    }
                    break;
            }
        }

        this.pythonWorker.postMessage({
            command_type: CommandType.Startup_VM
        } as PythonWorker.StartupCommand);

        //this.raiiPython = new RAIIPythonWorker(fetchFunction, () => {
            //this.raiiPython.runModule(["/home/web_user/gorgus/translate_to_gorgus.py"]);

            //if (_runtimeReadyCallback) {
                //_runtimeReadyCallback()
            //}});
    }

    private translationOutputRegex = new RegExp("\\[GTW_O]: \\[TO]: \\[([EG])] \\{(.*)} \\{(.*)}");

    translateToGorgus(stringToTranslate: string): Promise<string> {
        //this.stdoutPromises[{ type: "G", text: stringToTranslate }] = new Promise();

        return new Promise<string>((resolve, reject) => {
            if (!this.vmActive || this.pythonWorkerStdIn == undefined || this.pythonWorkerStdInInt32 == undefined) {
                console.log(this.vmActive, this.pythonWorkerStdIn, this.pythonWorkerStdInInt32)
                throw new Error("bruh");
            }

            this.stdoutCallbacks.push((data) => {
                let translationOutput = this.translationOutputRegex.exec(data);

                //console.log("raw", data);
                //console.log("to", translationOutput);
                //console.log("target", stringToTranslate);

                if (translationOutput == null)
                    return;

                if (translationOutput[1] == "G" && translationOutput[2] == stringToTranslate) {
                    console.log("yay folks")
                    resolve(translationOutput[3]);
                }
            });

            let feedToStdIn = `[GTW_I]: [G]: {${stringToTranslate}}`;

            //console.log(stringToTranslate)

            //console.log(`[GTW_I]: [G]: {${stringToTranslate}}`);

            if (this.pythonWorkerStdIn.byteLength < 4 + feedToStdIn.length * 4)
                if (this.pythonWorkerStdIn.maxByteLength <= 4 + feedToStdIn.length * 4 && this.pythonWorkerStdIn.growable)
                    this.pythonWorkerStdIn.grow(4 + feedToStdIn.length * 4);
                else
                    throw new Error("we're doomed");

            for (let i = 0; i < feedToStdIn.length; i++) {
                this.pythonWorkerStdInInt32[i + 1] = feedToStdIn.charCodeAt(i);
            }

            this.pythonWorkerStdInInt32[0] = feedToStdIn.length;
            Atomics.notify(this.pythonWorkerStdInInt32, 0);
            //this.pythonWorkerStdInInt32

            //this.pythonWorkerStdIn

            /*this.pythonWorker.postMessage({
                command_type: CommandType.VM_Stdin,
                stream_text: `[GTW_I]: [G]: {${stringToTranslate}}`
            } as PythonWorker.StdStreamEvent);*/
        });
        //this.raiiPython.stdin(`[GTW_I]: [G]: {${stringToTranslate.replace("\n", "")}}\n`);
    }
}