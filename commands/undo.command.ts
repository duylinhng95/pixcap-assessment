import {ICommand} from "./command.interface";
import {EmployeeOrgApp} from "../employee-organization.app";

export class UndoCommand implements ICommand {
    constructor(
        private readonly app: EmployeeOrgApp,
        private readonly command?: ICommand
    ){}

    execute() {
        const undoCommand = this.command;
        if (!undoCommand || !undoCommand.undo) {
            return;
        }

        this.app.setRedoCommand(undoCommand);
        undoCommand.undo();
    }
}
