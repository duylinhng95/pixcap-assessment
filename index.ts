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
app.move(4, 6);
app.undo();
app.redo();
