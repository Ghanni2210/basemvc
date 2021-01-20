
const env = {
  database: 'baseprj',
  username: 'root',
  password: 'db#329208@root',
  host: '172.104.191.160',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
module.exports = env;
