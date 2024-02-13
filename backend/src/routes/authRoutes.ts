import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/userModel";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const accessToken = jwt.sign(
      { username: user.username },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "1h" }
    );
    res.json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export { router as authRouter };
