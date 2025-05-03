import {RAIIPython} from "$lib/RAIIPython";

export class RAIITranslator {
    private raiiPython: RAIIPython

    constructor(fetchFunction: (arg0: string) => Promise<Response>, _runtimeReadyCallback?: (() => void)) {
        console.log("testo")

        this.raiiPython = new RAIIPython(fetchFunction, () => {
            if (_runtimeReadyCallback) {
                _runtimeReadyCallback()
            }});
    }

    translateToGorgus(stringToTranslate: string) {
        this.raiiPython.runModule(["/home/web_user/gorgus/translate_to_gorgus.py", stringToTranslate]);
    }
}