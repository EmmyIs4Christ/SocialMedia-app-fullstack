import jwt from "jsonwebtoken";
import db from "../util/connection.js";

export const getStories = (req, res, next) => {
     const token = req.cookies.accessToken;
     if (!token) return res.status(401).json("Not logged in");
     jwt.verify(token, "secret-token", (err, verifiedToken) => {
       if (err) return res.status(403).json("Token is not valid");
       const sql =
            `SELECT s.*, u.id AS userId, u.name  AS username, profilePic
                FROM stories AS s
                JOIN users AS u on (s.userId = u.id) 
                WHERE s.userId = ? OR s.userId in (
                SELECT followedUserId FROM relationships
                where followerUserId = ?)`;
       const values = [verifiedToken.id, verifiedToken.id];
       db.query(sql, values, (err, posts) => {
         if (err) return res.status(500).json("Query error " + err?.sqlMessage);
         return res.status(200).json(posts);
       });
     });
}