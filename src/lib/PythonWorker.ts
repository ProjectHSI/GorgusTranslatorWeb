// @ts-ignore
import createEmscriptenModule from '$lib/python/wasm/python.mjs';
// @ts-ignore
import pyStdLibZip from '$lib/python/wasm/python3.14.zip?url'

import JSZip from "jszip"

import {libraries, nltkData, scripts} from "$lib/fsSetup.compile";

/*for (const library of libraries) {
    import(`./src/lib/python/lib/${library}.zip?url`)
}

for (const nltkDatum of nltkData) {
    import(`./src/lib/nltk/${nltkDatum.directory}/${nltkDatum.file}.zip?url`)
}

for (const script of scripts) {
    import(`./src/lib/python_scripts/${script}.py?raw`)
}*/
/*console.log(
    import.meta.env.BASE_URL,
    import.meta.url,
    new URL(`./python/lib/click.zip`   , import.meta.url).href,
    new URL(`./python_scripts/setup.py`, import.meta.url).href,
    new URL(`./python_scripts/translate.py`, import.meta.url).href
);*/
//throw new Error();*/
import {PythonWorker} from "$lib/PythonWorker.Types";
import CommandType = PythonWorker.CommandType;
import DependencyGroups = PythonWorker.DependencyGroups;
//import {monitorEventLoopDelay} from "node:perf_hooks";

console.log("we runnin'")

//console.log(libraries);

class _PythonWorker {
    /*get pythonVersionMinor(): number {
        return this._pythonVersionMinor;
    }
    get pythonVersionMajor(): number {
        return this._pythonVersionMajor;
    }
    private _pythonVersionMajor: number = 3;
    private _pythonVersionMinor: number = 14;*/

    private emscriptenRuntimeReady = true;

    private runtimeReadyCallback: (() => void) | undefined = undefined;
    //private emscriptenProperties = };

    //private preRunReady = false;
    //private emscriptenRuntimeReady = false;

    currentStdin: SharedArrayBuffer = new SharedArrayBuffer(4096);
    private currentStdinInt32: Int32Array = new Int32Array<ArrayBufferLike>(this.currentStdin);
    private readIndex = 0;
    private returnedNull: number = 0;

    private log(data: string, logLevel: PythonWorker.LogLevel = PythonWorker.LogLevel.INFO) {
        postMessage({
            command_type: CommandType.WW_Log,
            log: data,
            log_level: logLevel
        } as PythonWorker.WebWorkerLogEvent);
    }

    private updateDependencyGroups(data?: DependencyGroups) {
        postMessage({
            command_type: CommandType.WW_Dependency,
            dependencyGroups: data
        } as PythonWorker.WebWorkerDependencyEvent)
    }

    //stdin(): number | null {


        //Atomics.

        //console.log(stdinString);

        //if (this.currentStdin != "")
            //this.currentStdin = stdinString;
        //else
            //this.currentStdin += stdinString;
    //}

    private static returnedNullTimes = 2;

    private createEmscriptenProperties(fetchFunction: (arg0: string) => Promise<Response>) {
        let emscriptenRuntimeReady = true;
        let prerunReady = false;

        const runtimeReady = () => {
            if (emscriptenRuntimeReady && prerunReady) {
                this.emscriptenRuntimeReady = true;

                log("Runtime ready!");

                if (this.runtimeReadyCallback)
                    this.runtimeReadyCallback();
            }

            //console.log("kill everybody");
        }

        const popStdin = () => {
            //console.log("we called")

            try {
                if (this.returnedNull) {
                    if (this.returnedNull != _PythonWorker.returnedNullTimes) {
                        this.returnedNull += 1;
                        return null;
                    }

                    this.returnedNull = 0;

                    //console.log("i sleep");

                    this.currentStdinInt32[0] = 0;

                    // The primary purpose of this action is the "wait", not the comparison. THe comparison is just to check that it's actually set correctly.
                    const atomicWaitResult = Atomics.wait(this.currentStdinInt32, 0, 0);
                    //console.log(atomicWaitResult);
                    //if ( == "ok") {
                        //throw new Error("Logic Error #1 - _PythonWorker.stdin()")
                    //}

                    //console.log("we going man");

                    this.readIndex = 0;

                    return null;
                }

                //console.log("branch 1")

                if (this.readIndex == Atomics.load(this.currentStdinInt32, 0)) {
                    console.log("end of stdin")

                    this.returnedNull += 1;
                    // we can receive new data
                    Atomics.notify(this.currentStdinInt32, 0);
                    return null;
                }

                //console.log("branch 2")

                //console.log(this.readIndex);
                this.readIndex = this.readIndex + 1;
                //console.log(this.readIndex);
                return Atomics.load(this.currentStdinInt32, this.readIndex);
            } catch (e) {
                console.log("caught excpetion in popStdin");
                console.log(e);
                //debugger;
                return null;
            }
        };

        const log = this.log;
        const updateDependencyGroups = this.updateDependencyGroups;

        return {
            noInitialRun: true,
            onRuntimeInitialized: () => {
                //emscriptenRuntimeReady = true;

                //console.log("Runtime ready!");

                //runtimeReady();
            },
            print: (event: any) => {
                postMessage({
                    command_type: PythonWorker.CommandType.VM_Stdout,
                    stream_text: event
                } as PythonWorker.StdStreamEvent);
                log(`[PYTHON]: ${event}`);
            },
            stdin: popStdin,
            async preRun(Module: any): Promise<void> {
                //console.log(Module)
                //console.log(Module.HEAPU32);
                //console.log(Module._Py_Version >>> 2);

                //const version = Module._Py_Version >>> 2;
                //const major = (version >>> 24) & 0xff;
                //const minor = (version >>> 16) & 0xff;

                //console.log(Module.FS);

                Module.FS.mkdir("/home/web_user/gorgus/");

                Module.FS.chdir("/home/web_user/gorgus/");
                Module.FS.mkdirTree(`/home/web_user/gorgus/lib/python3.14/lib-dynload/`);
                Module.FS.mkdirTree(`/home/web_user/gorgus/lib/python3.14/packages/`);
                Module.FS.mkdirTree(`/home/web_user/gorgus/nltk_data`);

                //console.log(Module);

                const downloadPromises: Promise<void>[] = []
                let dependencyGroups: PythonWorker.DependencyGroups | undefined = [];

                const scriptsDependencyGroup = dependencyGroups.push({ name: "Scripts", dependencies: [] }) - 1;
                updateDependencyGroups(dependencyGroups);

                for (const script of scripts) {
                    //console.log(script);

                    downloadPromises.push((async () => {
                        console.log(dependencyGroups)
                        const scriptDependencyNumber = dependencyGroups[scriptsDependencyGroup].dependencies.push({ name: script, status: "Downloading" }) - 1;
                        updateDependencyGroups(dependencyGroups);

                        const scriptUrl = new URL(`./python_scripts/${script}.py`, import.meta.url).href;
                        const scriptText = await (await fetch(scriptUrl)).text();

                        dependencyGroups[scriptsDependencyGroup].dependencies[scriptDependencyNumber].status = "Saving";
                        updateDependencyGroups(dependencyGroups);

                        Module.FS.writeFile(`/home/web_user/gorgus/${script}.py`, scriptText, { canOwn: true });
                        dependencyGroups[scriptsDependencyGroup].dependencies[scriptDependencyNumber].status = "Done";
                        updateDependencyGroups(dependencyGroups);
                    })());
                    //await Promise.all(downloadPromises);
                }

                const libraryDependencyGroup = dependencyGroups.push({ name: "Libraries", dependencies: [] }) - 1;
                updateDependencyGroups(dependencyGroups);

                for (const library of libraries) {
                    downloadPromises.push((async () => {
                        log(`Downloading library "${library}"...`)
                        const libraryDependencyNumber = dependencyGroups[libraryDependencyGroup].dependencies.push({ name: library, status: "Downloading" }) - 1;
                        updateDependencyGroups(dependencyGroups);

                        const libraryUrl = new URL(`./python/lib/${library}.zip`, import.meta.url).href;
                        const libraryResponse = await fetchFunction(libraryUrl);

                        const libraryResponseBuffer = await libraryResponse.arrayBuffer();

                        // prevent the overlay from getting overlayed :tm:
                        if (library != "overlays") {
                            const libraryPath = library == "gorgus" ? "/home/web_user/gorgus/lib/python3.14/packages/" : "/home/web_user/gorgus/gorgus_translator/"

                            log(`Extracting library "${library}" to "${libraryPath}".`);
                            dependencyGroups[libraryDependencyGroup].dependencies[libraryDependencyNumber].status = "Extracting";
                            updateDependencyGroups(dependencyGroups);

                            let jsZip = await JSZip.loadAsync(libraryResponseBuffer);

                            for (const jsZipFile of Object.keys(jsZip.files)) {
                                //console.log(jsZipFile);

                                if (jsZip.files[jsZipFile].dir)
                                    continue;

                                const splitFileName = jsZipFile.split("/");

                                //console.log(jsZipFile);
                                Module.FS.mkdirTree(`${libraryPath}/${splitFileName.slice(0, splitFileName.length - 1).join("/")}`);
                                Module.FS.writeFile(`${libraryPath}/${jsZipFile}`, await jsZip.files[jsZipFile].async("uint8array"));
                                //
                            }

                            log(`Extracted library "${library}" to "${libraryPath}".`);
                        } else {
                            log(`Saving library "${library}" to "lib/python3.14/packages/${library}.zip".`);
                            dependencyGroups[libraryDependencyGroup].dependencies[libraryDependencyNumber].status = "Saving";
                            updateDependencyGroups(dependencyGroups);

                            Module.FS.writeFile(`/home/web_user/gorgus/lib/python3.14/packages/${library}.zip`, new Uint8Array(libraryResponseBuffer), {canOwn: true});
                            //console.log(`lib/python3.14/packages/${library}.zip`);

                            log(`Saved library "${library}" to "lib/python3.14/packages/${library}.zip".`);
                        }

                        dependencyGroups[libraryDependencyGroup].dependencies[libraryDependencyNumber].status = "Done";
                        updateDependencyGroups(dependencyGroups);
                    })());
                    //await Promise.all(downloadPromises);
                }

                const nltkDependencyGroup = dependencyGroups.push({ name: "NLTK", dependencies: [] }) - 1;
                updateDependencyGroups(dependencyGroups);

                for (const nltkDataFile of nltkData) {
                    downloadPromises.push((async () => {
                        //console.log(`$lib/nltk/${nltkDataFile.directory}/${nltkDataFile.file}.zip?url`)
                        log(`Downloading NLTK Data "${nltkDataFile.directory + "." + nltkDataFile.file}" to "nltk_data/${nltkDataFile.directory}/${nltkDataFile.file}.zip".`);
                        const nltkDependencyNumber = dependencyGroups[nltkDependencyGroup].dependencies.push({ name: nltkDataFile.directory + "." + nltkDataFile.file, status: "Downloading" }) - 1;
                        updateDependencyGroups(dependencyGroups);

                        const combinedDataFile = nltkDataFile.directory + "." + nltkDataFile.file;
                        //const preProcessUrl = `./nltk/${nltkDataFile.directory}/${nltkDataFile.file}.zip?url`;

                        const libraryUrl = new URL(`./nltk/${combinedDataFile}.zip`, import.meta.url).href;
                        const libraryResponse = await fetchFunction(libraryUrl);
                        const libraryResponseBuffer = await libraryResponse.arrayBuffer();

                        dependencyGroups[nltkDependencyGroup].dependencies[nltkDependencyNumber].status = "Extracting";
                        updateDependencyGroups(dependencyGroups);

                        let jsZip = await JSZip.loadAsync(libraryResponseBuffer);

                        for (const jsZipFile of Object.keys(jsZip.files)) {
                            //console.log(jsZipFile);

                            if (jsZip.files[jsZipFile].dir)
                                continue;

                            const splitFileName = jsZipFile.split("/");

                            //console.log(`/home/web_user/gorgus/nltk_data/${nltkDataFile.directory}/${jsZipFile}`);
                            Module.FS.mkdirTree(`/home/web_user/gorgus/nltk_data/${nltkDataFile.directory}/${splitFileName.slice(0, splitFileName.length - 1).join("/")}`);
                            Module.FS.writeFile(`/home/web_user/gorgus/nltk_data/${nltkDataFile.directory}/${jsZipFile}`, await jsZip.files[jsZipFile].async("uint8array"));
                            //
                        }

                        dependencyGroups[nltkDependencyGroup].dependencies[nltkDependencyNumber].status = "Saving";
                        updateDependencyGroups(dependencyGroups);

                        Module.FS.mkdirTree(`/home/web_user/gorgus/nltk_data/${nltkDataFile.directory}`)
                        Module.FS.writeFile(`/home/web_user/gorgus/nltk_data/${nltkDataFile.directory}/${nltkDataFile.file}.zip`, new Uint8Array(libraryResponseBuffer), {canOwn: true});

                        dependencyGroups[nltkDependencyGroup].dependencies[nltkDependencyNumber].status = "Done";
                        updateDependencyGroups(dependencyGroups);
                    })());
                    //await Promise.all(downloadPromises);
                }

                await Promise.all(downloadPromises);

                dependencyGroups = undefined;
                updateDependencyGroups(dependencyGroups);

                //Module.ENV.NLTK_DATA = "/home/web_user/gorgus/nltk_data/"

                Module.addRunDependency("install-stdlib");
                //console.log(Module.HEAPU8)

                const stdLibZip = await fetchFunction(pyStdLibZip);
                const stdLibBuffer = await stdLibZip.arrayBuffer();
                Module.FS.writeFile(`lib/python314.zip`, new Uint8Array(stdLibBuffer), {canOwn: true});
                Module.removeRunDependency("install-stdlib");

                //console.log("yip");
                prerunReady = true;
                runtimeReady();
            }
        }
    }

    private emscriptenModule: any | undefined;

    //async waitForRuntimeReady(): Promise<void> {
        //return;
    //};

    constructor(fetchFunction: (arg0: string) => Promise<Response>, _runtimeReadyCallback?: (() => void)) {
        this.runtimeReadyCallback = _runtimeReadyCallback;

        this.emscriptenModule = createEmscriptenModule(this.createEmscriptenProperties(fetchFunction));

        //console.log("...")
    };

    async runModule(args: string[]) {
        let Module = await this.emscriptenModule;

        //console.log("running main()")
        Module.callMain(args);

        //return ret;
    }

    //async stopModule() {
        //Module.
    //}
}

let currentPythonWorker: _PythonWorker | undefined = undefined;

onmessage = async (e: MessageEvent<PythonWorker.Command>) => {
    console.log(e.data)

    switch (e.data.command_type) {
        case PythonWorker.CommandType.Startup_VM:
            currentPythonWorker = new _PythonWorker(fetch, () => { postMessage(
                {
                    command_type: PythonWorker.CommandType.VM_Ready,
                    stdInBuffer: currentPythonWorker?.currentStdin
                } as PythonWorker.ReadyEvent)
            });

            console.log("signal")

            break;
        case PythonWorker.CommandType.Run_VM:
            if (currentPythonWorker == undefined)
                throw new Error("PythonWorker not created. Use the Startup_VM command first.");

            // @ts-ignore
            currentPythonWorker.runModule(e.data.args).then(r => {});

            break;
        case PythonWorker.CommandType.VM_Stdin:
            if (currentPythonWorker == undefined)
                throw new Error("PythonWorker not created. Use the Startup_VM command first.");

            //console.log("beepbop")

            // @ts-ignore
            currentPythonWorker.stdin(e.data.stream_text);

            break;
        case PythonWorker.CommandType.Shutdown_VM:
            currentPythonWorker = undefined

            break;
    }
}

console.log('moduleReady')