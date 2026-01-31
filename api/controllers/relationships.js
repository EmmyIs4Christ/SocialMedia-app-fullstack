import jwt from "jsonwebtoken";
import db from "../util/connection.js";

export const getRelationships = (req, res) => {
  const sql = `SELECT followerUserId FROM relationships WHERE followedUserId = ?`;
  db.query(sql, [req.query.followedUserId], (err, followers) => {
    if (err) return res.status(500).json("Query error " + err?.sqlMessage);
    return res.status(200).json(followers.map((follower) => follower.followerUserId));
  });
};

export const addRelationship = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  jwt.verify(token, "secret-token", (err, verifiedToken) => {
    if (err) return res.status(403).json("Token is not valid");
    const userId = verifiedToken.id;
    const sql = `INSERT INTO relationships (followerUserId, followedUserId)
                VALUES (?, ?)`;
    const values = [userId, req.body.userId];
    db.query(sql, values, (err, result) => {
      if (err) return res.status(500).json("Query error " + err?.sqlMessage);
      return res.status(200).json("Following");
    });
  });
};

export const deleteRelationship = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  const followedUserId = req.query.userId;
  jwt.verify(token, "secret-token", (err, verifiedToken) => {
    if (err) return res.status(403).json("Token is not valid");
    const userId = verifiedToken.id;
    const sql = `DELETE FROM relationships WHERE followedUserId = ? AND followerUserId = ?`;
    const values = [followedUserId, userId];
    db.query(sql, values, (err, result) => {
      if (err) return res.status(500).json("Query error " + err?.sqlMessage);
      return res.status(200).json("Unfollowed");
    });
  });
};
