import {ICommand} from "./command.interface";
import {EmployeeOrgApp} from "../employee-organization.app";
import {MoveCommand} from "./move.command";

export class RemoveCommand implements ICommand {
    constructor(
        private readonly app: EmployeeOrgApp,
        private readonly employeeId: number,
        private readonly supervisorId: number
    ){}

    undo() {
        const moveCommand =  new MoveCommand(this.app, this.employeeId, this.supervisorId);
        moveCommand.execute();
    }

    execute() {
        const supervisor = this.app.employees.find((employee) => employee.uniqueId === this.supervisorId);
        if (!supervisor) {
            throw new Error('supervisor is not found');
        }

        const subordinate = supervisor.subordinates.find((employee) => employee.uniqueId === this.employeeId);
        if (!subordinate) {
            throw new Error('employee is not a subordinate of this supervisor');
        }

        const newSupervisor = {
            ...supervisor,
            subordinates: supervisor.subordinates.filter((employee) => employee.uniqueId !== this.employeeId)
        };

        const newEmployees = this.app.employees.filter((employee) => employee.uniqueId !== this.supervisorId);
        newEmployees.push(newSupervisor);
        newEmployees.push(subordinate);

        this.app.employees = newEmployees;
        this.app.setUndoCommand(this);
    }
}
