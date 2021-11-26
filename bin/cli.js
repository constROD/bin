#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const runCommand = (command) => {
  try {
    execSync(`${command}`, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Failed to execute ${command}`, error);
    return false;
  }
  return true;
};

rl.question('Enter your folder name: ', function (folderName) {
  if (!folderName) {
    console.log('Please enter your folder name.');
    process.exit(1);
  }

  rl.question('Choose your app (react | node): ', function (appName) {
    if (!appName) {
      console.log('Please enter your desired application.');
      process.exit(1);
    }

    let cloneCommand = '';

    if (appName === 'node')
      cloneCommand = `git clone --depth 1 https://github.com/constrod/template-node-typescript ${folderName}`;
    if (appName === 'react')
      cloneCommand = `git clone --depth 1 https://github.com/constrod/template-react-typescript ${folderName}`;

    const installDependenciesCommand = `cd ${folderName} && yarn`;

    console.log(`Cloning the repository in ${folderName}`);
    const isCloned = runCommand(cloneCommand);
    if (!isCloned) process.exit(-1);

    console.log(`Installing dependencies for ${folderName}`);
    const isInstalled = runCommand(installDependenciesCommand);
    if (!isInstalled) process.exit(-1);

    console.log('Congratulations! You are ready. Follow the following commands to start');
    console.log(`cd ${folderName} && yarn dev`);
    rl.close();
  });
});
