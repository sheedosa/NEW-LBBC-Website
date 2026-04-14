/**
 * LBBC Server Bridge
 * This file provides compatibility for hosting environments like Hostinger
 * that look for a server.js file by default.
 */
import { spawn, execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Initializing LBBC Production Server...');

// Check if dist exists and has content, if not, try to build it
const distPath = path.join(__dirname, 'dist');
const needsBuild = !fs.existsSync(distPath) || fs.readdirSync(distPath).length === 0;

if (needsBuild) {
  console.log('Dist folder not found or empty. Attempting to build frontend...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('Build completed successfully.');
  } catch (err) {
    console.error('Build failed. The server will start but may not serve the frontend correctly.', err);
  }
}

// Execute server.ts using tsx (which is in dependencies)
const tsxPath = path.join(__dirname, 'node_modules', '.bin', 'tsx');
const child = spawn(fs.existsSync(tsxPath) ? tsxPath : 'npx tsx', ['server.ts'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || 'production'
  }
});

child.on('error', (err) => {
  console.error('Error: Could not start the server process.', err);
  process.exit(1);
});

child.on('close', (code) => {
  if (code !== 0) {
    console.log(`Server process exited with code ${code}`);
  }
});
