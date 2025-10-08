const express = require('express');
const app = express();
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const mongoose = require("mongoose");

require('dotenv').config();

app.use(express.json());

// ========= PRONEN ==========
app.use(express.static(path.join(__dirname, 'public')));

// ======== CONNECTION MONGODB ========
const MONGO_URI = process.env.MONGO_MONGODB_URI;
if (!MONGO_URI) {
  console.error("❌ Environment variable MONGO_MONGODB_URI tidak ditemukan!");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, { dbName: "db" })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ======== SCHEMA ========
const MessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  msg: String,
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", MessageSchema);

// ======== TEMBAK DOR API TIKTOK TIKWM ========
app.get("/api/tiktok", async (req, res) => {
  const t = req.query.url;
  const ur = t?.toString();
  const regex =
    /(https:\/\/(vt|vm)\.tiktok\.com\/[^\s]+|https:\/\/www\.tiktok\.com\/@[\w.-]+\/video\/\d+)/;
  const parseUrl = ur?.match(regex)?.[0];

  async function tiktokDl(url) {
    try {
      const respon = await axios.get(`https://www.tikwm.com/api?url=${url}`);
      if (respon.data.data.play.endsWith(".mp3")) {
        return { type: "album", url: respon.data.data.images };
      } else {
        return { type: "video", url: respon.data.data.play };
      }
    } catch (e) {
      console.error(e);
      return { status: false, msg: "Gagal Mengambil Data Dari API" };
    }
  }

  try {
    if (parseUrl) {
      const det = await tiktokDl(parseUrl);
      res.json(det);
    } else {
      res.status(400).json({ error: "URL tidak valid" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server Error" });
  }
});

// ======== MongoDB ========

// ======== GET ALL MESSEJ =======
app.get("/hhxhh/post", async (req, res) => {
  try {
    const allMessages = await Message.find().sort({ createdAt: -1 });
    res.json(allMessages);
  } catch (err) {
    console.error("❌ Error GET:", err.message);
    res.status(500).json({ error: "Gagal mengambil data" });
  }
});

// ======== ADD METHOD POST ========
app.post("/hhxhh/post", async (req, res) => {
  try {
    const { name, email, msg } = req.body;
    if (!name || !email || !msg) {
      return res.status(400).json({ error: "Semua field wajib diisi" });
    }

    const newMsg = new Message({ name, email, msg });
    await newMsg.save();

    const updatedList = await Message.find().sort({ createdAt: -1 });
    res.status(201).json(updatedList);
  } catch (err) {
    console.error("❌ Error POST:", err.message);
    res.status(500).json({ error: "Gagal menyimpan data" });
  }
});

module.exports = app;

/*app.post('/sendmail', (req, res) => {
  const { prom, subject, message } = req.body
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: gemail, 
      pass: pwemail 
    }
  });

  const mailOptions = {
    from: prom,
    to: 'jir@gmail.com', 
    subject: subject,
    text: message
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).send(error);
      console.error(e)
    } else {
      res.send('Email sent: ' + info.response);
      console.log(info.response)
    }
  });
});
*/