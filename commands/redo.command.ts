import {ICommand} from "./command.interface";
import {EmployeeOrgApp} from "../employee-organization.app";

export class RedoCommand implements ICommand {
    constructor(
        private readonly app: EmployeeOrgApp,
        private readonly command?: ICommand
    ){}

    execute() {
        const redoCommand = this.command;
        if (!redoCommand || !redoCommand.execute) {
            return;
        }

        this.app.setUndoCommand(redoCommand);
        this.app.setRedoCommand(undefined);
        redoCommand.execute();
    }
}
