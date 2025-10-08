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
   
  const form = document.getElementById("formMsg");
  const messagesContainer = document.getElementById("messages");

  // semua pesan
  async function loadMessages() {
    try {
      const res = await fetch("/hhxhh/post");
      const data = await res.json();
      renderMessages(data);
    } catch (err) {
      console.error("❌ Gagal load pesan:", err);
    }
  }

  // POST
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const msg = document.getElementById("msg").value.trim();

    if (!name || !email || !msg) return alert("Isi semua kolom dulu ya!");

    try {
      const res = await fetch("/hhxhh/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, msg })
      });

      if (!res.ok) throw new Error("Gagal kirim pesan");

      const data = await res.json();
      renderMessages(data);

      form.reset();
    } catch (err) {
      console.error("❌ Error kirim:", err);
      alert("Gagal mengirim pesan 😔");
    }
  });

  // Renderinh
  function renderMessages(data) {
    messagesContainer.innerHTML = "";

    data.forEach((item) => {
      const div = document.createElement("div");
      div.className =
        "bg-white border shadow-sm rounded-xl p-4 transition hover:shadow-md";
      div.innerHTML = `
        <p class="font-semibold text-blue-700">👤 ${item.name}</p>
        <p class="text-sm text-gray-500">${item.email}</p>
        <p class="mt-2 text-gray-700">${item.msg}</p>
        <p class="text-xs text-gray-400 mt-1">${new Date(item.createdAt).toLocaleString()}</p>
      `;
      messagesContainer.appendChild(div);
    });
  }

  loadMessages();
  
  
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
  const q = inp.value.trim(); 
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



