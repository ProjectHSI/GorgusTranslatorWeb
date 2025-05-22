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

    private messageCallbacks: ((data: PythonWorker.Command) => boolean)[] = [];

    loadingLogs: string[] = $state([]);
    dependencies?: PythonWorker.DependencyGroups = $state(undefined);

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
                        args: ["translate.py"]
                    } as PythonWorker.RunCommand);

                    this.vmActive = true;
                    this._translatorReady = false;
                    break;

                case PythonWorker.CommandType.VM_Stdout:
                    //this.stdoutPromises[{ type: "G", text: "abd" }].
                    if (e.data.stream_text == "[GTW_O]: runtime_ready") {
                        this._translatorReady = true;
                    }

                    let _messageCallbacks = [];
                    for (const messageCallback of this.messageCallbacks) {
                        if (messageCallback(e.data))
                            _messageCallbacks.push(messageCallback);
                    }
                    break;

                case PythonWorker.CommandType.WW_Log:
                    this.loadingLogs.push(e.data.log);
                    break;

                case PythonWorker.CommandType.WW_Dependency:
                    this.dependencies = e.data.dependencyGroups;
                    break;
            }
        }

        console.log("reg")

        this.pythonWorker.postMessage({
            command_type: CommandType.Startup_VM
        } as PythonWorker.StartupCommand);

        console.log("send");

        //this.raiiPython = new RAIIPythonWorker(fetchFunction, () => {
            //this.raiiPython.runModule(["/home/web_user/gorgus/translate.py"]);

            //if (_runtimeReadyCallback) {
                //_runtimeReadyCallback()
            //}});
    }

    async waitForEvent(commandTypes: PythonWorker.CommandType[] | PythonWorker.CommandType, messageCondition?: (command: PythonWorker.Command) => boolean): Promise<PythonWorker.Command> {
        //console.log(typeof commandTypes);

        return new Promise((resolve) => {
            this.messageCallbacks.push((messageData) => {
                if (
                    typeof commandTypes == "object"
                        ? commandTypes.includes(messageData.command_type)
                        : messageData.command_type == commandTypes
                        && (messageCondition ? messageCondition(messageData) : true)
                ) {
                    resolve(messageData);
                    return true;
                } else {
                    return false;
                }
            })
        });
    }

    async waitUntilTranslatorReady(): Promise<void> {
        if (this._translatorReady) {
            return;
        } else {
            await this.waitForEvent(PythonWorker.CommandType.VM_Stdout, (event: PythonWorker.Command): boolean => {
                const castedCommand = event as PythonWorker.StdStreamEvent;
                return castedCommand.stream_text == "[GTW_O]: runtime_ready";
            });
        }
    }

    private translationOutputRegex = new RegExp("\\[GTW_O]: \\[TO]: \\[([EG]) \\[(!?)F]] \\{(.*)} \\{(.*)}");
    private dictionaryRegex = new RegExp("\\[GTW_O]: \\[D]: (.*)");

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

    async getDictionary(): Promise<PythonWorker.Dictionary> {
        //return new Promise((resolve, reject) => {
        if (!this.vmActive || this.pythonWorkerStdIn == undefined || this.pythonWorkerStdInInt32 == undefined) {
            console.log(this.vmActive, this.pythonWorkerStdIn, this.pythonWorkerStdInInt32)
            throw new Error("bruh");
        }

        /*this.stdoutCallbacks.push((data) => {
            let dictionaryRegexExec = this.dictionaryRegex.exec(data);

            if (dictionaryRegexExec == null)
                return;

            //console.log("got", dictionaryRegexExec[1], JSON.parse(dictionaryRegexExec[1]))

            resolve(JSON.parse(dictionaryRegexExec[1]));
        });*/

        this.stdin(`[GTW_I]: [DG]`);

        const dictionaryStdoutEvent = await this.waitForEvent(PythonWorker.CommandType.VM_Stdout, (event: PythonWorker.Command): boolean => {
            const castedCommand = event as PythonWorker.StdStreamEvent;
            return this.dictionaryRegex.exec(castedCommand.stream_text) !== null;
        });

        const castedDictionaryStdoutEvent: PythonWorker.StdStreamEvent = dictionaryStdoutEvent as PythonWorker.StdStreamEvent;
        const dictionaryRegexExecResult = this.dictionaryRegex.exec(castedDictionaryStdoutEvent.stream_text);

        if (!dictionaryRegexExecResult)
            throw new Error("getDictionary() Logic Error #1")

        return JSON.parse(dictionaryRegexExecResult[1]);
        //});
    }

    async translate(stringToTranslate: string, target: string, formal: boolean = true): Promise<string> {
        if (!this.vmActive || this.pythonWorkerStdIn == undefined || this.pythonWorkerStdInInt32 == undefined) {
            console.log(this.vmActive, this.pythonWorkerStdIn, this.pythonWorkerStdInInt32)
            throw new Error("bruh");
        }

        stringToTranslate = (this.textEncoder.encode(stringToTranslate)).toBase64({ alphabet: "base64" });

        this.stdin(`[GTW_I]: [${target} [${!formal ? "!" : ""}F]]: {${stringToTranslate}}`);

        const translationStdoutEvent = await this.waitForEvent(PythonWorker.CommandType.VM_Stdout, (event: PythonWorker.Command): boolean => {
            const castedCommand = event as PythonWorker.StdStreamEvent;
            const translationRegexExecResult = this.translationOutputRegex.exec(castedCommand.stream_text);

            // Check if the output is a translation result & check it matches the parameters
            return !!(translationRegexExecResult && translationRegexExecResult[1] === target && translationRegexExecResult[2] === (!formal ? "!" : "") && translationRegexExecResult[3] === stringToTranslate);
        });

        const castedTranslationStdoutEvent: PythonWorker.StdStreamEvent = translationStdoutEvent as PythonWorker.StdStreamEvent;
        const translationRegexExecResult = this.translationOutputRegex.exec(castedTranslationStdoutEvent.stream_text);

        if (!translationRegexExecResult)
            throw new Error("translate() Logic Error #1");

        // we don't need to do extra checking here because of the message condition area
        return this.textDecoder.decode(Uint8Array.fromBase64(translationRegexExecResult[4]));
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