export type Command = ICommand;

export interface ICommand {
    execute(): void

    undo?(): void
}
