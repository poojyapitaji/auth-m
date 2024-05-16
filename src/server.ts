import https from 'https';
import config from 'config';

import { ssl } from './services';

import app from './app';

const { key, cert } = ssl.generateSSLCertificates();

const port = config.get<number>('server.port');
const host = config.get<number>('server.host');

const httpsServer = https.createServer({ key, cert }, app);

httpsServer.listen(port, host, () => {
  console.log(`HTTPS server is running on https://${host}:${port}`);
});
