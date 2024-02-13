import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import { check, validationResult } from "express-validator";
import { itemRouter } from "./routes/itemRoutes";
import { authRouter } from "./routes/authRoutes";

const app = express();
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/my_database");
const db = mongoose.connection;

app.use("/items", itemRouter);
app.use("/auth", authRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
