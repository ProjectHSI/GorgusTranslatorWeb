// @ts-ignore
import { createEmscriptenModule } from '$lib/python/python.mjs';
// @ts-ignore
import pyStdLibZip from '$lib/python/python3.14.zip?url'

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
    private emscriptenProperties = {
        noInitialRun: true,
        onRuntimeInitalisation: () => {
            this.emscriptenRuntimeReady = true;
            if (this.runtimeReadyCallback)
                this.runtimeReadyCallback();
        },
        print: () => {
            console.log("o")
        },
        async preRun(Module: any): Promise<void> {
            const version = Module.HEAPU32[Module._Py_Version >>> 2];
            const major = (version >>> 24) & 0xff;
            const minor = (version >>> 24) & 0xff;

            Module.FS.mkdirTree(`/lib/python${major}.${minor}/lib-dynload/`);
            Module.addRunDependency("install-stdlib");
            const stdLibZip = await fetch(pyStdLibZip);
            const stdLibBuffer = await stdLibZip.arrayBuffer();
            Module.FS.writeFile(`/lib/python${major}.${minor}.zip`, new Uint8Array(stdLibBuffer), { canOwn: true });
            Module.removeRunDependency("install-stdlib");
        }
    };

    private emscriptenModule: any | undefined;

    //async waitForRuntimeReady(): Promise<void> {
        //return;
    //};

    constructor(_runtimeReadyCallback?: (() => void)) {
        this.runtimeReadyCallback = _runtimeReadyCallback;

        this.emscriptenModule = createEmscriptenModule(this.emscriptenProperties);
    };

    async runModule() {
        let Module = await this.emscriptenModule;

        const ret = Module.callMain();

        return ret;
    }
}