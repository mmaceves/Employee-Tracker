import inquirer from 'inquirer';
import {pool, connectToDb} from './connections.js';
import {QueryResult} from 'pg';

function ViewDepartments() {
    pool.query('SELECT * FROM department', (error: Error, results: QueryResult) => {
        if (error) {
            throw error;
        } else {
        console.table(results.rows);
    }})
};
function ViewRole() {
    pool.query('SELECT * FROM role', (error: Error, results: QueryResult) => {
        if (error) {
            throw error;
        } else {
        console.table(results.rows);
    }})
};
function ViewEmployee() {
    pool.query('SELECT * FROM employee', (error: Error, results: QueryResult) => {
        if (error) {
            throw error;
        } else {
        console.table(results.rows);
    }})
};
function AddDepartment() {
    inquirer
        .prompt ([
        {
            type: 'input',
            message: 'Enter the name of the department.',
            name: 'department',
        }
    ])
        .then((answers) => {
        pool.query('INSERT INTO department (name) VALUES ($1)', [answers.department], (error: Error, results: QueryResult) => {
            if (error) {
                throw error;
            } else {
                console.log('Department added.')
            }
        })
    })
};
function AddEmployee() {
    inquirer
        .prompt ([
        {
            type: 'input',
            message: 'Enter the first name of the employee.',
            name: 'first_name',
        },
        {
            type: 'input',
            message: 'Enter the last name of the employee.',
            name: 'last_name',
        },
        {
            type: 'input',
            message: 'Enter the role ID of the employee.',
            name: 'role_id',
        },
        {
            type: 'input',
            message: 'Enter the manager ID of the employee.',
            name: 'manager_id',
        }
    ])
        .then((answers) => {
        pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [answers.first_name, answers.last_name, answers.role_id, answers.manager_id], (error: Error, results: QueryResult) => {
            if (error) {
                throw error;
            } else {
                console.log('Employee added.')
            }
        })
    })
};
function UpdateRole() {
    inquirer
        .prompt ([
        {
            type: 'input',
            message: 'Enter the employee ID.',
            name: 'employee_id',
        },
        {
            type: 'input',
            message: 'Enter the new role ID.',
            name: 'role_id',
        }
    ])
        .then((answers) => {
        pool.query('UPDATE employee SET role_id = $2 WHERE id = $1', [answers.employee_id, answers.role_id], (error: Error, results: QueryResult) => {
            if (error) {
                throw error;
            } else {
                console.log('Employee role updated.')
            }
        })
    })
};

inquirer
    .prompt ([
        {
            type: 'list',
            message: 'Select an option.',
            name: 'choices',
            choices: [
                    'View all departments', 
                    'View all roles', 
                    'View all employees', 
                    'Add a department', 
                    'Add an employee', 
                    'Update an employee role',
                    'Exit'
                    ],
        }
    ])
    .then((answers) => {
        if (answers.choices === 'View all departments') {
            ViewDepartments();
        }
        if (answers.choices === 'View all roles') {
            ViewRole();
        }
        if (answers.choices === 'View all employees') {
            ViewEmployee();
        }
        if (answers.choices === 'Add a department') {
            AddDepartment();
        }
        if (answers.choices === 'Add an employee') {
            AddEmployee();
        }
        if (answers.choices === 'Update an employee role') {
            UpdateRole();
        }
        if (answers.choices === 'Exit') {
            pool.end();
        }
    });

