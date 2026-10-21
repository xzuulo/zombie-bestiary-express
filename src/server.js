import express from "express";
import morgan from "morgan";
import { config } from "./config/index.js";
import zombiesRouter from "./routes/zombiesRouter.js";
import fs from "fs";

const app = express();
fs.mkdirSync(config.uploadDir, { recursive: true });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/zombies", zombiesRouter);

app.listen(config.port);
