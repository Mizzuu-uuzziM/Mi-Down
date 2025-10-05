const express = require('express');
const app = express();
const fs = require('fs');
const axios = require('axios');
const path = require('path');

const DATA_FILE = "./public/request/db.json" //path.join(__dirname, "db.json");


require('dotenv').config();

const port = process.env.PORT;
const hostname = process.env.HOSTNAME;

app.use(express.static(path.join(__dirname, 'public')));
app.get('/api/tiktok', async (req , res) => {
   const t = req.query.url;
  
   const ur = t.toString()
   const regex = /(https:\/\/(vt|vm)\.tiktok\.com\/[^\s]+|https:\/\/www\.tiktok\.com\/@[\w.-]+\/video\/\d+)/;

   const parseUrl = ur.match(regex)?.[0];
   
async function tiktokDl(url){
   try {
      const respon = await axios.get(`https://www.tikwm.com/api?url=${url}`)
      
      
      if(respon.data.data.play.endsWith(".mp3")){
         var data = {
            type: "album",
            url: respon.data.data.images
         }
         
      } else {
         var data = {
            type: "video",
            url: respon.data.data.play
         }
      }
      return data
      console.log(data)
   }
   catch(e){
      console.error(e)
      const dataError = {
         status: false,
         msg: "Gagal Mengambil Data Dari api"
      }
      return dataError
   }
}
   try{ 
      if(parseUrl) {
         const det = await tiktokDl(parseUrl);
         console.log(det)
         res.json(det)
      }
   } catch (e) {
      console.error(t)
      console.error(e)
   }
})

app.get("/hhxhh/post", async (req, res) => {
   const name = req.query.name;
   const email = req.query.email;
   const msg = req.query.msg;
   if(!name && !email && !msg){
      const red = fs.readFileSync("./public/request/db.json", "utf8")
      const rwsult = JSON.parse(red)
      res.json(rwsult)
   } else {
      const a = addDataSync({
         name: name, 
         email: email, 
         msg: msg
      })
      const b = fs.readFileSync("./public/request/db.json", "utf8")
      const c = JSON.parse(b)
      res.json(c)
   }
})


/**
 * Add Data Menggubakan fs.writeFileSync
 * @param {Object} newItem - {name, email, msg}
 */
function addDataSync(newItem) {
   try {
      let raw = fs.readFileSync(DATA_FILE, "utf8");
      let jsonData = JSON.parse(raw);

      let newKey = (Math.max(0, ...Object.keys(jsonData).map(Number)) + 1).toString();

      jsonData[newKey] = {
         name: newItem.name,
         email: newItem.email,
         msg: newItem.msg
      };

      fs.writeFileSync(DATA_FILE, JSON.stringify(jsonData, null, 2));

      console.log("✅ Data berhasil ditambahkan dengan key:", newKey);
   } catch (err) {
      console.error("❌ Error:", err.message);
   }
}

/**
 * Ambil semua data 
 * @returns {Array} list pesan [{name, email, msg}, ...]
 */
function getDataSync() {
  try {
    let raw = fs.readFileSync(DATA_FILE, "utf8");
    let jsonData = JSON.parse(raw);

    // kembalikan array berisi list data
    return Object.values(jsonData).map(item => ({
      name: item.name,
      email: item.email,
      msg: item.msg
    }));
  } catch (err) {
    console.error("❌ Error:", err.message);
    return [];
  }
}

module.exports = app