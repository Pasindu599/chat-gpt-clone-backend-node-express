import { Router } from "express";
import userRouter from "./user-routes";
import chatRouter from "./chat-routes";

const appRouter = Router();

appRouter.use("/users", userRouter);
appRouter.use("/chats", chatRouter);

export default appRouter;
