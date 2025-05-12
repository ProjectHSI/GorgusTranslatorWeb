//if (window == undefined)
    //throw new Error("CATEGORY 4 PROBLEM - compiletime script running in browser!")

import * as fs from "node:fs";
import JSZip from "jszip";

const pipLibs = fs.opendirSync("./src/lib/python/pip_libs");
let pipLibDirEnt: fs.Dirent | null = null

let _libraries: string[] = []

if (!fs.existsSync("./src/lib/python/lib"))
    fs.mkdirSync("./src/lib/python/lib");

async function generateZip(archivePath: string, zip: JSZip): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.writeFileSync(archivePath, "");

        zip
            .generateNodeStream({ type: "nodebuffer", streamFiles: true })
            .pipe(fs.createWriteStream(archivePath))
            .on("finish", () => {resolve();});
    })
}

async function generateLibraryZip(archiveName: string, zip: JSZip): Promise<void> {
    return generateZip(`./src/lib/python/lib/${archiveName}.zip`, zip);
}

async function generateLibraryZipFromWheel(wheel: string) {
    const archiveFilename = wheel.split("-")[0];

    console.log(`Generating "${archiveFilename}.zip"`);

    let jsZip = await JSZip.loadAsync(fs.readFileSync("./src/lib/python/pip_libs/" + wheel));

    for (const file of Object.keys(jsZip.files)) {
        //console.log(file);
        if (file.split("/")[0].match("dist-info")) {
            //console.log("burning with fire...");
            jsZip.remove(file); // BURN IT WITH FIRE
        }
    }

    // bruh
    //await (function (wheel: string) { return new Promise<void>((resolve, reject) => {
        /*if (wheel == null) {
            throw new Error("DIE");
        }*/

        // creates the file as well as erases it
        //fs.writeFileSync(`./src/lib/python/lib/${archiveFilename}.zip`, "");

        _libraries.push(archiveFilename);

        await generateLibraryZip(archiveFilename, jsZip);

    console.log(`Generated "${archiveFilename}.zip"`);
    //}) })(wheel);
}

let libraryGenerationPromises: Promise<void>[] = []

while ((pipLibDirEnt = pipLibs.readSync()) != null) {
    if (pipLibDirEnt.name.endsWith(".whl")) {
        // zip file

        libraryGenerationPromises.push(generateLibraryZipFromWheel(pipLibDirEnt.name))

        //console.log(await jsZip);
    } else if (pipLibDirEnt.name.endsWith(".tar.gz")) {
        // tar file
        // seem to be C modules, so no need to do anything... for now.
    }
}

await Promise.all(libraryGenerationPromises);

async function packageFolder(folder: string, archivePath: string) {
    let jsZip = new JSZip();

    function processFolder(currentJsZip: JSZip | null, pathToSearchIn: string): JSZip {
        if (currentJsZip == null)
            throw new Error("a");

        let entries: fs.Dirent[] = fs.readdirSync(pathToSearchIn, { withFileTypes: true });

        for (const entry of entries) {
            if (entry.isDirectory())
                processFolder(currentJsZip.folder(entry.name), entry.parentPath + "/" + entry.name);
            else if (entry.isFile()) {
                currentJsZip.file(entry.name, fs.readFileSync(entry.parentPath + "/" + entry.name));
            }
        }

        return currentJsZip;
    }

    jsZip = processFolder(jsZip, folder);

    await generateZip(archivePath, jsZip);
}

async function packageFolderAsPythonLib(folder: string, required: boolean, packageName: string, providePackage: boolean = true) {
    if (!fs.existsSync(folder)) {
        if (required) {
            throw new Error(folder + " must exist.");
        }
        return;
    }

    console.log(`Generating "${packageName}.zip"`);

    let jsZip = new JSZip();

    //jsZip.folder()

    function processFolder(currentJsZip: JSZip | null, pathToSearchIn: string): JSZip {
        if (currentJsZip == null)
            throw new Error("a");

        let entries: fs.Dirent[] = fs.readdirSync(pathToSearchIn, { withFileTypes: true });

        for (const entry of entries) {
            if (entry.isDirectory())
                processFolder(currentJsZip.folder(entry.name), entry.parentPath + "/" + entry.name);
            else if (entry.isFile()) {
                currentJsZip.file(entry.name, fs.readFileSync(entry.parentPath + "/" + entry.name));
            }
        }

        return currentJsZip;
    }

    let jsZipFolder = providePackage ? jsZip.folder(packageName) : jsZip;

    jsZipFolder = processFolder(jsZipFolder, folder);

    let archiveFilename = packageName

        // creates the file as well as erases it
        //fs.writeFileSync(`./src/lib/python/pip_libs_zip/${archiveFilename}.zip`, "");

    _libraries.push(packageName);

    await generateLibraryZip(packageName, jsZip);

    console.log(`Generated "${packageName}.zip"`);
}

// Package Gorgus
libraryGenerationPromises.push(packageFolderAsPythonLib("./Gorgus-Translator", true, "gorgus", false));
//await Promise.all(libraryGenerationPromises);
libraryGenerationPromises.push(packageFolderAsPythonLib("./src/lib/python_overlays/", true, "overlays", false));

//console.log("bap")

//const translateToGorgus = fs.readFileSync("./src/lib/python_scripts/translate_to_gorgus.py", { encoding: "utf-8" });

let _scripts: string[] = [];

const pythonScripts = fs.opendirSync("./src/lib/python_scripts");
let pythonScriptDirEnt: fs.Dirent | null = null

while ((pythonScriptDirEnt = pythonScripts.readSync()) != null) {
    _scripts.push(pythonScriptDirEnt.name.substring(0, pythonScriptDirEnt.name.length - 3))
}

pythonScripts.closeSync();

await Promise.all(libraryGenerationPromises);
pipLibs.closeSync();

let _nltkData: { directory: string, file: string }[] = [];

const nltkDataDir = fs.readdirSync("./src/lib/nltk", { withFileTypes: true });
//let nltkDataDirEnt: fs.Dirent | null = null;

for (const dirent of nltkDataDir) {
    if (dirent.isFile()) {
        //console.log(dirent);

        //const splitDireentPath = dirent.parentPath.split(new RegExp("[/\\\\]"))

        //const nltkDataDirectory = splitDireentPath[splitDireentPath.length - 1];

        //console.log(nltkDataDirectory);
        //console.log(dirent.name);

        _nltkData.push({ directory: dirent.name.split(".")[0], file: dirent.name.split(".").slice(1, 2).join(".") });
    }
}

//while ((nltkDataDirEnt = nltkDataDir.readSync()) != null) {
   // _scripts.push(nltkDataDirEnt.name.substring(0, nltkDataDirEnt.name.length - 3))
//}

//pythonScripts.closeSync();

console.log("All done!")

export const libraries = _libraries;
export const scripts: string[] = _scripts;
export const nltkData: { directory: string, file: string }[] = _nltkData;

// regen y