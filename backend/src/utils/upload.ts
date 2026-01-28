import multer from "multer";
import path from "path";
import fs from "fs";

/**
 * Creates a Multer middleware to upload files
 * @param dest destination folder (default "uploads/products")
 */
export function createUploadMiddleware(dest: string = "uploads/products") {
  // Check that the folder exists; if not, create it.
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, dest);
    },
    filename: (_req, file, cb) => {
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, unique + ext);
    }
  });

  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
  });
}