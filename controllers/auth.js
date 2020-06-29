exports.login = async (req, res, next) => {
  try {
    // Check username is exist
    const user = await Users.findOne({ username: req.body.username }).select(
      "password -_id"
    );
    if (user == null) {
      return res.json({ success: false, error: "Login failed" });
    }

    // Compare password of user above
    const isLogin = await bcrypt.compareSync(req.body.password, user.password);

    if (!isLogin) {
      return res.json({ success: false, error: "Login failed" });
    }

    // Generate token
    const token = jwt.sign(
      { username: req.body.username },
      process.env.SECRET_KEY.toString(),
      { expiresIn: "1y" }
    );

    return res.status(200).json({ success: isLogin, accessToken: token });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
