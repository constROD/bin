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
    logger({ type: 'error', message: 'Repository not found.' });
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
        'node-ts',
        'react-ts',
        'next-ts (Temporary not available)',
        'gatsby-ts',
        'vue-ts (Temporary not available)',
        'nuxt-ts (Temporary not available)',
        'svelte-kit-ts (Temporary not available)',
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

  console.log('\n');
  console.log(chalk.green('Congratulations!'));
  console.log(chalk.white('You are now ready to build your amazing app.!'));
  console.log();
  console.log(chalk.white('Follow the following commands to start:'));
  console.log(chalk.blue('cd test && yarn dev'));
  console.log();
  console.log(chalk.white('Happy hacking!'));
};

run();
