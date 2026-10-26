const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const jsonServer = require("json-server");

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));

const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
app.use(express.json());
app.use(middlewares);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public/uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

app.post("/upload", upload.single("profilePic"), (req, res) => {
    if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
    }
    res.json({ filePath: `/uploads/${req.file.originalname}` });
});

app.use("/api", router);

app.listen(5000, () => {
  console.log("Combined server running on port 5000");
});