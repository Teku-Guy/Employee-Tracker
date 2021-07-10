const inquirer = require("inquirer");
const { prompts, checkResponse } = require("../lib/prompts");


async function prompt() {
    const {choice} = await inquirer.prompt(prompts);
    checkResponse(choice);
}