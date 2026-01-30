import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";

import db from "../util/connection.js";

export const register = (req, res, next) => {
  const { username, email, password, name } = req.body;
  const sql = `SELECT * FROM users WHERE username = ?`;

  db.query(sql, username, (err, result) => {
    if (err) return res.status(500).json("Query error " + err?.sqlMessage);
    if (result?.length > 0)
      return res.status(409).json("Username already exists");

    const salt = 10;
    bcrypt
      .hash(password, salt)
      .then((hashedPassword) => {
        const sql2 = `INSERT INTO users 
                    (username, email, password, name ) 
                    VALUES (?, ?, ?, ?)`;
        const values = [username, email, hashedPassword, name];
        db.query(sql2, values, (err, result) => {
          if (err)
            return res.status(500).json("Query error " + err?.sqlMessage);
          return res.status(201).json("Created user successfully");
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json("Query error " + err?.sqlMessage);
      });
  });
};

export const login = (req, res, next) => {
  const { username } = req.body;
  const sql = `SELECT * FROM users WHERE username = ?`;
  db.query(sql, username, (err, users) => {
    if (err) return res.status(500).json("Query error " + err?.sqlMessage);
    if(users.length <= 0) return res.status(404).json('User not found');

    const {password, ...other} = users[0];
    const correctPassword = bcrypt.compareSync(req.body.password, password);
    if (correctPassword) {
      const accessToken = jwt.sign({ id: other.id }, "secret-token", {
        expiresIn: "1d",
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
      });
      res.status(200).json(other)
    } else {
      return res.status(404).json("Password incorrect!");
    }
  });
};

export const logout = (req, res, next) => {
    res.clearCookie("accessToken", {
        secure: true,
        sameSite: 'none'
    }).json('User is logged out.');
};
