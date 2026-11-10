const backgroundBanner = document.querySelector(".background-banner");
const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (backgroundBanner && window.VanillaTilt && supportsHover && !prefersReducedMotion) {
  window.VanillaTilt.init(backgroundBanner, {
    max: 7,
    perspective: 1000,
    scale: 1.04,
    speed: 400,
    transition: true,
    reset: true,
    gyroscope: false
  });
}

const videoCarousel = document.querySelector(".video-carousel");

if (videoCarousel) {
  const videos = Array.from(videoCarousel.querySelectorAll(".video-carousel-viewport video"));
  const position = videoCarousel.querySelector(".video-position");
  const previousButton = videoCarousel.querySelector(".video-previous");
  const nextButton = videoCarousel.querySelector(".video-next");
  let currentIndex = videos.findIndex((video) => video.classList.contains("is-active"));
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
    position.textContent = `${currentIndex + 1} of ${videos.length}`;
  }

  videos.forEach((video, videoIndex) => {
    video.addEventListener("click", () => {
      if (videoIndex !== currentIndex) {
        showVideo(videoIndex);
      }
    });
  });

  showVideo(currentIndex);
  previousButton.addEventListener("click", () => showVideo(currentIndex - 1));
  nextButton.addEventListener("click", () => showVideo(currentIndex + 1));

  videoCarousel.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      wheelDistance += Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX
        : event.deltaY;

      if (Math.abs(wheelDistance) >= 60) {
        showVideo(currentIndex + (wheelDistance > 0 ? 1 : -1));
        wheelDistance = 0;
      }
    },
    { passive: false }
  );
}
