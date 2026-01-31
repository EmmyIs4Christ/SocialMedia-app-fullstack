import jwt from "jsonwebtoken";
import db from "../util/connection.js";

export const getUser = (req, res, next) => {
  const userId = req.params.userId;
  const sql = `SELECT * FROM users WHERE id = ?`;

  db.query(sql, [userId], (err, data) => {
    if (err) return res.status(500).json("Query error " + err?.sqlMessage);
    const { password, ...other } = data[0];
    return res.status(201).json(other);
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  jwt.verify(token, "secret-token", (err, verifiedToken) => {
    if (err) return res.status(403).json("Token is not valid");
    const userId = verifiedToken.id;
    const sql =
      "UPDATE users SET `name` = ?, `profilePic` = ?, `city` = ?, `coverPic` = ?, `website` = ? WHERE id = ?";
    const values = [
      req.body.name,
      req.body.profilePic,
      req.body.city,
      req.body.coverPic,
      req.body.website,
      userId
    ];
    db.query(sql, values, (err, result) => {
      err ? console.log(err) : "";
      if (err) return res.status(500).json("Query error " + err?.sqlMessage);
      if (result.affectedRows > 0) return res.status(200).json('Updated')
      return res.status(403).json("You can only update your profile");
    });
  });
};
