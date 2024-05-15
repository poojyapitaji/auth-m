import { execSync } from 'child_process';
import * as fs from 'fs';

// Create 'cert' directory if it doesn't exist
if (!fs.existsSync('cert')) {
  fs.mkdirSync('cert');
}

// Change directory to 'cert'
process.chdir('cert');

execSync('openssl genrsa -out private.key 2048');

// Generate certificate signing request (CSR)
execSync(
  'openssl req -new -key private.key -out csr.pem -subj "/CN=localhost"'
);

// Generate self-signed certificate
execSync(
  'openssl x509 -req -days 365 -in csr.pem -signkey private.key -out certificate.crt'
);

// Delete CSR file
fs.unlinkSync('csr.pem');

console.log('SSL keys and certificate generated successfully.');
