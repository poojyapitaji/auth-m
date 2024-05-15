import express from 'express';
import https from 'https';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import config from 'config';

import { cors, swagger, morgan } from './libs';

const environment = config.get<string>('environment');
const port = config.get<number>('server.port');
const host = config.get<number>('server.host');
const isDev = environment === 'development';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors);
morgan(app);

app.get('/', (_req, res) => {
  if (isDev) {
    return res.redirect('/api-docs');
  }
});

if (isDev) {
  app.use('/api-docs', swagger.serve, swagger.setup);
}

const keyPath = path.join(__dirname, '..', 'cert', 'private.key');
const certPath = path.join(__dirname, '..', 'cert', 'certificate.crt');

if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
  console.error(
    '\x1b[31mCertificate files not found.\x1b[0m You need to run the command \x1b[1m\x1b[34mnpm run generate-ssl\x1b[0m and restart the server.'
  );
  process.exit(1);
}

const key = fs.readFileSync(keyPath);
const cert = fs.readFileSync(certPath);

const httpsServer = https.createServer({ key, cert }, app);

httpsServer.listen(port, host, () => {
  console.log(`HTTPS server is running on port ${port}`);
  if (isDev) {
    exec(`open https://${host}:${port}`, (error) => {
      if (error) {
        console.error('Failed to open the browser window:', error);
        console.log(
          'Please open your browser and navigate to:',
          `https://${host}:${port}`
        );
      }
    });
  }
});
