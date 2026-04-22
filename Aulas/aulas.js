    // ── Accordion ──
    function toggleAccordion(header) {
      header.classList.toggle("collapsed");
    }
 
    // ── Chapters ──
    const chapters = [
      { time: 0,    title: "Introdução" },
      { time: 624,  title: "O que é o GitHub?" },
      { time: 930,  title: "GitHub Desktop" },
      { time: 1335, title: "Criar uma branch" },
    ];
 
    // ── YouTube player ──
    let ytPlayer, isPlayerReady = false, currentVideoId = "6Czd1Yetaac";
    const videos = { video1: "6Czd1Yetaac", video2: "6Czd1Yetaac", video3: "6Czd1Yetaac" };
    const videoStartTimes = { video1: 624, video2: 930, video3: 1335 };
 
    function onYouTubeIframeAPIReady() {
      ytPlayer = new YT.Player("player", {
        videoId: currentVideoId,
        events: { onReady: () => { isPlayerReady = true; } }
      });
    }
 
    function goToTime(s) {
      if (isPlayerReady && ytPlayer?.seekTo) { ytPlayer.seekTo(s, true); return; }
      const f = document.getElementById("player");
      if (f) f.src = `https://www.youtube.com/embed/${currentVideoId}?enablejsapi=1&start=${s}`;
    }
 
    function loadVideoId(videoId, startSeconds) {
      currentVideoId = videoId;
      if (isPlayerReady && ytPlayer?.loadVideoById) {
        ytPlayer.loadVideoById(typeof startSeconds === "number" ? { videoId, startSeconds } : videoId);
        return;
      }
      const f = document.getElementById("player");
      if (f) f.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1${typeof startSeconds === "number" ? `&start=${startSeconds}` : ""}`;
    }
 
    // ── Flashcards ──
    const flashcards = [
      { question: "O que é o Git?",           answer: "Git é um sistema de controle de versão distribuído." },
      { question: "Para que serve o GitHub?",  answer: "Para hospedar repositórios e colaborar com outras pessoas." },
      { question: "O que é um commit?",        answer: "Um registro de mudanças no histórico do repositório." },
    ];
 
    let currentFlashcard = 0;
    const saved = Number(localStorage.getItem("flashcardIndex"));
    if (!isNaN(saved) && saved >= 0 && saved < flashcards.length) currentFlashcard = saved;
 
    function renderDots() {
      const wrap = document.getElementById("fcDots");
      if (!wrap) return;
      wrap.innerHTML = flashcards.map((_, i) =>
        `<div class="fc-dot${i === currentFlashcard ? ' active' : ''}" onclick="jumpFlashcard(${i})"></div>`
      ).join('');
    }
 
    function jumpFlashcard(i) {
      currentFlashcard = i;
      renderFlashcard(i);
    }
 
    function renderFlashcard(index) {
      const q = document.getElementById("flashcard-question");
      const a = document.getElementById("flashcard-answer");
      const counter = document.getElementById("flashcardCounter");
      const prev = document.getElementById("prevFlashcard");
      const next = document.getElementById("nextFlashcard");
      const card = document.getElementById("flashcard");
      if (!q || !a || !counter || !prev || !next || !card) return;
 
      const fc = flashcards[index];
      if (!fc) return;
      q.innerText = fc.question;
      a.innerText = fc.answer;
      counter.innerText = `${index + 1} / ${flashcards.length}`;
      localStorage.setItem("flashcardIndex", index);
      card.classList.remove("flipped");
      prev.disabled = index === 0;
      next.disabled = index === flashcards.length - 1;
      renderDots();
    }
 
    function flipFlashcard() {
      document.getElementById("flashcard")?.classList.toggle("flipped");
    }
    function nextFlashcard() {
      if (currentFlashcard >= flashcards.length - 1) return;
      currentFlashcard++;
      renderFlashcard(currentFlashcard);
    }
    function prevFlashcard() {
      if (currentFlashcard <= 0) return;
      currentFlashcard--;
      renderFlashcard(currentFlashcard);
    }
 
    // ── Tabs ──
    let concluirAulaBtn;
    function mostrarTab(tab) {
      document.getElementById("video").style.display      = tab === "video"      ? "flex" : "none";
      document.getElementById("flashcards").style.display = tab === "flashcards" ? "block" : "none";
      document.querySelectorAll(".tabs button").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
 
      if (tab === "flashcards") {
        if (isPlayerReady && ytPlayer?.pauseVideo) ytPlayer.pauseVideo();
        renderFlashcard(currentFlashcard);
      }
    }
 
    // ── Chapters ──
    function formatTime(s) { return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`; }
    function setActiveChapter(i) {
      document.querySelectorAll("#chaptersList li").forEach((li, idx) => li.classList.toggle("active", idx === i));
    }
    function renderChapters() {
      const list = document.getElementById("chaptersList");
      if (!list) return;
      list.innerHTML = "";
      chapters.forEach((ch, i) => {
        const li = document.createElement("li");
        li.textContent = `${formatTime(ch.time)} – ${ch.title}`;
        li.addEventListener("click", () => { goToTime(ch.time); setActiveChapter(i); mostrarTab("video"); });
        list.appendChild(li);
      });
      setActiveChapter(0);
    }
 
    // ── Switch lesson ──
    function trocarVideo(video, event) {
      loadVideoId(videos[video] || video, videoStartTimes[video]);
      mostrarTab("video");
      document.querySelectorAll(".aula").forEach(el => el.classList.remove("ativa"));
      event.currentTarget.classList.add("ativa");
    }
 
    // ── Progress ──
    function concluirAula() {
      let p = parseInt(document.getElementById("progresso").innerText) || 0;
      if (p < 100) {
        p = Math.min(p + 25, 100);
        document.getElementById("progresso").innerText = p;
        localStorage.setItem("progresso", p);
        localStorage.setItem("aulaAtual", document.querySelector(".aula.ativa .aula-title")?.innerText.trim() || "");
      }
    }
 
    // ── Init ──
    function init() {
      const saved = localStorage.getItem("progresso");
      if (saved) document.getElementById("progresso").innerText = saved;
      renderFlashcard(currentFlashcard);
      renderChapters();
      document.getElementById("flashcard")?.addEventListener("click", () =>
        document.getElementById("flashcard").classList.toggle("flipped")
      );
    }
 
    document.readyState === "loading"
      ? document.addEventListener("DOMContentLoaded", init)
      : init();