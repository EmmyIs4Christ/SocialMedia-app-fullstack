import jwt from "jsonwebtoken";
import moment from "moment";

import db from "../util/connection.js";

export const getPost = (req, res) => {};

export const getPosts = (req, res, next) => {
  const token = req.cookies.accessToken;
  const userId = req.query.userId;
  if (!token) return res.status(401).json("Not logged in");
  jwt.verify(token, "secret-token", (err, verifiedToken) => {
    if (err) return res.status(403).json("Token is not valid");
    // const sql = `SELECT p.*, u.id AS userId, name, profilePic
    //               FROM posts AS p JOIN users AS u
    //               ON (p.userId = u.id)
    //               LEFT JOIN relationships AS r ON (p.userId = r.followedUserId)
    //               WHERE p.userId = ? OR r.followerUserId = ?
    //                ORDER BY p.createdAt DESC`;
    const sql =
      userId !== "undefined"
        ? `SELECT p.*, u.id AS userId, name, profilePic
                FROM posts AS p
                JOIN users AS u on (p.userId = u.id) 
                WHERE p.userId = ?
                ORDER BY p.createdAt DESC`
        : `SELECT p.*, u.id AS userId, name, profilePic
                FROM posts AS p
                JOIN users AS u on (p.userId = u.id) 
                WHERE p.userId = ? OR p.userId in (
                SELECT followedUserId FROM relationships
                where followerUserId = ?)
                ORDER BY p.createdAt DESC`;
    const values =
      userId !== "undefined" ? [userId] : [verifiedToken.id, verifiedToken.id];
    db.query(sql, values, (err, posts) => {
      if (err) return res.status(500).json("Query error " + err?.sqlMessage);
      return res.status(200).json(posts);
    });
  });
};

export const addPost = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  jwt.verify(token, "secret-token", (err, verifiedToken) => {
    if (err) return res.status(403).json("Invalid token");
    const userId = verifiedToken.id;
    const sql =
      "INSERT INTO posts ( `desc`, `img`, `userId`, `createdAt` ) VALUES (?, ?, ?, ?)";
    const values = [
      req.body.desc,
      req.body.img,
      userId,
      moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    ];
    db.query(sql, values, (err, result) => {
      err ? console.log(err) : "";
      if (err) return res.status(500).json("Query error " + err?.sqlMessage);
      return res.status(201).json("Post created");
    });
  });
};

export const deletePost = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  jwt.verify(token, "secret-token", (err, verifiedToken) => {
    if (err) return res.status(403).json("Invalid token");
    const userId = verifiedToken.id;
    const sql = "DELETE FROM posts WHERE id = ? AND userId = ?";
    const values = [req.params.postId, userId];
    db.query(sql, values, (err, result) => {
      err ? console.log(err) : "";
      if (err) return res.status(500).json("Query error " + err?.sqlMessage);
      if(result.affectedRows > 0) return res.status(200).json("Post deleted");
      return res.status(403).json('Can only delete your post');
    });
  });
};
