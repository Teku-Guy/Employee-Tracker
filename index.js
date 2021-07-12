const inquirer = require("inquirer");
const prompts = require("./lib/prompts");
const app = require('./config/app');


async function prompt() {
    const {choice} = await inquirer.prompt(prompts);
    console.log(choice);
    checkResponse(choice, prompt);
}

function checkResponse(result, prompt) {
    switch(result) {
        case 'VIEW_EMPLOYEES':
            return app.viewAllEmployees(prompt);

        case 'VIEW_EMPLOYEES_BY_DEPARTMENT':
            return app.viewByDepartment(prompt);

        // case 'VIEW_EMPLOYEES_BY_MANAGER':
        //     return app.viewEmployeesByManager(prompt);

        case 'ADD_EMPLOYEE':
            return app.addEmployee(prompt);

        case 'REMOVE_EMPLOYEE':
            return app.removeEmployee(prompt);

        case 'UPDATE_EMPLOYEE_ROLE':
            return app.updateEmployeeRole(prompt);

        // case 'UPDATE_EMPLOYEE_MANAGER':
        //     return app.updateEmployeeManager(prompt);
    
        case 'VIEW_ROLES':
            return app.viewAllRoles(prompt);

        case 'ADD_ROLE':
            return app.addRole(prompt);

        case 'REMOVE_ROLE':
            return app.removeRole(prompt);

        case 'VIEW_DEPARTMENTS':
            return app.viewAllDepartments(prompt);

        case 'ADD_DEPARTMENT':
            return app.addDepartment(prompt);

        case 'REMOVE_DEPARTMENT':
            return app.removeDepartment(prompt);

        default:
            return app.quit();
    }
}

function init() {
    prompt();
} 

init();