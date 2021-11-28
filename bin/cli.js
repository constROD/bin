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
    console.error(`[ERROR]: Failed to execute ${command}`, error);
    return false;
  }
  return true;
};

rl.question('[1]: Enter your folder name: ', function (folderName) {
  if (!folderName) {
    console.log('[ERROR]: You must provide a folder name.');
    process.exit(1);
  }

  console.log(`
  List of app supported: 
  - node
  - react
  - next (not yet available)
  - gatsby (not yet available)
  `);

  rl.question('[2]: Choose your app: ', function (appName) {
    if (!appName) {
      console.log('[ERROR]: You must provide only the supported app.');
      process.exit(1);
    }

    let cloneCommand = '';

    if (appName === 'node')
      cloneCommand = `git clone --depth 1 https://github.com/constrod/template-node-typescript ${folderName}`;
    if (appName === 'react')
      cloneCommand = `git clone --depth 1 https://github.com/constrod/template-react-typescript ${folderName}`;
    if (appName === 'next')
      cloneCommand = `git clone --depth 1 https://github.com/constrod/template-next-typescript ${folderName}`;
    if (appName === 'gatsby')
      cloneCommand = `git clone --depth 1 https://github.com/constrod/template-gatsby-typescript ${folderName}`;

    if (!cloneCommand) {
      console.log(`[ERROR]: Failed to create app. App type ${appName} is invalid`);
      process.exit(1);
    }

    const installDependenciesCommand = `cd ${folderName} && yarn`;

    console.log(`\n[START]: Cloning the repository in ${folderName} \n`);
    const isCloned = runCommand(cloneCommand);
    if (!isCloned) process.exit(-1);
    console.log(`\n[DONE]: Cloning the repository in ${folderName}`);

    console.log(`[START]: Installing dependencies for ${folderName} \n`);
    const isInstalled = runCommand(installDependenciesCommand);
    if (!isInstalled) process.exit(-1);
    console.log(`\n[DONE]: Installing dependencies for ${folderName}`);

    console.log(`
    Congratulations! 
    You are now ready to build an amazing app.

    Follow the following commands to start: 
    cd ${folderName} && yarn dev

    Happy hacking!
    `);
    rl.close();
  });
});
