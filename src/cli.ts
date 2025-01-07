import inquirer from 'inquirer';
import { QueryResult } from 'pg';
import { pool } from './connections.js';


function menu() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Select an option.',
                name: 'choices',
                choices: [
                    'View All Departments',
                    'View All Roles',
                    'View All Employees',
                    'Add Department',
                    'Add Employee',
                    'Add Role',
                    'Update Employee Role',
                    'Update Employee Manager',
                    'Exit'
                ],
            }
        ])
        .then((answers) => {
            if (answers.choices === 'View All Departments') {
                ViewDepartments();
            }
            if (answers.choices === 'View All Roles') {
                ViewRole();
            }
            if (answers.choices === 'View All Employees') {
                ViewEmployee();
            }
            if (answers.choices === 'Add Department') {
                AddDepartment();
            }
            if (answers.choices === 'Add Employee') {
                AddEmployee();
            }
            if (answers.choices === 'Add Role') {
                AddRole();
            }
            if (answers.choices === 'Update Employee Role') {
                UpdateRole();
            }
            if (answers.choices === 'Update Employee Manager') {
                UpdateManager();
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

async function AddDepartment() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            message: 'Enter the name of the department.',
            name: 'department',
        }
    ]);

    try {
        await pool.query('INSERT INTO department (name) VALUES ($1)', [answers.department]);
        console.log(`Added ${answers.department} to the database.`);
    } catch (error) {
        throw error;
    } finally {
        menu();
    }
};

async function AddEmployee() {
    const roleChoices = await pool.query('SELECT id, title FROM role;');
    const answers = await
    inquirer
        .prompt ([
        {
            type: 'input',
            message: 'What is the employee\'s first name?',
            name: 'first_name',
        },
        {
            type: 'input',
            message: 'What is the employee\'s last name?',
            name: 'last_name',
        },
        {
            type: 'list',
            message: 'What is the employee\'s role?',
            name: 'role_id',
            choices: roleChoices.rows.map((role) => ({ name: role.title, value: role.id }))
        },
        {
            type: 'list',
            message: 'Who is the employee\'s manager?',
            name: 'manager_id',
            choices: [
                { name: 'None', value: null },
                { name: 'Bob Mack', value: 1 },
                { name: 'Justin Robinson', value: 2 },
                { name: 'Megan Flores', value: 3 }
            ]
        }
    ])
        try {
            await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]);
                 console.log(`Added ${answers.first_name} ${answers.last_name} to the database.`);
        } catch (error) {
            throw error;
        } finally {
            menu();
        }
    };

async function AddRole() {
    const departmentChoices = await pool.query('SELECT id, name FROM department;');
    const answers = await
    inquirer
        .prompt ([
        {
            type: 'input',
            message: 'What is the name of the role?',
            name: 'title',
        },
        {
            type: 'input',
            message: 'What is the salary for this role?',
            name: 'salary',
        },
        {
            type: 'list',
            message: 'Which department does this role belong to?',
            name: 'department_id',
            choices: departmentChoices.rows.map((department) => ({ name: department.name, value: department.id }))
        }
    ])
        try {
        await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [answers.title, answers.salary, answers.department_id]);
                console.log(`Added ${answers.title} to the database.`);
        } catch (error) {
            throw error;
        } finally {
                menu();
            }
        };

async function UpdateRole() {
    const roleChoices = await pool.query('SELECT id, title FROM role;');
    const nameChoices = await pool.query('SELECT id, first_name, last_name FROM employee;');
    const answers = await
    inquirer
        .prompt ([
        {
            type: 'list',
            message: 'Which employee\'s role would you like to update?',
            name: 'employee_id',
            choices: nameChoices.rows.map((employee) => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }))
        },
        {
            type: 'list',
            message: 'Which role do you want to assign the selected employee?',
            name: 'role_id',
            choices: roleChoices.rows.map((role) => ({ name: role.title, value: role.id }))
        }
    ])
        try {
        await pool.query('UPDATE employee SET role_id = $2 WHERE id = $1', [answers.employee_id, answers.role_id]);
                console.log(`Updated employee's role.`);
        } catch (error) {
            throw error;
        } finally {
                menu();
        }
    };

async function UpdateManager() {
    const nameChoices = await pool.query('SELECT id, first_name, last_name FROM employee;');
    const answers = await
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Which employee\'s manager would you like to update?',
                name: 'employee_id',
                choices: nameChoices.rows.map((employee) => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }))
            },
            {
                type: 'list',
                message: 'Which manager do you want to assign the selected employee?',
                name: 'manager_id',
                choices: [
                    { name: 'None', value: null },
                    { name: 'Bob Mack', value: 1 },
                    { name: 'Justin Robinson', value: 2 },
                    { name: 'Megan Flores', value: 3 }
                ]
            }
        ])
        try {
        await pool.query('UPDATE employee SET manager_id = $2 WHERE id = $1', [answers.employee_id, answers.manager_id]);
                console.log(`Updated employee's manager.`);
        } catch (error) {
            throw error;
        } finally {
                menu();
        }
};
menu();
