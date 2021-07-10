const prompts = [
    {
        name: 'View All Employees',
        value: 'VIEW_EMPLOYEES'
    },
    {
        name: 'View All Employees By Department',
        value: 'VIEW_EMPLOYEES_BY_DEPARTMENT'
    },
    {
        name: 'View All Employees By Manager',
        value: 'VIEW_EMPLOYEES_BY_MANAGER'
    },
    {
        name: 'Add Employee',
         value: 'ADD_EMPLOYEE'
    },
    {
        name: 'Remove Employee',
        value: 'REMOVE_EMPLOYEE'
    },
    {
            name: 'Update Employee Role',
            value: 'UPDATE_EMPLOYEE_ROLE'
    },
    {
            name: 'Update Employee Manager',
            value: 'UPDATE_EMPLOYEE_MANAGER'
    },
    {
        name: 'View All Role',
        value: 'VIEW_ROLES'
    },
    {
        name: 'Add Role',
        value: 'ADD_ROLE'
    },
    {
        name: 'Remove Role',
        value: 'REMOVE_ROLE'
    },
    {
        name: 'View All Departments',
        value: 'VIEW_DEPARTMENTS'
    },
    {
        name: 'Add Department',
        value: 'ADD_DEPARTMENT'
    },
    {
        name: 'Remove Department',
        value: 'REMOVE_DEPARTMENT'
    },
    {
        name: 'Quit',
        value: 'QUIT'
    }
];

function checkResponse(result) {
    switch(result) {
        case 'VIEW_EMPLOYEES':
            return viewAllEmployees();

        case 'VIEW_EMPLOYEES_BY_DEPARTMENT':
            return viewEmployeesByDepartment();

        case 'VIEW_EMPLOYEES_BY_MANAGER':
            return viewEmployeesByManager();

        case 'ADD_EMPLOYEE':
            return addEmployee();

        case 'REMOVE_EMPLOYEE':
            return removeEmployee();

        case 'UPDATE_EMPLOYEE_ROLE':
            return updateEmployeeRole();

        case 'UPDATE_EMPLOYEE_MANAGER':
            return updateEmployeeManager();
    
        case 'VIEW_ROLES':
            return viewRoles();

        case 'ADD_ROLE':
            return addRole();

        case 'REMOVE_ROLE':
            return removeRole();

        case 'VIEW_DEPARTMENTS':
            return viewDepartments();

        case 'ADD_DEPARTMENT':
            return addDepartment();

        case 'REMOVE_DEPARTMENT':
            return removeDepartment();

        default:
            return quit();
    }
}

module.exports = {prompts, checkResponse};
