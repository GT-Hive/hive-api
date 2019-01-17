module.exports = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  options: {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    define: {
      timestamps: false
    },
  }
};
