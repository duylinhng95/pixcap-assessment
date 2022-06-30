import {Employee} from './interfaces';
import {EmployeeOrgApp} from "./employee-organization.app";

const employees: Employee[] = [{
    uniqueId: 2,
    name: 'Linh',
    subordinates: [
        {
            uniqueId: 4,
            name: 'Tan',
            subordinates: [
                {
                    uniqueId: 5,
                    name: 'Tan',
                    subordinates: []
                }
            ]
        }
    ]
}, {
    uniqueId: 3,
    name: 'Tan',
    subordinates: [
        {
            uniqueId: 6,
            name: 'Tan',
            subordinates: []
        }
    ]
}
];

const ceo: Employee = {
    uniqueId: 1,
    name: 'Mark Zuckerberg',
    subordinates: employees,
};

const app = new EmployeeOrgApp(ceo);
app.employees = employees;
console.log(app.employees);
app.move(4, 6);
debugger;
console.log(app.employees);
app.undo();
console.log(app.employees);
app.redo();
console.log(app.employees);
app.undo();
console.log(app.employees)
