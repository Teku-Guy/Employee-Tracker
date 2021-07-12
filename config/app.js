const connection = require("./connection");
const cTable = require('console.table');
const inquirer = require("inquirer");
const { captureRejections } = require("events");
const prompts = require("../lib/prompts");

class App {

    constructor(connection) {
        this.connection = connection;
    }

    //get DeptId from sql
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

    //get roleId from sql
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

    //get empId from sql
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

    //get managerID from sql
    // async getManager() {
    //     const res = [];
    //     const sql = `SELECT * FROM `;
    //     await this.connection.promise().query(sql).then(([rows, fields]) => {
    //         for(let i = 0; i < rows.length; i++){
    //             res.push(`${rows[i].id} ${rows[i].title}`)
    //         }
    //     })
    //     console.log(res);
    //     return res;
    // }

    //view all the employees
    async viewAllEmployees(prompt) {
        const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(e2.first_name, ' ' , e2.last_name) AS manager
            FROM employee 
            LEFT JOIN role ON role.id = employee.role_id 
            LEFT JOIN department ON department.id = role.department_id
            LEFT JOIN employee AS e2 ON e2.id = employee.manager_id`;
        try {
            await this.connection.promise().query(sql).then(([rows, fields]) => {
                console.table(rows);
                console.log('\n');
            });
            await prompt();
        } catch(err) {
            console.log(err);
        }
    }

    //view all the employees by department
    async viewByDepartment(prompt) {
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
                    }]).then(res => {
                        let departmentId = res.deptChoice.split(' ', 1);
                        this.connection.query(sql, departmentId, (err, results) => {
                            console.table(results);
                            prompt();
                        });
                    });
            } catch(err) {
                console.log(err);
            }
    }

    // view all the roles
    async viewAllRoles(prompt) {
        const sql = `SELECT role.id, role.title, role.salary, department.name 
            FROM role
            LEFT JOIN department ON role.department_id = department.id`;
        try{
            await this.connection.promise().query(sql).then(([rows, fields]) => {
                console.table(rows);
                console.log('\n');
            });
            await prompt();
        } catch(err){
            console.error(err);
        }
        
    }

    // view all the departments
    async viewAllDepartments(prompt) {
        const sql = `SELECT department.id, department.name, SUM(role.salary) AS utilized_budget 
           FROM department 
           LEFT JOIN role ON role.department_id = department.id 
           LEFT JOIN employee ON employee.role_id = role.id 
           GROUP BY department.id, department.name`;
       try {
           await this.connection.promise().query(sql).then(([rows, fields]) => {
               console.table(rows);
               console.log('\n');
           });
           await prompt();
       } catch(err) {
           console.log(err);
       }
   }


    // // view all the employees by selected manager
    // async viewAllEmployeesByManager(employeeId) {
    //     this.connection.query(
    //         `SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title FROM employee
    //         LEFT JOIN role ON role.id = employee.role_id
    //         LEFT JOIN department ON department.id = role.department_id
    //         WHERE manager_id = ?`)
    // }

    // add new employee
    async addEmployee(prompt) {
        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
        const params = [];
        try{
            await inquirer.prompt(
                [{
                    name: 'fName',
                    type: 'input',
                    message: "What is your new employee's First Name?",
                    //validate if anything was entered
                    validate: fNameInput => {
                        if (fNameInput) {
                          return true;
                        } else {
                          console.log('You need to enter a name!');
                          return false;
                        }
                      }
                }]).then(res => {
                    params.push(res.fName.trim());
                });
            await inquirer.prompt(
                [{
                    name: 'lName',
                    type: 'input',
                    message: "What is your new employee's Last Name?",
                    //validate if anything was entered
                    validate: lNameInput => {
                        if (lNameInput) {
                          return true;
                        } else {
                          console.log('You need to enter a last name!');
                          return false;
                        }
                      }
                }]).then(res => {
                    params.push(res.lName.trim());
                });
            await inquirer.prompt(
                [{
                    name: 'roleId',
                    type: 'list',
                    message: "What is your new employee's Last Name?",
                    choices: await this.getRole()
                }]).then(res => {
                    params.push(res.roleId.split(' ', 1));
                });
            await inquirer.prompt(
                [{
                    name: 'managerAdd',
                    type: 'confirm',
                    message: "Would you like to add a manager to your new employee?",
                    default: false
                }]).then(async res => {
                    //if user wants to add a manager
                    if(res.managerAdd){
                        // select manager from employes
                        await inquirer.prompt(
                            [{
                                name: 'manager',
                                type: 'list',
                                message: "Choose Your manager?",
                                choices: await this.getEmployee()
                            }]).then(ress => {
                                params.push(ress.manager.split(' ', 1));
                            });  
                    } else {
                        //return null and push to params
                        params.push(null);
                    }
                    //then wait for the query to go thru and return
                    await this.connection.promise().query(sql, params).then(([rows, fields]) => {
                        console.log('\n');
                        console.log(`Added ${params[0]} to the DB!`)
                        console.table(rows);
                    });
                });
                
                await prompt();
              
        } catch(err){
            console.error(err);
        }

    }

    // update selected employee's role
    async updateEmployeeRole(prompt) {
        let employeeId, roleId;
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
                }]).then(res => {
                    employeeId = res.employee.split(' ', 1)
                });
            await inquirer.prompt(
                [{
                    name: 'role',
                    type: 'list',
                    message: 'Choose the new Role',
                    choices: await this.getRole()
                }]).then(res => {
                    roleId = res.role.split(' ', 1)
                    const params = [roleId[0], employeeId[0]];
                    //update role
                    this.connection.query(sql, params, (err, results) => {
                        console.log('updated!');
                        console.table(results);
                        //return to the prompt
                        prompt();
                    });
                });
                
            
        } catch(err) {
            console.error(err);
        };
    }

    // update selected employee's manager
    async updateEmployeeManager(prompt) {
        let employeeId, managerId;
        const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`
        try {
            await inquirer.prompt(
                [{
                    name: 'employee',
                    type: 'list',
                    message: 'Select A Employee First!',
                    choices: await this.getEmployee()
                }]).then(res => {
                    employeeId = res.employee.split(' ', 1);
                });
            await inquirer.prompt(
                [{
                    name: 'manager',
                    type: 'list',
                    message: 'Now let us select a new Manager!',
                    choices: await this.getManager()
                }]).then(res => {
                    managerId = res.manager.split(' ', 1);
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

    // add new role
    async addRole(prompt) {
        const sql = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;
        const params = [];
        try{
            await inquirer.prompt(
                [{
                    name: 'title',
                    type: 'input',
                    message: "Enter a new Role Title!",
                    validate: titleInput => {
                        if (titleInput) {
                        return true;
                        } else {
                        console.log('You need to enter a Title!');
                        return false;
                        }
                    }
                }]).then(res => {
                    params.push(res.title.trim());
                })
            await inquirer.prompt(
                [{
                    name: 'salary',
                    type: 'input',
                    message: "Enter the new Role's Salary!",
                    validate: titleInput => {
                        if (titleInput && typeof titleInput === 'number') {
                        return true;
                        } else {
                        console.log('\n');
                        console.log(' You need to enter a Valid Salary!');
                        return false;
                        }
                    }
                }]).then(res => {
                    params.push(parseInt(res.salary.trim()));
                })
            await inquirer.prompt(
                [{
                    name: 'dept',
                    type: 'list',
                    message: "Chose the new Role's Department!",
                    choices: await this.getDepartment()
                }]).then(res => {
                    params.push(parseInt(res.dept.trim()));
                    this.connection.query(sql, params, (err, results) => {
                        console.table(results);
                        prompt();
                    });
                })
        } catch(err) {
            console.error(err);
        }
    }

    // add new department
    async addDepartment(prompt) {
        const sql = `INSERT INTO department (name) VALUES (?)`;
        try {
            await inquirer.prompt([{
                name: 'newDept',
                type: 'input',
                message: 'Enter New Department Name.',
                validate: newDeptInput => {
                    if(newDeptInput) {
                        return true;
                    } else {
                        console.log('Need to Enter a Name!')
                        return false;
                    }
                }
            }]).then(res => {
                let params = res.newDept.trim();
                this.connection.query(sql, params, (err, results) => {
                    console.log(`Added new Department ${params}`)
                    prompt();

                })
            })
        } catch (err) {
            console.error(err);
        }
    }

    // remove the selected role
    async removeRole(prompt) {
        const sql = `DELETE FROM role WHERE id = ?`;
        try {
            await inquirer.prompt(
                [{
                    name: 'delRol',
                    type: 'list',
                    message: 'Select the role you would like to remove.',
                    choices: await this.getRole()
                }]).then(res => {
                    let params = res.delRol.split(' ', 1);
                    this.connection.query(sql, params[0], (err, results) => {
                        console.table(res.delRol + 'has been deleted');
                        prompt();
                    });
                })
        } catch(err){
            console.error(err);
        }
    }

    // remove the selected employee
    async removeEmployee(prompt, employeeId) {
        const sql = `DELETE FROM employee WHERE id = ?`;
        try{
            await inquirer.prompt(
                [{
                    name: 'employee',
                    type: 'list',
                    message: 'Select An Employee',
                    choices: await this.getEmployee()
                }]).then(res => {
                    employeeId = res.employee.split(' ', 1)
                    this.connection.query(sql, employeeId[0], (err, results) => {
                        console.table(res.employee + 'has been deleted');
                        prompt();
                    });
                });

        } catch(err){
            console.error(err);
        }
    }

    // remove the selected department
    async removeDepartment(prompt) {
        const sql = `DELETE FROM department WHERE id = ?`;
        try{ 
            await inquirer.prompt(
                [{
                    name: 'delDept',
                    type: 'list',
                    message: 'Select the role you would like to remove.',
                    choices: await this.getDepartment()
                }]).then(res => {
                    let params = res.delDept.split(' ', 1);
                    this.connection.query(sql, params[0], (err, results) => {
                        console.table(res.delDept + 'has been deleted');
                        prompt();
                    });
                })
        } catch(err) {
            console.error(err);
        }
    }

    //end our connection to our db
    quit(){
        console.log('Goodbye! ^.^')
        this.connection.end();
    }
}

//since i will use this once i export it as a new object;
module.exports = new App(connection);