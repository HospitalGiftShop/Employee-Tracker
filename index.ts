import express from 'express';
import { pool, connectToDb } from './connection.js';
import inquirer from 'inquirer';

await connectToDb();

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


function startQuery() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'intro',
            message: 'What would you like to do?',
            choices: [
                'View All Employees',
                'Add Employee',
                'Update Employee Role',
                'View All Roles',
                'Add Role',
                'View All Departments',
                'Add Department',
                'View Employees by Manager',
                'View Employees by Department',
                'Quit'
            ]
        }
    ]).then((answer: any) => {
        switch (answer.intro) {
            case 'View All Employees':
                showEmployees();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Update Employee Role':
                updateRole();
                break;
            case 'View All Roles':
                showRoles();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'View All Departments':
                showDepartments();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'View Employees by Manager':
                showEmployeesByManager();
                break;
            case 'View Employees by Department':
                showEmployeesByDepartment();
                break;
            case 'Quit':
                console.log('Woot!');
                process.exit();
        }
    });
};

const showDepartments = () => {
    pool.query(
        `SELECT department.id, department.name AS "Department" FROM department;`,
        (err, result) => {
            if (err) {
                console.error("Error retrieving departments:", err.message);
            } else {
                console.table(result.rows);
            }
            startQuery();
        }
    );
};

const showRoles = () => {
    pool.query(
        `SELECT role.id, role.title AS "Role", role.salary AS "Salary", department.name AS "Department" FROM role 
        INNER JOIN department ON department.id = role.department_id;`,
        (err, result) => {
            if (err) {
                console.error("Error retrieving departments:", err.message);
            } else {
                console.table(result.rows);
            }
            startQuery();
        }
    );
};

const showEmployees = () => {
    pool.query(
        `SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) as "Employee", role.title AS "Role", department.name AS "Department", role.salary AS "Salary", CONCAT(manager.first_name, ' ', manager.last_name) AS "Manager" 
        FROM employee 
        LEFT JOIN employee manager on manager.id = employee.manager_id 
        INNER JOIN role ON (role.id = employee.role_id) 
        INNER JOIN department ON (department.id = role.department_id) 
        ORDER BY employee.id;`,
        (err, result) => {
            if (err) {
                console.error("Error retrieving departments:", err.message);
            } else {
                console.table(result.rows);
            }
            startQuery();
        }
    );
};

const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'What is the name of the department?',
        }
    ]).then((answer) => {
        const sql = `INSERT INTO department (name) VALUES ($1)`;

        const value = [
            answer.department, // $1
        ];

        pool.query(sql, value, (err, res) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Added " + answer.department + " to the database")
            startQuery();
        });
    });
};

const addRole = () => {
    pool.query(`SELECT * FROM department;`, (err, res) => {
        const departmentList = res.rows.map(departments => ({
            name: departments.name,
            value: departments.id
        }));
        return inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the name of the role?',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the role?',
            },
            {
                type: 'list',
                name: 'department',
                message: 'Which Department does the role belong to?',
                choices: departmentList
            }
        ]).then((answers) => {
            const sql = `INSERT INTO role (title, salary, department_id) VALUES($1, $2, $3)`;

            const values = [
                answers.title,      // $1
                answers.salary,     // $2
                answers.department, // $3
            ];
            pool.query(sql, values, (err, res) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log("Added " + answers.title + " to the database")
                startQuery();
            });
        });
    });
};

const addEmployee = () => {
    pool.query(`SELECT * FROM employee;`, (err, res) => {
        if (err) {
            console.error("Error fetching employees:", err);
            return;
        }

        const employeeList = res.rows.map(employees => ({
            name: employees.first_name.concat(" ", employees.last_name),
            value: employees.id
        }));

        pool.query(`SELECT * FROM role;`, (err, res) => {
            if (err) {
                console.error("Error fetching roles:", err);
                return;
            }

            const roleList = res.rows.map(role => ({
                name: role.title,
                value: role.id
            }));

            console.log("Role List:", roleList);

            return inquirer.prompt([
                {
                    type: 'input',
                    name: 'first',
                    message: "What is the employee's first name?",
                },
                {
                    type: 'input',
                    name: 'last',
                    message: "What is the employee's last name?",
                },
                {
                    type: 'list',
                    name: 'role',
                    message: "What is the employee's role?",
                    choices: roleList,
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: "Who is the employee's manager?",
                    choices: employeeList,
                }
            ]).then((answers) => {

                const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`;

                const values = [
                    answers.first,         // $1
                    answers.last,          // $2
                    answers.role,          // $3
                    answers.manager        // $4
                ];

                // Run the query with the parameterized values
                pool.query(sql, values, (err, res) => {
                    if (err) {
                        console.error("Error inserting employee:", err);
                        return;
                    }
                    console.log(`Added ${answers.first} ${answers.last} to the database`);
                    startQuery();
                });
            });
        });
    });
};

const updateRole = () => {
    pool.query(`SELECT * FROM employee;`, (err, res) => {

        const employeeList = res.rows.map(employees => ({
            name: employees.first_name.concat(" ", employees.last_name),
            value: employees.id
        }));

        pool.query(`SELECT * FROM role;`, (err, res) => {
            const roleList = res.rows.map(role => ({
                name: role.title,
                value: role.id
            }));

            console.log("Role List:", roleList);

            return inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: "Which employee's role do you want to update?",
                    choices: employeeList
                },
                {
                    type: 'list',
                    name: 'role',
                    message: "Which role do you want to assign the selected employee?",
                    choices: roleList
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: "Who will be this employee's manager?",
                    choices: employeeList
                },

            ]).then((answers) => {
                pool.query(`UPDATE employee SET role_id= ${answers.role}, manager_id=${answers.manager} WHERE id =${answers.employee};`, (err, res) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log("Employee role updated")
                    startQuery();
                });
            });
        });
    });
}

const showEmployeesByManager = () => {
    pool.query(
        `SELECT * FROM employee 
        WHERE manager_id IS NULL;`,
        (err, res) => {

            const employeeList = res.rows.map(employees => ({
                name: employees.first_name.concat(" ", employees.last_name),
                value: employees.id
            }));

            return inquirer.prompt([
                {
                    type: 'list',
                    name: 'manager',
                    message: "Which managers employee's would you like to see?",
                    choices: employeeList
                },

            ]).then((answers) => {
                const sql = `SELECT employee.id, concat(employee.first_name, ' ', employee.last_name) as "Employee", role.title AS "Role", department.name AS "Department", role.salary AS "Salary", concat(manager.first_name, ' ', manager.last_name) AS "Manager"
                    FROM employee
                    LEFT JOIN employee manager on manager.id = employee.manager_id 
                    INNER JOIN role ON role.id = employee.role_id
                    INNER JOIN department ON department.id = role.department_id
                    WHERE employee.manager_id = $1
                    ORDER BY employee.id;`

                const value = [
                    answers.manager
                ]

                pool.query(sql, value, (err, res) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.table(res.rows);
                    startQuery();
                });
            });
        });
}

const showEmployeesByDepartment = () => {
    pool.query(`SELECT * FROM department;`, (err, res) => {

        const departmentList = res.rows.map(departments => ({
            name: departments.name,
            value: departments.id
        }));

        return inquirer.prompt([
            {
                type: 'list',
                name: 'department',
                message: "Which department employee's would you like to see?",
                choices: departmentList
            },

        ]).then((answers) => {
            const sql =
                `SELECT employee.id, concat(employee.first_name, ' ', employee.last_name) as "Employee", role.title AS "Role", department.name AS "Department", role.salary AS "Salary", concat(manager.first_name, ' ', manager.last_name) AS "Manager"
                    FROM employee
                    LEFT JOIN employee manager on manager.id = employee.manager_id 
                    INNER JOIN role ON role.id = employee.role_id
                    INNER JOIN department ON department.id = role.department_id
                    WHERE department.id = $1
                    ORDER BY employee.id;`

            const value = [
                answers.department
            ]

            pool.query(sql, value, (err, res) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.table(res.rows);
                startQuery();
            });
        });
    });
}

export { startQuery }

app.use((_req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
