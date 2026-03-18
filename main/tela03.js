// Alterna entre Video e Flashcards
function mostrarTab(tab) {
  document.getElementById("video").style.display =
    tab === "video" ? "block" : "none";

  document.getElementById("flashcards").style.display =
    tab === "flashcards" ? "block" : "none";
}

function trocarVideo(video, event) {
  const player = document.getElementById("player");

  // verifica se é link do YouTube ou vídeo local
  if (video.includes("youtube")) {
    player.src = video;
  } else {
    player.src = "videos/" + video + ".mp4";
  }

  // NOVO: remove seleção de todas as aulas
  document
    .querySelectorAll(".aula")
    .forEach((el) => el.classList.remove("ativa"));

  // NOVO: adiciona seleção na clicada
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
