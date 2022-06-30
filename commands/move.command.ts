import {ICommand} from "./command.interface";
import {EmployeeOrgApp} from "../employee-organization.app";
import {RemoveCommand} from "./remove.command";
import {Employee} from "../interfaces";

export class MoveCommand implements ICommand {
    private oldSupervisorId: number | null = null;
    constructor (
        private readonly app: EmployeeOrgApp,
        private readonly employeeId: number,
        private readonly supervisorId: number
    ){}

    undo() {
        const removeCommand = new RemoveCommand(this.app, this.employeeId, this.supervisorId);
        removeCommand.execute();
    }

    deepFindEmployee(employees: Employee[], employeeId: number, isSaveParentId = false): Employee | undefined {
        for (const childEmployee of employees) {
            if (childEmployee.uniqueId === employeeId) {
                return childEmployee;
            }

            let result;

            if (childEmployee.subordinates.length) {
                result = this.deepFindEmployee(childEmployee.subordinates, employeeId);
                if (isSaveParentId) this.oldSupervisorId = childEmployee.uniqueId;
                if (result) {
                    return result;
                }
            }
        }
    }

    private getSubordinate() {
        if (this.employeeId === this.app.ceo.uniqueId) {
            throw new Error('employeeId must not be ceo');
        }

        let subordinate = this.deepFindEmployee(this.app.employees, this.employeeId);

        if (!subordinate) {
            throw new Error('employee not found');
        }

        return subordinate;
    }

    private getSupervisor() {
        const supervisor = this.deepFindEmployee(this.app.employees, this.supervisorId);
        if (!supervisor) {
            throw new Error('supervisor is not found');
        }

        const existSubordinate = supervisor.subordinates.find((employee) => employee.uniqueId === this.employeeId);
        if (existSubordinate) {
            throw new Error('employee already is a subordinate of this supervisor');
        }

        return supervisor;
    }

    cleanUpEmployees(subordinate: Employee) {
        if (this.oldSupervisorId) {
            const oldSupervisorId = this.deepFindEmployee(this.app.employees, this.oldSupervisorId);
            if (oldSupervisorId) oldSupervisorId.subordinates = {
                ...oldSupervisorId.subordinates,
                ...subordinate.subordinates
            }

            subordinate.subordinates = [];
        }
    }

    execute() {
        const subordinate = this.getSubordinate();
        const supervisor = this.getSupervisor();

        supervisor.subordinates.push(subordinate);

        this.cleanUpEmployees(subordinate);

        this.app.setUndoCommand(this);
    }
}
