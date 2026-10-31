// scripts/dev.js
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const serverDir = path.join(rootDir, 'server');
const clientDir = path.join(rootDir, 'client');
const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

console.log('====================================================');
console.log('   SupportMind AI - Launching Full-Stack Platform   ');
console.log('====================================================');

const serverProcess = spawn(npmCmd, ['run', 'dev'], {
  cwd: serverDir,
  stdio: 'inherit',
  shell: isWindows,
});

const clientProcess = spawn(npmCmd, ['run', 'dev'], {
  cwd: clientDir,
  stdio: 'inherit',
  shell: isWindows,
});

function cleanup() {
  console.log('\nGracefully shutting down SupportMind AI servers...');
  serverProcess.kill();
  clientProcess.kill();
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
