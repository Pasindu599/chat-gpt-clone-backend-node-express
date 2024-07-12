import { NextFunction, Response, Request } from "express";
import { User } from "../models/User";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-manager";
import { COOKIE_NAME } from "../utils/constants";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();
    return res.status(200).json({ message: "Ok", users });
  } catch (error) {
    // Specify the type of 'error' as 'Error'
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", cause: error });
  }
};

export const userSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ message: "User already exists" });
    }
    const hashedPassword = await hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.clearCookie(COOKIE_NAME, {
      path: "/",
      domain: "localhost",
      httpOnly: true,
      signed: true,
    });

    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: "localhost",
      expires,
      httpOnly: true,
      signed: true,
    });

    return res.status(201).json({ message: "Ok", id: user._id.toString() });
  } catch (error) {
    // Specify the type of 'error' as 'Error'
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", cause: error });
  }
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      return res.status(403).json({ message: "Invalid password" });
    }

    res.clearCookie(COOKIE_NAME, {
      path: "/",
      domain: "localhost",
      httpOnly: true,
      signed: true,
    });

    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: "localhost",
      expires,
      httpOnly: true,
      signed: true,
    });

    return res.status(200).json({ message: "Ok", id: user._id.toString() });
  } catch (error) {
    // Specify the type of 'error' as 'Error'
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", cause: error });
  }
};
