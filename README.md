# Employee Tracker

  ![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg)

## Video on How to Use the Application

[Employee Tracker Demonstration](https://drive.google.com/file/d/1VAV6jr2FhGvxJDd1JGhKXLVmELvzV77t/view?usp=sharing)

## Description

This is a TypeScript command line application that uses postgresql to query data tables and to performance actions.  This helps to manage a company's employee database.  The user has the ability to choose to view the data in the Department, Role, and Employee table, view employees by manager or view employees by department.  Users can add Employees, Roles, and Departments.  

For the next updates, I would like to add the ability to delete Employees, Roles, and Departments and aggregate .

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributions](#contributions)
- [Tests](#tests)
- [Questions](#questions)

## Installation

1. Open the command line and navigate to the location on your machine where you would like the application installed.
2. Clone the repository in your command line by entering: git clone <https://github.com/HospitalGiftShop/Employee-Tracker.git>
3. Install Node.js or Bun (if not already installed).  Node.js and/ or Bun will allow you to run the application directly in the command line. </br>
      [Node.js Website](https://nodejs.org/en) </br>
      [Node.js Package Manager](https://nodejs.org/en/download/package-manager) </br>
      [Bun](https://bun.sh/)
4. Package Manager
    If using Node.js, in the command line, enter: npm init -y.  This will initilize and create the package.json.
    If using Bun, in the command line, enter: Bun init to initilize and create the package.json.
5. Use the command line to install the inquirer package by entering: npm i inquirer@8.2.4.
6. Install Postgresql.  Navigate to their website and install the application for your OS. </br>
    [Postgresql](https://www.postgresql.org/download/)

Optional:

You may also want to install and use a code editor such as [Visual Studio Code](https://code.visualstudio.com/) to easily see the folder structure and make edits.

## Usage

In the command line, navigate (cd 'folder name') to the db folder. </br>
    &emsp; 1. In the command line enter 'postgres -U [username]' </br>
    &emsp; 2. Enter \i schema.sql </br>
    &emsp; &emsp; This will create your databse, tables, and also connect to your newly created database. </br>
    &emsp; 3. Enter \i seeds.sql </br>
    &emsp; &emsp;This will populate the tables with data. </br>
    &emsp; 4. Enter \i q to exit out of postgres.

Once the sql files have ran, navigate to the folder with index.ts and enter bun run index.ts in the command line.

You will be prompted with a series of actions to choose from.  Once you are done with the application, you can exit the actions by either selecting Quit or by selecting ctrl + c on your keyboard.

## License

Licensed under the [MIT](https://opensource.org/licenses/MIT) license.

## Contributions

N/A

## Tests

To test the application, open the command line and navigate to the directory where index.ts is located.  Type 'bun run index.ts' and hit enter on your keyboard.  Select the action(s) you would like to test.

## Questions

If you have any questions, please email me at <tmeans01@gmail.com> or for more information visit [GitHub](https://github.com/HospitalGiftShop).
