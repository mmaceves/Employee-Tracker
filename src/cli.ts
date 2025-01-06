import inquirer from 'inquirer';
import fs from 'fs';
import {QueryResult} from 'pg';
import {pool, connectToDb} from './connections.js';


function menu() {
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
};


function ViewDepartments() {
    pool.query('SELECT id, name FROM department;', (error: Error, results: QueryResult) => {
        if (error) {
            throw error;
        } else {
        console.table(results.rows);
        menu();
    }})
};

function ViewRole() {
    pool.query('SELECT role.id, title, department.name AS department, salary FROM role JOIN department ON role.department_id = department.id;', (error: Error, results: QueryResult) => {
        if (error) {
            throw error;
        } else {
        console.table(results.rows);
        menu();
    }})
};

function ViewEmployee() {
    pool.query(`Select employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee
                LEFT JOIN employee AS manager ON employee.manager_id = manager.id
                JOIN role ON employee.role_id = role.id
                JOIN department ON role.department_id = department.id;`, (error: Error, results: QueryResult) => {
        if (error) {
            throw error;
        } else {
        console.table(results.rows);
        menu();
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
                menu();
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
                menu();
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
                menu();
            }
        })
    })
};

menu();
