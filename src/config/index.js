import "dotenv/config";
import path from "path";

export const config = {
  port: process.env.PORT || 8080,
  uploadDir: path.join(
    import.meta.dirname,
    "../" + (process.env.UPLOAD_FOLDER_NAME || "uploads"),
  ),
  fileSizeLimit: Number(process.env.FILE_SIZE_LIMIT || 2000000),
};
