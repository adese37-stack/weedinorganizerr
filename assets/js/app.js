(() => {
  "use strict";
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const cfg = window.WEDDING_CONFIG;

  const setText = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
  const toast = (message) => {
    const el = $("#toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  };

  function fillConfig() {
    const c = cfg.couple, w = cfg.wedding;
    ["coverBride","heroBride","closingBride"].forEach(id => setText(id,c.brideShort));
    ["coverGroom","heroGroom","closingGroom"].forEach(id => setText(id,c.groomShort));
    setText("brideFullName",c.brideFull); setText("groomFullName",c.groomFull);
    setText("brideParents",c.brideParents); setText("groomParents",c.groomParents);
    setText("coverDate",w.coverDate); setText("heroDate",w.heroDate);
    setText("quoteText",w.quote); setText("quoteSource",w.quoteSource);
    [["ceremony",cfg.ceremony],["reception",cfg.reception]].forEach(([prefix,e]) => {
      setText(prefix+"Day",e.day); setText(prefix+"Date",e.date); setText(prefix+"Time",e.time);
      setText(prefix+"Venue",e.venue); setText(prefix+"Address",e.address);
    });
    const mapLinks = $$(".map-link");
    if (mapLinks[0]) mapLinks[0].href = cfg.ceremony.mapUrl;
    if (mapLinks[1]) mapLinks[1].href = cfg.reception.mapUrl;
    const bi = $("#brideInstagram"), gi = $("#groomInstagram");
    bi.textContent=c.brideInstagram.label; bi.href=c.brideInstagram.url;
    gi.textContent=c.groomInstagram.label; gi.href=c.groomInstagram.url;
    setText("bank1Number",cfg.banks[0].number); setText("bank1Name",cfg.banks[0].name);
    setText("bank2Number",cfg.banks[1].number); setText("bank2Name",cfg.banks[1].name);
    $$(".copy-btn").forEach((b,i)=>b.dataset.copy=cfg.banks[i].number);
    const timeline=$("#storyTimeline");
    timeline.innerHTML=cfg.story.map(item=>`<article class="timeline-item reveal"><time>${item.year}</time><h3>${item.title}</h3><p>${item.text}</p></article>`).join("");
  }

  function personalizeGuest() {
    const params = new URLSearchParams(location.search);
    const guest = (params.get("to") || "Bapak/Ibu/Saudara/i").replace(/\+/g," ").trim();
    setText("guestName", guest);
    $("#rsvpName").value = guest === "Bapak/Ibu/Saudara/i" ? "" : guest;
  }

  function createPetals() {
    const holder = $(".petals");
    for (let i=0;i<12;i++) {
      const p=document.createElement("i"); p.className="petal";
      p.style.left=(Math.random()*100)+"%";
      p.style.animationDuration=(7+Math.random()*8)+"s";
      p.style.animationDelay=(-Math.random()*12)+"s";
      p.style.opacity=(.2+Math.random()*.45);
      holder.appendChild(p);
    }
  }

  function setupReveal() {
    const observer = new IntersectionObserver(entries => entries.forEach(e => {
      if(e.isIntersecting){ e.target.classList.add("in-view"); observer.unobserve(e.target); }
    }), { threshold:.12 });
    $$(".reveal").forEach(el=>observer.observe(el));
  }

  function setupCountdown() {
    const target = new Date(cfg.wedding.isoDate).getTime();
    const pad=n=>String(Math.max(0,n)).padStart(2,"0");
    const update=()=>{
      const diff=target-Date.now();
      if(diff<=0){ ["days","hours","minutes","seconds"].forEach(id=>setText(id,"00")); return; }
      setText("days",pad(Math.floor(diff/86400000)));
      setText("hours",pad(Math.floor(diff%86400000/3600000)));
      setText("minutes",pad(Math.floor(diff%3600000/60000)));
      setText("seconds",pad(Math.floor(diff%60000/1000)));
    };
    update(); setInterval(update,1000);
  }

  function setupMusic() {
    const audio=$("#bgMusic"), btn=$("#musicToggle"), disc=$(".music-disc");
    audio.volume=0;
    const fade=(to,duration=1400)=>{
      const from=audio.volume, start=performance.now();
      const step=now=>{
        const t=Math.min(1,(now-start)/duration);
        audio.volume=from+(to-from)*t;
        if(t<1) requestAnimationFrame(step); else if(to===0) audio.pause();
      }; requestAnimationFrame(step);
    };
    const play=async()=>{
      try { await audio.play(); fade(.45); disc.classList.add("playing"); }
      catch { toast("Ketuk tombol musik untuk memutar audio."); }
    };
    btn.addEventListener("click",()=>{
      if(audio.paused){ play(); } else { fade(0); disc.classList.remove("playing"); }
    });
    return play;
  }

  function setupTheme() {
    const btn=$("#themeToggle");
    const saved=localStorage.getItem("wedding-theme");
    if(saved) document.documentElement.dataset.theme=saved;
    btn.addEventListener("click",()=>{
      const current=document.documentElement.dataset.theme ||
        (matchMedia("(prefers-color-scheme: dark)").matches ? "dark":"light");
      const next=current==="dark"?"light":"dark";
      document.documentElement.dataset.theme=next;
      localStorage.setItem("wedding-theme",next);
      toast(next==="dark"?"Mode gelap aktif":"Mode terang aktif");
    });
  }

  function setupRSVP() {
    const key="luxuryWeddingWishes";
    const defaults=[
      {name:"Keluarga Besar",attendance:"Hadir",message:"Semoga menjadi keluarga yang penuh cinta, keberkahan, dan kebahagiaan.",date:"Doa terbaik"},
      {name:"Sahabat",attendance:"Hadir",message:"Selamat menempuh perjalanan baru. Bahagia selalu hingga hari tua.",date:"Dengan cinta"}
    ];
    const read=()=>{ try{return JSON.parse(localStorage.getItem(key))||defaults;}catch{return defaults;} };
    const render=()=>{
      $("#wishList").innerHTML=read().slice().reverse().map(w=>`<article class="wish">
        <div class="wish-head"><strong>${escapeHtml(w.name)}</strong><span>${escapeHtml(w.attendance)}</span></div>
        <p>${escapeHtml(w.message)}</p><small>${escapeHtml(w.date)}</small>
      </article>`).join("");
    };
    $("#rsvpForm").addEventListener("submit",e=>{
      e.preventDefault();
      const item={ name:$("#rsvpName").value.trim(), attendance:$("#attendance").value,
        message:$("#message").value.trim(), date:new Date().toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"}) };
      const data=read(); data.push(item); localStorage.setItem(key,JSON.stringify(data));
      e.target.reset(); personalizeGuest(); render(); toast("Konfirmasi dan ucapan berhasil disimpan.");
    });
    render();
  }

  function escapeHtml(v){ return String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m])); }

  function setupGallery() {
    const box=$("#lightbox"), image=$("#lightboxImage");
    $$(".gallery-item").forEach(item=>item.addEventListener("click",()=>{
      image.src=item.dataset.src; box.classList.add("open"); box.setAttribute("aria-hidden","false");
    }));
    const close=()=>{box.classList.remove("open");box.setAttribute("aria-hidden","true");};
    $("#closeLightbox").addEventListener("click",close);
    box.addEventListener("click",e=>{if(e.target===box)close();});
    addEventListener("keydown",e=>{if(e.key==="Escape")close();});
  }

  function setupCopy() {
    $$(".copy-btn").forEach(btn=>btn.addEventListener("click",async()=>{
      try { await navigator.clipboard.writeText(btn.dataset.copy); toast("Nomor rekening berhasil disalin."); }
      catch { toast("Salin manual: "+btn.dataset.copy); }
    }));
  }

  function setupNavigation() {
    const top=$("#backTop");
    top.addEventListener("click",()=>scrollTo({top:0,behavior:"smooth"}));
    addEventListener("scroll",()=>top.classList.toggle("visible",scrollY>650),{passive:true});
  }

  addEventListener("DOMContentLoaded",()=>{
    fillConfig(); personalizeGuest(); createPetals(); setupCountdown(); setupTheme();
    setupRSVP(); setupGallery(); setupCopy(); setupNavigation();
    const playMusic=setupMusic();
    const openBtn=$("#openInvitation");
    openBtn.addEventListener("click",()=>{
      $("#cover").classList.add("opened");
      $("#invitation").classList.add("visible");
      $("#invitation").setAttribute("aria-hidden","false");
      document.body.classList.remove("locked");
      $("#bottomNav").classList.add("visible");
      $$(".floating-btn").forEach(b=>b.classList.add("visible"));
      playMusic();
      setTimeout(setupReveal,180);
    });
    setTimeout(()=>$("#preloader").classList.add("hidden"),650);
  });
})();