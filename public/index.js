const inp = document.getElementById("inp");
const send = document.getElementById("send");
const result = document.getElementById("result");
//>>>>>>>>>>>>
const loader = document.getElementById("loader");
//>>>>>>>>>>>>
const toTop = document.getElementById("toTop");
//>>>>>>>>>>>>>
const iklan = document.getElementById("iklan");
const noIklan = document.getElementById("noIklan");
//>>>>>>>>>>>>>
const request = document.getElementById("request");
//>>>>>>>>>>>>>

request.addEventListener("click", async () => {
   try {
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const msg = document.getElementById("msg").value.trim();
      if(!name && !email && !msg) return alert("bidang harus diisi") 
      const ged = await axios.get(`/hhxhh/post?name=${name}&email=${email}&msg=${msg}`);
      alert("thankyou")
      setTimeout(() => {
         location.reload()
      }, 3000)
   } catch (e) {
      alert("kesalahan")
   }
})

noIklan.addEventListener("click", () => {
   iklan.style.display = "none"
})

window.addEventListener("scroll", () => {
   if(window.scrollY > 300){
      toTop.style.display = "flex"
   }
   else {
      toTop.style.display = "none"
   }
})

toTop.addEventListener("click", () => {
   window.scrollTo({
      top: 0,
      behavior: "smooth"
   })
})

document.addEventListener("DOMContentLoaded", () => {
   loader.style.display = "flex"
   iklan.style.display = "flex"
   
   setTimeout(()=> {
      loader.style.display = "none"
   }, 2000);
   
   const messages = document.getElementById("messages")
   
   fetch("./request/db.json")
   .then(res => {
      if(!res.ok) alert("gagal mengambil data")
      return res.json()
   })
   .then(json => renderMessage(json))
   .catch(err => {
      messages.innerHTML = `
      <p>Error Saat Mengambil list Request ${err}</p>
      `
   })
   
   function renderMessage(data) {
      const messages = document.getElementById("messages");
      messages.innerHTML = "";

      Object.keys(data).sort((a, b) => Number(a) - Number(b))
      .forEach((key) => {
         const item = data[key];
         const div = document.createElement("div");
         div.className = "bg-white shadow-md rounded-xl p-4 mb-4 border border-gray-200 hover:shadow-lg transition";

         div.innerHTML = `
         <div class="flex flex-col gap-2">
            <span class="text-lg font-semibold text-gray-800">
               Name : ${escapeHTML(item.name)}
            </span>
            <span class="text-sm text-blue-600 break-all">
               Email : ${escapeHTML(item.email)}
            </span>
            <p class="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
               Message : ${escapeHTML(item.msg)}
            </p>
         </div>
         `;
         messages.appendChild(div);
      });
   }
   function escapeHTML(str=''){
      return String(str)
         .replace(/&/g, '&amp;')
         .replace(/>/g, '&gt;')
         .replace(/</g, '&lt;')
         .replace(/"/g, '&quot;')
         .replace(/'/g, '&#039;')
   }
})

send.addEventListener("click", async () => {
  const q = inp.value.trim(); // ambil value di dalam event
  if (!q) {
    alert("Masukkan URL dulu!");
    return;
  }
  
   const regex = /(https:\/\/(vt|vm)\.tiktok\.com\/[^\s]+|https:\/\/www\.tiktok\.com\/@[\w.-]+\/video\/\d+)/;

   const parseUrl = q.match(regex)?.[0];

   try {
   if(parseUrl) {
      const res = await axios.get("/api/tiktok?url=" + encodeURIComponent(parseUrl));
      console.log(res.data);
      var resul = res.data.url
      if(res.data.type === "album"){
      resul.forEach(i => {
         result.innerHTML = `
            <a href="${i}">unduh</a>
            `
      })
   
      } else {
         result.innerHTML = `
            <video controls class="w-full rounded-lg">
            <source src="${resul}" type="video/mp4">
            Browser kamu tidak mendukung video.
            </video>
            `;
      }
   } else {
      alert("Link/tautan Tidak Valid")
   }
   } catch (err) {
      console.error(err);
      alert("Gagal fetch API");
   }
});