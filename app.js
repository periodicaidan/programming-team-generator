const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require('util');

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const writeFileAsync = util.promisify(fs.writeFile);
const mkdirAsync = util.promisify(fs.mkdir);

const render = require("./lib/htmlRenderer");

const employeeQuestions = [
    {
        name: 'name',
        message: 'Employee name:',
    },
    {
        name: 'id',
        message: 'Employee ID:',
        filter: input => parseInt(input),
    },
    {
        name: 'email',
        message: 'Employee email:'
    },
];

const main = async argv => {
    // TODO: This still mutates; make a generator to change that maybe!
    const employees = [];
    while (true) {
        const { role } = await inquirer.prompt({
            type: 'list',
            name: 'role',
            message: 'Select team member role:',
            choices: ['Engineer', 'Intern', 'Manager'],
        });

        const employee = await (async function() {
            switch (role) {
                case 'Manager':
                    return await promptManager();

                case 'Engineer':
                    return await promptEngineer();

                case 'Intern':
                    return await promptIntern();
            }
        })();

        employee.role = role;

        employees.push(employee);

        const { promptForMore } = await inquirer.prompt({
            type: 'confirm',
            name: 'promptForMore',
            message: 'Add another employee?'
        });

        if (!promptForMore)
            break;
    }

    const teamHtml = render(employees);

    try {
        await writeFileAsync(outputPath, teamHtml);
    } catch (err) {
        await mkdirAsync(OUTPUT_DIR);
        await writeFileAsync(outputPath, teamHtml);
    }
}

async function promptManager() {
    const { name, id, email, officeNumber } =  await inquirer.prompt([
        ...employeeQuestions,
        {
            name: 'officeNumber',
            message: 'Manager office number:',
        }
    ]);

    return new Manager(name, id, email, officeNumber);
}

async function promptEngineer() {
    const { name, id, email, github } = await inquirer.prompt([
        ...employeeQuestions,
        {
            name: 'github',
            message: 'GitHub username:'
        }
    ]);

    return new Engineer(name, id, email, github);
}

async function promptIntern() {
    const { name, id, email, school } = await inquirer.prompt([
        ...employeeQuestions,
        {
            name: 'school',
            message: 'Intern school:'
        }
    ]);

    return new Intern(name, id, email, school);
}

main();