import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function setupChrome() {
  try {
    console.log('Setting up Chrome for WebContainer...');
    
    // Install Chrome
    await execAsync('apt-get update && apt-get install -y chromium');
    
    console.log('Chrome setup completed successfully');
  } catch (error) {
    console.error('Failed to setup Chrome:', error);
    process.exit(1);
  }
}

setupChrome();