import sql from "mysql2";

const db = sql.createConnection({
  host: "localhost",
  user: "root",
  database: "social",
  password: "Emmy4Christ#",
});

db.connect((err) => {
  err
    ? console.log("Failed to connect to DB")
    : console.log("Database connected");
  if (err) throw err;
});

export default db;
