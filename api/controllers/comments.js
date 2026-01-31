import jwt from "jsonwebtoken";
import moment from "moment";
import db from "../util/connection.js";

export const getComments = (req, res) => {
  const postId = req.query.postId;
  const sql = `SELECT c.*, u.id AS userId, name, profilePic
                     FROM comments AS c JOIN users AS u
                     ON (c.userId = u.id)
                     WHERE c.postid = ?
                     ORDER BY c.createdAt DESC`;
  db.query(sql, [postId], (err, comments) => {
    if (err) return res.status(500).json("Query error " + err?.sqlMessage);
    return res.status(200).json(comments);
  });
};

export const addcomment = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  jwt.verify(token, "secret-token", (err, verifiedToken) => {
    if (err) return res.status(403).json("Token is not valid");
    const userId = verifiedToken.id;
    const sql =
      "INSERT INTO comments ( `desc`, `userId`, `createdAt`, `postId` ) VALUES (?, ?, ?, ?)";
    const values = [
      req.body.desc,
      userId,
      moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      req.body.postId,
    ];
    db.query(sql, values, (err, result) => {
      err ? console.log(err) : "";
      if (err) return res.status(500).json("Query error " + err?.sqlMessage);
      return res.status(201).json("Comment created");
    });
  });
};
