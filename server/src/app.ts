import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth";
import profileRouter from "./routes/profile";
import universitiesRouter from "./routes/universities";
import admissionsRouter from "./routes/admissions";
import aiRouter from "./routes/ai";
import satRouter from "./routes/sat";
import { requestId } from "./middleware/requestId";
import { authOptional, authRequired } from "./middleware/auth";
import { errorHandler } from "./middleware/errorHandler";
import { AppError } from "./utils/error";

const app = express();

app.use(requestId);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || "0.1.0"
  });
});

app.use("/api/auth", authOptional, authRouter);
app.use("/api/profile", authRequired, profileRouter);
app.use("/api/universities", authOptional, universitiesRouter);
app.use("/api/sat", authOptional, satRouter);
app.use("/api/admissions", authRequired, admissionsRouter);
app.use("/api/ai", authRequired, aiRouter);

app.use((_req, _res, next) => {
  next(new AppError("NOT_FOUND", "Route not found", 404));
});

app.use(errorHandler);

export default app;
