const connection = require("./connection");
const cTable = require('console.table');
const inquirer = require("inquirer");

class App {

    constructor(connection) {
        this.connection = connection;
    }

    //view all the employees
    async viewAllEmployees(prompt) {
        const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, CONCAT(e2.first_name, ' ' , e2.last_name) AS manager
            FROM employee 
            LEFT JOIN role ON role.id = employee.role_id 
            LEFT JOIN department ON department.id = role.department_id
            LEFT JOIN employee AS e2 ON e2.id = employee.manager_id`;
        try {
            await this.connection.promise().query(sql).then(([rows, fields]) => {
                console.log('\n');
                console.table(rows);
                console.log('\n');
            });
            await prompt();
        } catch(err) {
            console.log(err);
        }
    }

    async getDepartment(){
        const res = [];
        const sql = `SELECT * FROM department`;
        await this.connection.promise().query(sql).then(([rows, fields]) => {
            for(let i = 0; i < rows.length; i++){
                res.push(`${rows[i].id} ${rows[i].name}`)
            }
        })
        return res;
    }

    //view all the employees by department
    async viewAllEmployeesByDepartment(prompt, departmentId) {
        const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name
            FROM employee
            LEFT JOIN role ON employee.role_id = role.id
            LEFT JOIN department ON role.department_id = department.id
            WHERE department.id = ?`;
            try {
                await inquirer.prompt(
                    [{
                        name: 'deptChoice',
                        type: 'list',
                        message: 'Select A Department',
                        choices: await this.getDepartment()
                    }]).then(result => {
                        departmentId = result.deptChoice.split(' ', 1);
                        this.connection.query(sql, departmentId, (err, results) => {
                            console.table(results);
                            prompt();
                        });
                    });
            } catch(err) {
                console.log(err);
            }
    }

    // view all the employees by selected manager
    viewAllEmployeesByManager(employeeId) {
        return this.connection.query(
            `SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title FROM employee
            LEFT JOIN role ON role.id = employee.role_id
            LEFT JOIN department ON department.id = role.department_id
            WHERE manager_id = ${employeeId}`
        )
    }

    // add new employee
    createEmployee(employee) {
        return this.connection.query(
            `INSERT INTO employee SET ?`,
            employee
        )   `UPDATE employee SET role_id = ${roleId} 
            WHERE id = ${employeeId}`
    }

    async getEmployee(){
        const res = [];
        const sql = `SELECT * FROM employee`;
        await this.connection.promise().query(sql).then(([rows, fields]) => {
            for(let i = 0; i < rows.length; i++){
                res.push(`${rows[i].id} ${rows[i].first_name} ${rows[i].last_name}`)
            }
        })
        console.log(res);
        return res;
    }

    async getRole(){
        const res = [];
        const sql = `SELECT * FROM role`;
        await this.connection.promise().query(sql).then(([rows, fields]) => {
            for(let i = 0; i < rows.length; i++){
                res.push(`${rows[i].id} ${rows[i].title}`)
            }
        })
        console.log(res);
        return res;
    }

    // update selected employee's role
    async updateEmployeeRole(prompt, employeeId, roleId) {
        const sql = `UPDATE employee SET role_id = ?
            WHERE id = ?`;
        // get employeID
        try {
            await inquirer.prompt(
                [{
                    name: 'employee',
                    type: 'list',
                    message: 'Select An Employee',
                    choices: await this.getEmployee()
                }]).then(result => {
                    employeeId = result.employee.split(' ', 1)
                });
            await inquirer.prompt(
                [{
                    name: 'role',
                    type: 'list',
                    message: 'Choose the new Role',
                    choices: await this.getRole()
                }]).then(result => {
                    roleId = result.role.split(' ', 1)
                    const params = [roleId[0], employeeId[0]];
                    console.log(params)
                    this.connection.query(sql, params, (err, results) => {
                        console.log('updated!');
                        console.table(result);
                        prompt();
                    });
                });
                
            //return to the prompt
        } catch(err) {
            console.error(err);
        };
        //get roleId from sql
        //update role
    }

    async getManager() {
        const res = [];
        const sql = `SELECT * FROM `;
        await this.connection.promise().query(sql).then(([rows, fields]) => {
            for(let i = 0; i < rows.length; i++){
                res.push(`${rows[i].id} ${rows[i].title}`)
            }
        })
        console.log(res);
        return res;
    }

    // update selected employee's manager
    async updateEmployeeManager(prompt, employeeId, managerId) {
        const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`
        try {
            await inquirer.prompt(
                [{
                    name: 'employee',
                    type: 'list',
                    message: 'Select A Employee First!',
                    choices: await this.getEmployee()
                }]).then(result => {
                    employeeId = result.employee.split(' ', 1);
                });
            await inquirer.prompt(
                [{
                    name: 'manager',
                    type: 'list',
                    message: 'Now let us select a new Manager!',
                    choices: await this.getManager()
                }]).then(result => {
                    managerId = result.manager.split(' ', 1);
                    const params = [managerId[0], employeeId[0]];
                    this.connection.query(sql, params, (err, results) => {
                        console.table(results);
                        prompt();
                    });
            });
        } catch(err) {
            console.log(err);
        }
    }

    // remove the selected employee
    async removeEmployee(prompt, employeeId) {
        const sql = `DELETE FROM employee WHERE id = ?`

        try{
            await inquirer.prompt(
                [{
                    name: 'employee',
                    type: 'list',
                    message: 'Select An Employee',
                    choices: await this.getEmployee()
                }]).then(result => {
                    employeeId = result.employee.split(' ', 1)
                    this.connection.query(sql, employeeId[0], (err, results) => {
                        console.table(result + 'has been deleted');
                        prompt();
                    });
                });

        } catch(err){
            console.error(err);
        }
    }

    // view all the roles
    // viewAllRoles() {
    //     const sql = `SELECT role.id, role.title, role.salary, department.name 
    //     FROM role     LEFT JOIN department ON role.department_id = department.id`;
    //     this.connection.query(sql, (err, result) => {
    //         if(err) console.log(err);
    //         console.table(result);
    //     });
    // }

    // // add new role
    // createRole(role) {
    //     // return this.connection.query( `INSERT INTO role SET ?`,role);
    // }

    // // remove the selected role
    // removeRole(roleId) {
    //     return this.connection.query(
    //         `DELETE FROM role
    //         WHERE id = ${roleId}`
    //     );
    // }

    // view all the departments
    async viewAllDepartments() {
         const sql = `SELECT department.id, department.name, SUM(role.salary) AS utilized_budget 
            FROM department 
            LEFT JOIN role ON role.department_id = department.id 
            LEFT JOIN employee ON employee.role_id = role.id 
            GROUP BY department.id, department.name`;
        try {
            await this.connection.promise().query(sql).then(([rows, fields]) => {
                console.log('\n');
                console.table(rows);
                console.log('\n');
            });
            await prompt();
        } catch(err) {
            console.log(err);
        }
    }

    // // add new department
    // createDepartment(department) {
    //     return this.connection.query(
    //         `INSERT INTO department SET ?`,
    //         department
    //     );
    // }

    // // remove the selected department
    // removeDepartment(departmentId) {
    //     return this.connection.query(
    //         `DELETE FROM department
    //         WHERE id = ${departmentId}`
    //     );
    // }

    quit(){
        console.log('Goodbye! ^.^')
        this.connection.end();
    }
}

module.exports = new App(connection);