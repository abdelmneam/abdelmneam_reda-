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
function computerMove() {
  if (xoGameOver) return;

  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < 9; i++) {
    if (xoBoard[i] === '') {
      xoBoard[i] = '⭕';
      let score = minimax(xoBoard, 0, false);
      xoBoard[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  xoBoard[move] = '⭕';
  xoGrid.children[move].textContent = '⭕';

  if (checkWinner('⭕')) {
    xoStatus.textContent = "💻 الكمبيوتر فاز!";
    xoGameOver = true;
    return;
  }
  if (xoBoard.every(cell => cell !== '')) {
    xoStatus.textContent = "تعادل!";
    xoGameOver = true;
    return;
  }
  xoStatus.textContent = "دورك: ❌";
}
function minimax(board, depth, isMaximizing) {
  if (checkWinner('⭕')) return 1;
  if (checkWinner('❌')) return -1;
  if (board.every(cell => cell !== '')) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = '⭕';
        let score = minimax(board, depth + 1, false);
        board[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = '❌';
        let score = minimax(board, depth + 1, true);
        board[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}
