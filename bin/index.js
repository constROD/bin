#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const chalk = require('chalk');
const figlet = require('figlet');
const clear = require('clear');
const inquirer = require('inquirer');

/* Welcome Page */
clear();
console.log(chalk.gray(figlet.textSync('constROD', { horizontalLayout: 'full' })));

/* Utilities / Helpers */
const directoryChecker = filePath => fs.existsSync(filePath);
const logger = ({ type, message }) => {
  if (type === 'success') return console.log(chalk.green(type) + ' ' + chalk.white(message));
  if (type === 'info') return console.log(chalk.blue(type) + ' ' + chalk.white(message));
  return console.log(chalk.red(type) + ' ' + chalk.white(message));
};
const runCommand = command => {
  try {
    execSync(`${command}`, { stdio: 'inherit' });
  } catch (error) {
    logger({ type: 'error', message: `Unable to run the command: ${command}` });
    return false;
  }
  return true;
};

/* Inquirer */
const askfolderOrAppName = () =>
  inquirer.prompt([
    {
      name: 'folderOrAppName',
      type: 'input',
      message: 'Enter your folder/app name:',
      validate: value => {
        if (value.length) return true;
        return 'You must provide folder/app name.';
      },
    },
  ]);
const askAppType = () =>
  inquirer.prompt([
    {
      name: 'appType',
      type: 'list',
      message: 'Select your application:',
      choices: [
        'node',
        'node-ts',
        'react',
        'react-ts',
        'next',
        'next-ts',
        'gatsby',
        'gatsby-ts',
        'vue',
        'vue-ts',
        'svelte-kit',
        'svelte-kit-ts',
      ],
    },
  ]);

/* Runner */
const run = async () => {
  const { folderOrAppName } = await askfolderOrAppName();

  if (directoryChecker(folderOrAppName)) {
    logger({ type: 'error', message: 'Folder already exists.' });
    process.exit();
  }

  const { appType } = await askAppType();

  const cloneCommand = `git clone --depth 1 https://github.com/constrod/template-${appType} ${folderOrAppName}`;
  const installDependenciesCommand = `cd ${folderOrAppName} && yarn`;

  logger({ type: 'info', message: `Start cloning the repository in ${folderOrAppName}` });

  const isCloned = runCommand(cloneCommand);
  if (!isCloned) process.exit(-1);

  logger({ type: 'success', message: 'Repository is cloned successfully.' });
  logger({ type: 'info', message: `Start installing dependencies for ${folderOrAppName}.` });

  const isInstalled = runCommand(installDependenciesCommand);
  if (!isInstalled) process.exit(-1);

  logger({ type: 'success', message: 'Installation completed.' });

  console.log(`
      Congratulations!
      You are now ready to build your amazing app.

      Follow the following commands to start:
      ${chalk.blue(`cd ${folderOrAppName} && yarn dev`)}

      Happy hacking!
  `);
};

run();
