import util from 'util';
import { exec } from "child_process"
const cpExec = util.promisify(exec);

export const gtwHash: string = (await cpExec("git rev-parse HEAD")).stdout;
export const gtHash: string = (await cpExec("cd Gorgus-Translator && git rev-parse HEAD")).stdout;