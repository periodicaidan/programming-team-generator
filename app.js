const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

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
    const employees = [];
    while (true) {
        const { role } = await inquirer.prompt({
            type: 'list',
            name: 'role',
            message: 'Select team member role:',
            options: ['Engineer', 'Intern', 'Manager'],
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

        const { promptForMore } = inquirer.prompt({
            type: 'confirm',
            name: 'promptForMore',
            message: 'Add another employee?'
        });

        if (!promptForMore)
            break;
    }

    const teamHtml = render(employees);

    // After you have your html, you're now ready to create an HTML file using the HTML
    // returned from the `render` function. Now write it to a file named `team.html` in the
    // `output` folder. You can use the variable `outputPath` above target this location.
    // Hint: you may need to check if the `output` folder exists and create it if it
    // does not.

    // HINT: each employee type (manager, engineer, or intern) has slightly different
    // information; write your code to ask different questions via inquirer depending on
    // employee type.

    // HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
    // and Intern classes should all extend from a class named Employee; see the directions
    // for further information. Be sure to test out each class and verify it generates an
    // object with the correct structure and methods. This structure will be crucial in order
    // for the provided `render` function to work! ```

}

async function promptManager() {
    return await inquirer.prompt([
        ...employeeQuestions,
        {
            name: 'officeNumber',
            message: 'Manager office number:',
        }
    ]);
}

async function promptEngineer() {
    return await inquirer.prompt([
        ...employeeQuestions,
        {
            name: 'github',
            message: 'GitHub username:'
        }
    ]);
}

async function promptIntern() {
    return await inquirer.prompt([
        ...employeeQuestions,
        {
            name: 'school',
            message: 'Intern school:'
        }
    ]);
}

main();

