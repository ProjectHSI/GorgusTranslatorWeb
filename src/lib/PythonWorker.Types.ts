export namespace PythonWorker {
    export enum CommandType {
        Startup_VM,
        Run_VM,
        VM_Stdin,
        Shutdown_VM,

        VM_Ready,
        VM_Stdout,

        WW_Log,
        WW_Dependency
    }

    export interface StartupCommand {
        command_type: CommandType.Startup_VM;
    }

    export interface RunCommand {
        command_type: CommandType.Run_VM;
        args: string[];
    }

    export interface StdStreamEvent {
        command_type: CommandType.VM_Stdin | CommandType.VM_Stdout;
        stream_text: string;
    }

    export interface ShutdownCommand {
        command_type: CommandType.Shutdown_VM;
    }

    export interface ReadyEvent {
        command_type: CommandType.VM_Ready;
        stdInBuffer: SharedArrayBuffer;
    }

    export enum LogLevel {
        INFO,
        WARN
    }

    export const logLevelToColour: { [index in keyof typeof LogLevel]: string } = {
        INFO: "white",
        WARN: "yellow"
    }

    export interface WebWorkerLogEvent {
        command_type: CommandType.WW_Log,
        log: string,
        log_level: LogLevel
    }

    export interface DependencyState {
        name: string,
        status: string
    }

    export interface DependencyGroup {
        name: string,
        dependencies: DependencyState[]
    }

    export type DependencyGroups = DependencyGroup[];

    export interface WebWorkerDependencyEvent {
        command_type: CommandType.WW_Dependency,
        dependencyGroups?: DependencyGroups
    }

    export type Command =
        StartupCommand |
        RunCommand |
        StdStreamEvent |
        ShutdownCommand |
        ReadyEvent |
        WebWorkerLogEvent |
        WebWorkerDependencyEvent;
}