//import RAIIPythonWorker from "$lib/PythonWorker?worker";
import {PythonWorker} from "$lib/PythonWorker.Types";
import CommandType = PythonWorker.CommandType;

import "core-js/actual/typed-array/from-base64";
import "core-js/actual/typed-array/to-base64";

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
    private _translatorReady: boolean = false;

    isVmActive() {
        return this.vmActive;
    }

    isTranslatorReady() {
        return this._translatorReady;
    }

    constructor(fetchFunction: (arg0: string) => Promise<Response>, _runtimeReadyCallback?: (() => void)) {
        //console.log("testo")

        /*this.pythonWorker = import.meta.env.DEV ? new Worker(new URL('./PythonWorker', import.meta.url), {
            type: 'module'
        }) : new Worker(new URL('./PythonWorker', import.meta.url), {
            type: 'classic'
        });*/

        this.pythonWorker = new Worker(new URL('./PythonWorker', import.meta.url), {
            type: 'module'
        });

        console.log('created the thing');
        console.log(this.pythonWorker);

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
                    this._translatorReady = false;
                    break;

                case PythonWorker.CommandType.VM_Stdout:
                    //this.stdoutPromises[{ type: "G", text: "abd" }].
                    if (e.data.stream_text == "[GTW_O]: runtime_ready") {
                        this._translatorReady = true;
                    }
                    for (const stdoutCallback of this.stdoutCallbacks) {
                        stdoutCallback(e.data.stream_text);
                    }
                    break;
            }
        }

        console.log("reg")

        this.pythonWorker.postMessage({
            command_type: CommandType.Startup_VM
        } as PythonWorker.StartupCommand);

        console.log("send");

        //this.raiiPython = new RAIIPythonWorker(fetchFunction, () => {
            //this.raiiPython.runModule(["/home/web_user/gorgus/translate_to_gorgus.py"]);

            //if (_runtimeReadyCallback) {
                //_runtimeReadyCallback()
            //}});
    }

    async waitUntilTranslatorReady(): Promise<void> {
        if (this._translatorReady) {
            return;
        } else {
            return new Promise((resolve, reject) => {
                this.stdoutCallbacks.push((stdoutString: string) => {
                    if (stdoutString == "[GTW_O]: runtime_ready")
                        resolve();
                })
            });
        }
    }

    private translationOutputRegex = new RegExp("\\[GTW_O]: \\[TO]: \\[([EG]) \\[(!?)F]] \\{(.*)} \\{(.*)}");

    private stdin(feedToStdIn: string) {
        if (!this.vmActive || this.pythonWorkerStdIn == undefined || this.pythonWorkerStdInInt32 == undefined) {
            console.log(this.vmActive, this.pythonWorkerStdIn, this.pythonWorkerStdInInt32)
            throw new Error("bruh");
        }

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
    }

    private textEncoder = new TextEncoder();
    private textDecoder = new TextDecoder();

    translate(stringToTranslate: string, target: string, formal: boolean = true): Promise<string> {
        //this.stdoutPromises[{ type: "G", text: stringToTranslate }] = new Promise();

        return new Promise<string>((resolve, reject) => {
            if (!this.vmActive || this.pythonWorkerStdIn == undefined || this.pythonWorkerStdInInt32 == undefined) {
                console.log(this.vmActive, this.pythonWorkerStdIn, this.pythonWorkerStdInInt32)
                throw new Error("bruh");
            }

            stringToTranslate = (this.textEncoder.encode(stringToTranslate)).toBase64({ alphabet: "base64" });

            this.stdoutCallbacks.push((data) => {
                let translationOutput = this.translationOutputRegex.exec(data);

                if (translationOutput == null)
                    return;

                if (translationOutput[1] == target && translationOutput[2] == (!formal ? "!" : "") && translationOutput[3] == stringToTranslate) {
                    console.log("yay folks");
                    resolve(this.textDecoder.decode(Uint8Array.fromBase64(translationOutput[4])));
                }
            });

            this.stdin(`[GTW_I]: [${target} [${!formal ? "!" : ""}F]]: {${stringToTranslate}}`);

            //console.log(stringToTranslate)

            //console.log(`[GTW_I]: [G]: {${stringToTranslate}}`);


            //this.pythonWorkerStdInInt32

            //this.pythonWorkerStdIn

            /*this.pythonWorker.postMessage({
                command_type: CommandType.VM_Stdin,
                stream_text: `[GTW_I]: [G]: {${stringToTranslate}}`
            } as PythonWorker.StdStreamEvent);*/
        });
        //this.raiiPython.stdin(`[GTW_I]: [G]: {${stringToTranslate.replace("\n", "")}}\n`);
    }

    getPythonWorker() {
        if (!this.pythonWorker)
            throw new Error();

        return this.pythonWorker;
    }

    stopVm() {
        if (!this.pythonWorker) {
            //console.log(this.vmActive)
            throw new Error("bruh");
        }

        this.pythonWorker.terminate()
    }
}