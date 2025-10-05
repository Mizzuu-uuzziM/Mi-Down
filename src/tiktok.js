const axios = require("axios");

async function tiktokDl(url){
   try {
      const respon = await axios.get(`https://www.tikwm.com/api?url=${url}`)
      if(respon.status(200)){
         const data = respon.data.play;
         return data
      }else{
         return "error"
      }
   }
   catch(e){
      console.error(e)
   }
}
module.exports = tiktokDl