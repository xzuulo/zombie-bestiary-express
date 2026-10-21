import multer from "multer";
import { config } from "./config/index.js";
import { v4 as uuid } from "uuid";

const storage = multer.diskStorage({
  destination: (req, file, func) => func(null, config.uploadDir),
  limits: {
    fileSize: config.fileSizeLimit,
  },
  filename: (req, file, func) =>
    func(null, uuid() + "." + file.originalname.split(".")[1]),
});

export const diskUpload = multer({
  storage: storage,
});
