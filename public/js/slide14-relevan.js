(() => {
  const slide = document.querySelector('[data-slide-relevance]');
  if (!slide) return;

  const replayButton = slide.querySelector('[data-relevance-replay]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let readyTimer;

  const clearTimer = () => window.clearTimeout(readyTimer);

  const setReplayReady = (ready) => {
    replayButton.disabled = !ready;
    replayButton.classList.toggle('is-ready', ready);
  };

  const completeFlow = () => {
    slide.classList.add('relevance-flow-complete');
    setReplayReady(true);
  };

  const playFlow = (isReplay = false) => {
    clearTimer();
    setReplayReady(false);
    slide.classList.remove('relevance-flow-running', 'relevance-flow-replay', 'relevance-flow-complete');
    void slide.offsetWidth;
    if (isReplay) slide.classList.add('relevance-flow-replay');
    slide.classList.add('relevance-flow-running');
    if (reducedMotion.matches) {
      completeFlow();
      return;
    }
    readyTimer = window.setTimeout(completeFlow, isReplay ? 5900 : 5950);
  };

  const reset = () => {
    clearTimer();
    slide.classList.remove('relevance-flow-running', 'relevance-flow-replay', 'relevance-flow-complete');
    setReplayReady(false);
  };

  document.addEventListener('presentation:slidechange', ({ detail }) => {
    if (detail.activeSlide === slide) playFlow();
    else reset();
  });

  replayButton.addEventListener('click', (event) => {
    event.preventDefault();
    playFlow(true);
  });
})();
