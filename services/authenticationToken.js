const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const authenticateToken = async (req, res, next) => {
  const username = jwt.verify(
    req.headers.authorization,
    process.env.SECRET_KEY.toString(),
    async function (err, decoded) {
      if (err) {
        return res.json({ success: false, error: err.message });
      }

      const user = await mongoose
        .model("users")
        .findOne({ username: decoded.username, isDeleted: false });
      if (user) {
        req.user = user;
      } else {
        return res.json({ success: false, error: "User not found" });
      }

      next();
    }
  );
};

module.exports = { authenticateToken };
