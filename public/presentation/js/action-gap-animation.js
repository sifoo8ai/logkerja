(() => {
  "use strict";

  const visual = document.querySelector("[data-action-gap]");
  const slide = visual?.closest(".slide");

  function restartActionGap() {
    if (!visual) return;
    visual.classList.remove("action-gap-running");
    void visual.offsetWidth;
    visual.classList.add("action-gap-running");
  }

  document.addEventListener("presentation:slidechange", (event) => {
    if (event.detail.activeSlide === slide) restartActionGap();
  });
})();
