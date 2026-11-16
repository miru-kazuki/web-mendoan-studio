// 1. OTOMATIS STYLING GAMBAR YANG BELUM ADA MENJADI PLACEHOLDER
function applyPlaceholder(img) {
  const slot = img.closest(".img-slot");
  if (!slot || slot.classList.contains("is-placeholder")) return;

  slot.classList.add("is-placeholder");
  const label = document.createElement("span");
  label.className = "placeholder-label";
  label.textContent = img.dataset.placeholder || img.alt || "Placeholder Image";
  slot.appendChild(label);
}

document.querySelectorAll(".img-slot img").forEach((img) => {
  if (img.complete && img.naturalWidth === 0) {
    applyPlaceholder(img);
  } else {
    img.addEventListener("error", () => applyPlaceholder(img));
  }
});

// 2. VANILLA TILT PADA HERO BANNER
const backgroundBanner = document.querySelector(".background-banner");
const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (backgroundBanner && window.VanillaTilt && supportsHover && !prefersReducedMotion) {
  window.VanillaTilt.init(backgroundBanner, {
    max: 5,
    perspective: 1000,
    scale: 1.03,
    speed: 400,
    transition: true,
    reset: true,
    gyroscope: false
  });
}

// 3. VIDEO CAROUSEL (OUR PORTFOLIO)
const videoCarousel = document.querySelector(".video-carousel");

if (videoCarousel) {
  const videos = Array.from(videoCarousel.querySelectorAll(".video-carousel-viewport video"));
  const position = videoCarousel.querySelector(".video-position");
  const previousButton = videoCarousel.querySelector(".video-previous");
  const nextButton = videoCarousel.querySelector(".video-next");
  let currentIndex = Math.max(0, videos.findIndex((v) => v.classList.contains("is-active")));
  let wheelDistance = 0;

  function showVideo(index) {
    videos[currentIndex].pause();
    currentIndex = (index + videos.length) % videos.length;
    videos.forEach((video, videoIndex) => {
      const offset = (videoIndex - currentIndex + videos.length) % videos.length;
      video.classList.toggle("is-active", offset === 0);
      video.classList.toggle("is-next", offset === 1);
      video.classList.toggle("is-previous", offset === videos.length - 1);
      video.hidden = offset !== 0 && offset !== 1 && offset !== videos.length - 1;
      video.controls = offset === 0;
    });
    position.textContent = `${currentIndex + 1} / ${videos.length}`;
  }

  videos.forEach((video, videoIndex) => {
    video.addEventListener("click", () => {
      if (videoIndex !== currentIndex) showVideo(videoIndex);
    });
  });

  showVideo(currentIndex);
  previousButton.addEventListener("click", () => showVideo(currentIndex - 1));
  nextButton.addEventListener("click", () => showVideo(currentIndex + 1));

  videoCarousel.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      wheelDistance += Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (Math.abs(wheelDistance) >= 60) {
        showVideo(currentIndex + (wheelDistance > 0 ? 1 : -1));
        wheelDistance = 0;
      }
    },
    { passive: false }
  );
}

// 4. PROJECTS HORIZONTAL SCROLL PAKAI MOUSE WHEEL (HALAMAN UTAMA)
const projectsSection = document.getElementById("projects");
const projectsTrack = document.getElementById("projectsTrack");
const projPrev = document.getElementById("projPrev");
const projNext = document.getElementById("projNext");

if (projectsSection && projectsTrack) {
  projectsSection.addEventListener(
    "wheel",
    (event) => {
      const atLeftEnd = projectsTrack.scrollLeft <= 0 && event.deltaY < 0;
      const atRightEnd =
        Math.ceil(projectsTrack.scrollLeft + projectsTrack.clientWidth) >= projectsTrack.scrollWidth &&
        event.deltaY > 0;

      if (!atLeftEnd && !atRightEnd && Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        event.preventDefault();
        projectsTrack.scrollLeft += event.deltaY * 1.5;
      }
    },
    { passive: false }
  );

  if (projPrev && projNext) {
    projPrev.addEventListener("click", () => {
      projectsTrack.scrollBy({ left: -480, behavior: "smooth" });
    });
    projNext.addEventListener("click", () => {
      projectsTrack.scrollBy({ left: 480, behavior: "smooth" });
    });
  }
}

// 5. DATA & SWITCHER HALAMAN GAMES (games.html)
const GAMES_DATA = [
  {
    id: "damnation",
    title: "DAMNATION DINER TRUCK",
    subtitle: "Playable WebGL Build",
    badge: "Playable",
    desc: "An endless demonic cooking simulator where you must juggle preparing food while surviving screen-blocking customer chats and sudden corporate paperwork.",
    coverImg: "Image/damnation-cover.png",
    coverPlaceholder: "Placeholder: Damnation Diner Truck Cover (16:9)",
    charImg: "Image/damnation-chars.png",
    charPlaceholder: "Placeholder: Damnation Character Cast",
    iframeSrc: "DDT v1.0 webgl/index.html", // Sesuaikan dengan nama folder WebGL build Damnation
    meta: "Playable · Demonic cooking simulator"
  },
  {
    id: "modulo",
    title: "MODULO: THE SOCIAL ALGORITHM",
    subtitle: "Playable WebGL Build",
    badge: "Playable",
    desc: "An assembly-inspired programming puzzle game where you manipulate data streams using modular logic commands to solve algorithmic challenges.",
    coverImg: "Image/modulo-cover.png",
    coverPlaceholder: "Placeholder: Modulo WebGL Cover",
    charImg: "Image/modulo-chars.png",
    charPlaceholder: "Placeholder: Modulo Visual Assets",
    iframeSrc: "BuildModuloWeb/index.html", // Sesuaikan dengan nama folder WebGL build Modulo
    meta: "Playable · Programming puzzle game"
  },
  {
    id: "platform-b",
    title: "PROJECT “PLATFORM-B”",
    subtitle: "Game showcase",
    badge: "Upcoming",
    desc: "Trapped in an endless subway station, a college student burdened by lifelong health struggles meets a delinquent companion. As an unfitting pair, they must grow into a profound bond to find a way out.",
    coverImg: "Image/peron gameplay.png",
    coverPlaceholder: "Placeholder: Platform-B Gameplay",
    charImg: "Image/peron char.png",
    charPlaceholder: "Placeholder: Platform-B Character",
    iframeSrc: "",
    meta: "Upcoming · A story-rich adventure"
  }
];

const gameTitleEl = document.getElementById("gameTitle");
if (gameTitleEl) {
  const params = new URLSearchParams(window.location.search);
  const requestedId = params.get("game") || "damnation";
  let activeGameIdx = GAMES_DATA.findIndex((g) => g.id === requestedId);
  if (activeGameIdx === -1) activeGameIdx = 0;

  const gameSubtitleEl = document.getElementById("gameSubtitle");
  const gameBadgeEl = document.getElementById("gameBadge");
  const gameDescEl = document.getElementById("gameDesc");
  const gameCoverImg = document.getElementById("gameCoverImg");
  const gameCharImg = document.getElementById("gameCharImg");
  const gameIframeBox = document.getElementById("gameIframeBox");
  const gameMediaBox = document.getElementById("gameMediaBox");
  const gameIframe = document.getElementById("gameIframe");
  const launchGameBtn = document.getElementById("launchGameBtn");
  const launchBtnLabel = document.getElementById("launchBtnLabel");
  const stageBarTag = document.getElementById("stageBarTag");

  const nextGameThumb = document.getElementById("nextGameThumb");
  const nextGameTitle = document.getElementById("nextGameTitle");
  const nextGameMeta = document.getElementById("nextGameMeta");
  const nextGameBtn = document.getElementById("nextGameBtn");

  function resetImgSlot(imgEl, src, placeholderText) {
    const slot = imgEl.closest(".img-slot");
    if (slot) {
      slot.classList.remove("is-placeholder");
      const oldLabel = slot.querySelector(".placeholder-label");
      if (oldLabel) oldLabel.remove();
    }
    imgEl.dataset.placeholder = placeholderText;
    imgEl.src = src;

    if (imgEl.complete && imgEl.naturalWidth === 0) {
      applyPlaceholder(imgEl);
    }
  }

  function renderGame(idx) {
    const current = GAMES_DATA[idx];
    const next = GAMES_DATA[(idx + 1) % GAMES_DATA.length];

    gameTitleEl.textContent = current.title;
    gameSubtitleEl.textContent = current.subtitle;
    gameBadgeEl.textContent = current.badge;
    gameDescEl.textContent = current.desc;
    stageBarTag.textContent = current.subtitle;

    resetImgSlot(gameCoverImg, current.coverImg, current.coverPlaceholder);
    resetImgSlot(gameCharImg, current.charImg, current.charPlaceholder);

    if (current.iframeSrc) {
      gameIframe.src = current.iframeSrc;
      gameIframeBox.hidden = false;
      gameMediaBox.hidden = true;
    } else {
      gameIframe.src = "about:blank";
      gameIframeBox.hidden = true;
      gameMediaBox.hidden = false;
      launchBtnLabel.textContent = current.badge === "Playable" ? "Play showcase" : "Preview trailer";
    }

    resetImgSlot(nextGameThumb, next.coverImg, `Placeholder: ${next.title}`);
    nextGameTitle.textContent = next.title;
    nextGameMeta.textContent = next.meta;
  }

  renderGame(activeGameIdx);

  nextGameBtn.addEventListener("click", () => {
    activeGameIdx = (activeGameIdx + 1) % GAMES_DATA.length;
    const newUrl = `${window.location.pathname}?game=${GAMES_DATA[activeGameIdx].id}`;
    window.history.replaceState({}, "", newUrl);
    renderGame(activeGameIdx);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  launchGameBtn.addEventListener("click", () => {
    const current = GAMES_DATA[activeGameIdx];
    if (!current.iframeSrc) {
      const playableIdx = GAMES_DATA.findIndex((g) => g.iframeSrc);
      if (playableIdx !== -1) {
        activeGameIdx = playableIdx;
        const newUrl = `${window.location.pathname}?game=${GAMES_DATA[activeGameIdx].id}`;
        window.history.replaceState({}, "", newUrl);
        renderGame(activeGameIdx);
      }
    }
  });
}