import { Sequelize } from 'sequelize';
import config from 'config';

const database = config.get<string>('database.name');
const username = config.get<string>('database.username');
const password = config.get<string>('database.password');
const timezone = config.get<string>('database.timezone');
const host = config.get<string>('database.host');

const sequelize = new Sequelize(database, username, password, {
  dialect: 'mysql',
  timezone,
  host
});

export default sequelize;
