module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./src/db/db.sqlite",
    },
    migrations: {
      directory: "./src/db/migrations",
    },
    seeds: {
      directory: "./src/db/seeds",
    },
    useNullAsDefault: true,
  },
};
