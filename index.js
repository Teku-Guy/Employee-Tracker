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
            return app.viewEmployeesByDepartment();

        case 'VIEW_EMPLOYEES_BY_MANAGER':
            return app.viewEmployeesByManager();

        case 'ADD_EMPLOYEE':
            return app.addEmployee();

        case 'REMOVE_EMPLOYEE':
            return app.removeEmployee();

        case 'UPDATE_EMPLOYEE_ROLE':
            return app.updateEmployeeRole(prompt);

        case 'UPDATE_EMPLOYEE_MANAGER':
            return app.updateEmployeeManager();
    
        case 'VIEW_ROLES':
            return app.viewRoles();

        case 'ADD_ROLE':
            return app.addRole();

        case 'REMOVE_ROLE':
            return app.removeRole();

        case 'VIEW_DEPARTMENTS':
            return app.viewDepartments();

        case 'ADD_DEPARTMENT':
            return app.addDepartment();

        case 'REMOVE_DEPARTMENT':
            return app.removeDepartment();

        default:
            return quit();
    }
}

function init() {
    prompt();
} 

init();