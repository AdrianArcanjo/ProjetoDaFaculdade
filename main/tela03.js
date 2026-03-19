// Alterna entre Video e Flashcards (e controla o player do YouTube)

// CAPÍTULOS (timestamps) - usado para navegar no vídeo
const chapters = [
  { time: 0, title: "Introdução" },
  { time: 624, title: "O que é o GitHub?" },
  { time: 930, title: "Como usar o GitHub Desktop" },
  { time: 1335, title: "Como criar uma branch" },
];

// Controle do player do YouTube (IFrame API)
let ytPlayer;
let isPlayerReady = false;
let currentVideoId = "6Czd1Yetaac";

const videos = {
  video1: "6Czd1Yetaac",
  video2: "6Czd1Yetaac",
  video3: "6Czd1Yetaac",
};

// Define o tempo inicial (em segundos) para cada “aula” do menu lateral
const videoStartTimes = {
  video1: 624, // 10:24
  video2: 930, // 15:30
  video3: 1335, // 22:15
};

function onYouTubeIframeAPIReady() {
  ytPlayer = new YT.Player("player", {
    videoId: currentVideoId,
    events: { onReady: onPlayerReady },
  });
}

function onPlayerReady() {
  isPlayerReady = true;
  // Player pronto; capítulos já foram renderizados no init()
}

function goToTime(seconds) {
  // Navega para um tempo específico no vídeo
  if (isPlayerReady && ytPlayer && typeof ytPlayer.seekTo === "function") {
    ytPlayer.seekTo(seconds, true);
    return;
  }

  // Fallback sem API: adiciona start no src
  const player = document.getElementById("player");
  if (player) {
    player.src = `https://www.youtube.com/embed/${currentVideoId}?enablejsapi=1&start=${seconds}`;
  }
}

function loadVideoId(videoId, startSeconds) {
  currentVideoId = videoId;

  if (
    isPlayerReady &&
    ytPlayer &&
    typeof ytPlayer.loadVideoById === "function"
  ) {
    if (typeof startSeconds === "number") {
      ytPlayer.loadVideoById({
        videoId,
        startSeconds,
      });
    } else {
      ytPlayer.loadVideoById(videoId);
    }
    return;
  }

  const player = document.getElementById("player");
  if (player) {
    let src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
    if (typeof startSeconds === "number") {
      src += `&start=${startSeconds}`;
    }
    player.src = src;
  }
}

const flashcards = [
  {
    question: "O que é o Git?",
    answer: "Git é um sistema de controle de versão distribuído.",
  },
  {
    question: "Para que serve o GitHub?",
    answer: "Para hospedar repositórios e colaborar com outras pessoas.",
  },
  {
    question: "O que é um commit?",
    answer: "Um registro de mudanças no histórico do repositório.",
  },
];

let currentFlashcard = 0;

// Container onde o botão "Concluir Aula" aparece
const acoesContainer = document.querySelector(".acoes");
let concluirAulaBtn = document.getElementById("concluirAula");

function createConcluirAulaButton() {
  const btn = document.createElement("button");
  btn.id = "concluirAula";
  btn.textContent = "Concluir Aula";
  btn.addEventListener("click", concluirAula);
  return btn;
}

function init() {
  // Busca elementos do DOM que usaremos durante a sessão
  acoesContainer = document.querySelector(".acoes");
  concluirAulaBtn = document.getElementById("concluirAula");

  // Caso o botão não exista (ex: removido ao alternar abas), recria
  if (!concluirAulaBtn && acoesContainer) {
    concluirAulaBtn = createConcluirAulaButton();
    acoesContainer.appendChild(concluirAulaBtn);
  }

  // Renderiza flashcards e capítulos (timestamps)
  renderFlashcard(currentFlashcard);
  renderChapters();

  // Ativa flip ao clicar no cartão (além do botão "Virar")
  const flashcardElement = document.getElementById("flashcard");
  if (flashcardElement) {
    flashcardElement.addEventListener("click", () => {
      flashcardElement.classList.toggle("flipped");
    });
  }
}

const savedFlashcardIndex = Number(localStorage.getItem("flashcardIndex"));
if (
  !Number.isNaN(savedFlashcardIndex) &&
  savedFlashcardIndex >= 0 &&
  savedFlashcardIndex < flashcards.length
) {
  currentFlashcard = savedFlashcardIndex;
}

function renderFlashcard(index) {
  const questionEl = document.getElementById("flashcard-question");
  const answerEl = document.getElementById("flashcard-answer");
  const counterEl = document.getElementById("flashcardCounter");
  const prevButton = document.getElementById("prevFlashcard");
  const nextButton = document.getElementById("nextFlashcard");
  const card = document.getElementById("flashcard");

  if (
    !questionEl ||
    !answerEl ||
    !counterEl ||
    !prevButton ||
    !nextButton ||
    !card
  )
    return;

  const flashcard = flashcards[index];
  if (!flashcard) return;

  questionEl.innerText = flashcard.question;
  answerEl.innerText = flashcard.answer;
  counterEl.innerText = `${index + 1} / ${flashcards.length}`;
  localStorage.setItem("flashcardIndex", index);
  card.classList.remove("flipped");

  prevButton.disabled = index === 0;
  nextButton.disabled = index === flashcards.length - 1;
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

function setActiveChapter(index) {
  document.querySelectorAll("#chaptersList li").forEach((li, i) => {
    li.classList.toggle("active", i === index);
  });
}

function renderChapters() {
  const list = document.getElementById("chaptersList");
  if (!list) return;

  list.innerHTML = "";

  chapters.forEach((chapter, index) => {
    const li = document.createElement("li");
    li.textContent = `${formatTime(chapter.time)} – ${chapter.title}`;
    li.addEventListener("click", () => {
      goToTime(chapter.time);
      setActiveChapter(index);
      mostrarTab("video");
    });

    list.appendChild(li);
  });

  setActiveChapter(0);
}

function mostrarTab(tab) {
  document.getElementById("video").style.display =
    tab === "video" ? "block" : "none";

  document.getElementById("flashcards").style.display =
    tab === "flashcards" ? "block" : "none";

  // marca a aba ativa no visual
  document.querySelectorAll(".tabs button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });

  // Pausa o vídeo ao entrar nos flashcards (melhora UX)
  if (
    tab === "flashcards" &&
    isPlayerReady &&
    ytPlayer &&
    typeof ytPlayer.pauseVideo === "function"
  ) {
    ytPlayer.pauseVideo();
  }

  // Remove o botão "Concluir Aula" do DOM enquanto estivermos nos flashcards
  if (tab === "flashcards") {
    if (concluirAulaBtn && concluirAulaBtn.parentElement) {
      concluirAulaBtn.parentElement.removeChild(concluirAulaBtn);
    }
  } else {
    // Garante que o botão esteja presente ao voltar para a aba de vídeo
    if (!document.getElementById("concluirAula") && acoesContainer) {
      if (!concluirAulaBtn) {
        concluirAulaBtn = createConcluirAulaButton();
      }
      acoesContainer.appendChild(concluirAulaBtn);
    }
  }

  if (tab === "flashcards") {
    renderFlashcard(currentFlashcard);
  }
}

function trocarVideo(video, event) {
  // Se a chave existir em `videos`, usa esse ID.
  // Caso contrário assume que `video` já é um ID do YouTube.
  const videoId = videos[video] || video;
  const startTime = videoStartTimes[video];
  loadVideoId(videoId, startTime);

  // Volta para a aba de vídeo (para o usuário ver o player)
  mostrarTab("video");

  // Atualiza seleção no menu lateral
  document
    .querySelectorAll(".aula")
    .forEach((el) => el.classList.remove("ativa"));
  event.currentTarget.classList.add("ativa");
}

// Controle de progresso
function concluirAula() {
  let progresso = parseInt(document.getElementById("progresso").innerText) || 0;

  if (progresso < 100) {
    progresso += 25;
    document.getElementById("progresso").innerText = progresso;
  }

  // salva no navegador
  localStorage.setItem("progresso", progresso);

  // salva última aula clicada
  localStorage.setItem(
    "aulaAtual",
    document.querySelector(".aula.ativa").innerText.trim(),
  );
}

// carrega progresso ao abrir a página
if (localStorage.getItem("progresso")) {
  document.getElementById("progresso").innerText =
    localStorage.getItem("progresso");
} else {
  document.getElementById("progresso").innerText = "0";
}

// Inicializa a página quando o DOM estiver pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

function flipFlashcard() {
  const card = document.getElementById("flashcard");
  if (!card) return;
  card.classList.toggle("flipped");
}

function nextFlashcard() {
  if (currentFlashcard >= flashcards.length - 1) return;
  currentFlashcard += 1;
  renderFlashcard(currentFlashcard);
}

function prevFlashcard() {
  if (currentFlashcard <= 0) return;
  currentFlashcard -= 1;
  renderFlashcard(currentFlashcard);
}
