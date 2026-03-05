import multer from "multer";

export const documentUpload = multer({
  storage: multer.memoryStorage(),
});
