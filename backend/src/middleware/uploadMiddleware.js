import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (_req, file, callback) => {
  const isAudio = file.mimetype.startsWith("audio/");
  const isImage = file.mimetype.startsWith("image/");

  if (isAudio || isImage) return callback(null, true);
  return callback(new Error("Only audio and image files are allowed"), false);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 }
});
