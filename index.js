const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Multer setup
const upload = multer({ dest: "uploads/" });

// Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "abdelmonamemera@gmail.com",       // ✉️ Gmailك هنا
    pass: "pgqr torf ynxh bksx",          // 🔐 App Password من Google
  },
});

// Route to handle form
app.post("/upload", upload.single("image"), async (req, res) => {
  const filePath = req.file.path;
  const fileName = req.file.originalname;

  try {
    // Send email with attachment
    const info = await transporter.sendMail({
      from: '"Image Bot 🤖" <abdelmonamemera@gmail.com>',
      to: "abdelmonamemera@gmail.com", // تقدر تغيّره لأي بريد
      subject: "📷 New Image Uploaded",
      text: "A user has uploaded an image.",
      attachments: [
        {
          filename: fileName,
          path: filePath,
        },
      ],
    });

    // Delete file after sending
    fs.unlinkSync(filePath);

    res.send("✅ Image uploaded and sent to Gmail.");
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("❌ Failed to send email.");
  }
});

// Serve the form
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
