import { exec } from 'child_process';
import config from 'config';

export const openBrowser = () => {
  const environment = config.get<string>('environment');
  const port = config.get<number>('server.port');
  const host = config.get<number>('server.host');

  const isDev = environment === 'development';

  let isBrowserOpen = false;

  if (isDev && !isBrowserOpen) {
    isBrowserOpen = true;
    exec(`open https://${host}:${port}`, (error) => {
      if (error) {
        console.error('Failed to open the browser window:', error);
        console.log(
          'Please open your browser and navigate to:',
          `https://${host}:${port}`
        );
        isBrowserOpen = false;
      }
    });
  }
};
