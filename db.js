const { Sequelize } = require("sequelize");

// название базы + юзер нейм + пароль
const sequelize = new Sequelize(
  "tgbotpostgresql",
  "solik",
  "sOFsZrVGdEZkDgHungxGKLytiftTS80n",
  {
    host: "dpg-cjd7ons5kgrc73b7rir0-a.frankfurt-postgres.render.com",
    port: "5432",
    dialect: "postgres",
  }
);

module.exports = {
  sequelize,
};
