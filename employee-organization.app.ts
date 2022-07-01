import {Employee, IEmployeeOrgApp} from "./interfaces";
import {Command, ICommand} from "./commands/command.interface";
import {MoveCommand} from "./commands/move.command";
import {UndoCommand} from "./commands/undo.command";
import {RedoCommand} from "./commands/redo.command";

export class EmployeeOrgApp implements IEmployeeOrgApp {
    ceo: Employee;
    private undoCommand: ICommand | undefined;
    private redoCommand: ICommand | undefined;

    constructor(ceo: Employee) {
        this.ceo = ceo;
    }

    setUndoCommand(command: Command | undefined) {
        this.undoCommand = command;
    }

    setRedoCommand(command: Command | undefined) {
        this.redoCommand = command;
    }

    move(employeeId: number, supervisorId: number) {
        const moveCommand = new MoveCommand(this, employeeId, supervisorId);
        moveCommand.execute();
    }

    undo() {
        const undoCommand = new UndoCommand(this, this.undoCommand);
        undoCommand.execute();
    }

    redo() {
        const redoCommand = new RedoCommand(this, this.redoCommand);
        redoCommand.execute();
    }
}
