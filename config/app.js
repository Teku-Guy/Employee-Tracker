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

    // //view all the employees by department
    // viewAllEmployeesByDepartment(departmentId) {
    //     return this.connection.query(
    //         `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name
    //         FROM employee
    //         LEFT JOIN role ON employee.role_id = role.id
    //         LEFT JOIN department ON role.department_id = department.id
    //         WHERE department.id = ${departmentId}`
    //     )
    // }

    // // view all the employees by selected manager
    // viewAllEmployeesByManager(employeeId) {
    //     return this.connection.query(
    //         `SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title FROM employee
    //         LEFT JOIN role ON role.id = employee.role_id
    //         LEFT JOIN department ON department.id = role.department_id
    //         WHERE manager_id = ${employeeId}`
    //     )
    // }

    // // add new employee
    // createEmployee(employee) {
    //     return this.connection.query(
    //         `INSERT INTO employee SET ?`,
    //         employee
    //     )   `UPDATE employee SET role_id = ${roleId} 
            // WHERE id = ${employeeId}`
    // }

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

    // update selected employee's role
    async updateEmployeeRole(prompt, employeeId, roleId) {
        // get employeID
        try {
            await inquirer.prompt(
                [{
                    name: 'choice',
                    type: 'list',
                    message: 'Select An Employee',
                    choices: await this.getEmployee()
                }]).then(result => {
                    employeeId = result;
                    console.log(employeeId);
                });
                
            //return to the prompt
            //await prompt();
        } catch(err) {
            console.error(err);
        };
        //get roleId from sql
        //update role
    }

    // // update selected employee's manager
    // updateEmployeeManager(employeeId, managerId) {
    //     return this.connection.query(
    //         `UPDATE employee SET manager_id = ${managerId} 
    //         WHERE id = ${employeeId}`
    //     )
    // }

    // // remove the selected employee
    // removeEmployee(employeeId) {
    //     return this.connection.query(
    //         `DELETE FROM employee
    //         WHERE id = ${employeeId}`
    //     )
    // }

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

    // // view all the departments
    // viewAllDepartments() {
    //     return this.connection.query(
    //         `SELECT department.id, department.name, SUM(role.salary) AS utilized_budget 
    //         FROM department 
    //         LEFT JOIN role ON role.department_id = department.id 
    //         LEFT JOIN employee ON employee.role_id = role.id 
    //         GROUP BY department.id, department.name`
    //     );
    // }

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
}

module.exports = new App(connection);