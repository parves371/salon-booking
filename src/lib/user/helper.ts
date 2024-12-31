import fs from "fs";
import multer from "multer";
import path from "path";

// Create the upload directory if it doesn't exist
const uploadDir = path.join(process.cwd(), "public", "professionals");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir); // Save files to the public/professionals directory
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName); // Append a timestamp to avoid filename conflicts
  },
});

const upload = multer({ storage });

// Middleware to process the file
export const multerMiddleware = upload.single("file");

// Helper to wrap the Multer middleware for Next.js
export const runMiddleware = (req: Request, res: Response, fn: Function) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (err: any) => {
      if (err) reject(err);
      resolve(null);
    });
  });
};
