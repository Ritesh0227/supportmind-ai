// scripts/install-all.js
const { spawn } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const serverDir = path.join(rootDir, 'server');
const clientDir = path.join(rootDir, 'client');

function runCommand(command, args, cwd) {
  return new Promise((resolve, reject) => {
    console.log(`\n> Running ${command} ${args.join(' ')} in ${path.relative(rootDir, cwd) || '.'}...`);
    const isWindows = process.platform === 'win32';
    const cmd = isWindows ? (command === 'npm' ? 'npm.cmd' : `${command}.cmd`) : command;
    const child = spawn(cmd, args, { cwd, stdio: 'inherit', shell: isWindows });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command exited with code ${code}`));
      }
    });
  });
}

async function main() {
  try {
    console.log('=== Installing Server Dependencies ===');
    await runCommand('npm', ['install'], serverDir);

    console.log('\n=== Installing Client Dependencies ===');
    await runCommand('npm', ['install'], clientDir);

    console.log('\n[SUCCESS] All dependencies installed successfully!');
  } catch (err) {
    console.error('\n[ERROR] Installation failed:', err.message);
    process.exit(1);
  }
}

main();
