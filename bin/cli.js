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

const repoName = process.argv[2];
const gitCheckoutCommand = `git clone --depth 1 https://github.com/constrod/template-node-typescript ${repoName}`;
const installDependenciesCommand = `cd ${repoName} && yarn`;

rl.question('Create new application');

console.log(`Cloning the repository with name ${repoName}`);
// const isCheckedOut = runCommand(gitCheckoutCommand);
// if (!isCheckedOut) process.exit(-1);

console.log(`Installing dependencies for ${repoName}`);
// const isInstalled = runCommand(installDependenciesCommand);
// if (!isInstalled) process.exit(-1);

console.log('Congratulations! You are ready. Follow the following commands to start');
console.log(`cd ${repoName} && yarn dev`);
