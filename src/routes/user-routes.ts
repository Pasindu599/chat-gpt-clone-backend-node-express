import { Router } from "express";
import {
  getAllUsers,
  userLogin,
  userSignup,
} from "../controllers/user-controllers";
import {
  loginValidator,
  signupValidator,
  validator,
} from "../utils/validators";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.post("/signup", validator(signupValidator), userSignup);
userRouter.post("/login", validator(loginValidator), userLogin);
userRouter.get("/auth-status", userLogin);

export default userRouter;
