// @ts-ignore
import createEmscriptenModule from '$lib/python/wasm/python.mjs';
// @ts-ignore
import pyStdLibZip from '$lib/python/wasm/python3.14.zip?url'

import JSZip from "jszip"

import {libraries, nltkData, scripts} from "$lib/fsSetup.compile"

//console.log(libraries);

export class RAIIPython {
    get pythonVersionMinor(): number {
        return this._pythonVersionMinor;
    }
    get pythonVersionMajor(): number {
        return this._pythonVersionMajor;
    }
    private _pythonVersionMajor: number = 3;
    private _pythonVersionMinor: number = 14;

    private emscriptenRuntimeReady = true;

    private runtimeReadyCallback: (() => void) | undefined = undefined;
    //private emscriptenProperties = };

    private preRunReady = false;
    //private emscriptenRuntimeReady = false;

    private createEmscriptenProperties(fetchFunction: (arg0: string) => Promise<Response>) {
        let emscriptenRuntimeReady = false;
        let prerunReady = false;

        const runtimeReady = () => {
            if (emscriptenRuntimeReady && prerunReady) {
                this.emscriptenRuntimeReady = true;

                if (this.runtimeReadyCallback)
                    this.runtimeReadyCallback();
            }

            //console.log("kill everybody");
        }

        return {
            noInitialRun: true,
            onRuntimeInitialized: () => {
                emscriptenRuntimeReady = true;
                runtimeReady();
            },
            print: (event: any) => {
                console.log(event);
            },
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
                Module.FS.mkdirTree(`lib/python3.14/lib-dynload/`);
                Module.FS.mkdirTree(`lib/python3.14/packages/`);
                Module.FS.mkdirTree(`nltk_data`);

                const downloadPromises: Promise<void>[] = []

                for (const script of scripts) {
                    //console.log(script);

                    downloadPromises.push((async () => {
                        const scriptText = await import(`$lib/python_scripts/${script}.py?raw`);
                        Module.FS.writeFile(`${script}.py`, scriptText.default, { canOwn: true });
                    })());
                    //await Promise.all(downloadPromises);
                }
                for (const library of libraries) {
                    downloadPromises.push((async () => {
                        const libraryUrl = await import(`$lib/python/lib/${library}.zip?url`);
                        const libraryResponse = await fetchFunction(libraryUrl.default);

                        const libraryResponseBuffer = await libraryResponse.arrayBuffer();

                        // prevent the overlay from getting overlayed :tm:
                        if (library != "overlays" && library != "gorgus") {
                            console.log(`Extracting library "${library}" to "lib/python3.14/packages/".`);

                            let jsZip = await JSZip.loadAsync(libraryResponseBuffer);

                            for (const jsZipFile of Object.keys(jsZip.files)) {
                                if (jsZip.files[jsZipFile].dir)
                                    continue;

                                const splitFileName = jsZipFile.split("/");

                                Module.FS.mkdirTree(`lib/python3.14/packages/${splitFileName.slice(0, splitFileName.length - 1).join("/")}`);
                                Module.FS.writeFile(`lib/python3.14/packages/${jsZipFile}`, await jsZip.files[jsZipFile].async("uint8array"));
                                //console.log(jsZipFile);
                            }
                        } else {
                            console.log(`Saving library "${library}" to "lib/python3.14/packages/${library}.zip".`);

                            Module.FS.writeFile(`lib/python3.14/packages/${library}.zip`, new Uint8Array(libraryResponseBuffer), {canOwn: true});
                            //console.log(`lib/python3.14/packages/${library}.zip`);
                        }
                    })());
                    //await Promise.all(downloadPromises);
                }
                for (const nltkDataFile of nltkData) {
                    downloadPromises.push((async () => {
                        //console.log(`$lib/nltk/${nltkDataFile.directory}/${nltkDataFile.file}.zip?url`)
                        console.log(`Saving NLTK Data "${nltkDataFile.directory + "." + nltkDataFile.file}" to "nltk_data/${nltkDataFile.directory}/${nltkDataFile.file}.zip".`);

                        const combinedDataFile = nltkDataFile.directory + "." + nltkDataFile.file;
                        //const preProcessUrl = `./nltk/${nltkDataFile.directory}/${nltkDataFile.file}.zip?url`;

                        const libraryUrl = await import(`./nltk/${combinedDataFile}.zip?url`);
                        const libraryResponse = await fetchFunction(libraryUrl.default);

                        Module.FS.mkdir(`nltk_data/${nltkDataFile.directory}`)
                        Module.FS.writeFile(`nltk_data/${nltkDataFile.directory}/${nltkDataFile.file}.zip`, new Uint8Array(await libraryResponse.arrayBuffer()), {canOwn: true});
                    })());
                }

                await Promise.all(downloadPromises);

                Module.ENV.NLTK_DATA = "/home/web_user/gorgus/nltk_data/"

                Module.addRunDependency("install-stdlib");
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

        console.log("...")
    };

    async runModule(args: string[]) {
        let Module = await this.emscriptenModule;

        const ret = Module.callMain(args);

        return ret;
    }
}