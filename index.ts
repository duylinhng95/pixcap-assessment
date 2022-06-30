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
console.log('1st CALLED: ', app.ceo.subordinates);
app.move(4, 6);
// debugger;
console.log('2nd CALLED: ', app.ceo.subordinates);
app.undo();
console.log('3rd CALLED: ', app.ceo.subordinates);
