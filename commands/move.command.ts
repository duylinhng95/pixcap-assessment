import {ICommand} from "./command.interface";
import {EmployeeOrgApp} from "../employee-organization.app";
import {Employee} from "../interfaces";

export class MoveCommand implements ICommand {
    private oldSupervisorId: number;
    private backUpSubordinates: Employee[] = [];

    constructor (
        private readonly app: EmployeeOrgApp,
        private readonly employeeId: number,
        private readonly supervisorId: number
    ){
        this.oldSupervisorId = this.app.ceo.uniqueId;
    }

    undo() {
        for (const employee of this.backUpSubordinates) {
            const moveBackToSubordinate = new MoveCommand(this.app, employee.uniqueId, this.employeeId);
            moveBackToSubordinate.execute();
        }
        const undoMoveCommand = new MoveCommand(this.app, this.employeeId, this.oldSupervisorId);
        undoMoveCommand.execute();
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

        let subordinate = this.deepFindEmployee(this.app.ceo.subordinates, this.employeeId, true);

        this.backUpSubordinates = subordinate?.subordinates || [];

        if (!subordinate) {
            throw new Error('employee not found');
        }

        return subordinate;
    }

    private getSupervisor() {
        const supervisor = this.deepFindEmployee(this.app.ceo.subordinates, this.supervisorId);
        if (!supervisor) {
            throw new Error('supervisor is not found');
        }

        const existSubordinate = supervisor.subordinates.find((employee) => employee.uniqueId === this.employeeId);
        if (existSubordinate) {
            throw new Error('employee already is a subordinate of this supervisor');
        }

        return supervisor;
    }

    private cleanUpEmployees() {
        const oldSupervisor = this.deepFindEmployee(this.app.ceo.subordinates, this.oldSupervisorId);

        if (oldSupervisor) {
            oldSupervisor.subordinates = [
                ...oldSupervisor.subordinates.filter((employee) => employee.uniqueId !== this.employeeId),
                ...this.backUpSubordinates
            ]
        }
    }

    execute() {
        const subordinate = this.getSubordinate();
        subordinate.subordinates = [];

        const supervisor = this.getSupervisor();
        supervisor.subordinates.push(subordinate);

        this.cleanUpEmployees();

        this.app.setUndoCommand(this);
    }
}
