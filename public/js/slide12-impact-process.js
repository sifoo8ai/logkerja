(() => {
  const slide = document.querySelector('[data-slide-impact-process]');
  if (!slide) return;

  const replayButton = slide.querySelector('[data-impact-process-replay]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let startTimer;
  let readyTimer;

  const clearTimers = () => {
    window.clearTimeout(startTimer);
    window.clearTimeout(readyTimer);
  };

  const setReplayReady = (ready) => {
    replayButton.disabled = !ready;
    replayButton.classList.toggle('is-ready', ready);
  };

  const finishList = () => {
    slide.classList.add('process-list-complete');
    setReplayReady(true);
  };

  const playList = (isReplay = false) => {
    clearTimers();
    setReplayReady(false);
    slide.classList.remove('process-list-running', 'process-list-replay', 'process-list-complete');
    void slide.offsetWidth;
    if (isReplay) slide.classList.add('process-list-replay');
    slide.classList.add('process-list-running');
    if (reducedMotion.matches) {
      finishList();
      return;
    }
    readyTimer = window.setTimeout(finishList, isReplay ? 2650 : 3850);
  };

  const restartEntry = () => {
    clearTimers();
    setReplayReady(false);
    slide.classList.remove('process-entry-running', 'process-list-running', 'process-list-replay', 'process-list-complete');
    void slide.offsetWidth;
    slide.classList.add('process-entry-running');
    if (reducedMotion.matches) {
      playList();
      return;
    }
    startTimer = window.setTimeout(() => playList(), 10);
  };

  const reset = () => {
    clearTimers();
    slide.classList.remove('process-entry-running', 'process-list-running', 'process-list-replay', 'process-list-complete');
    setReplayReady(false);
  };

  document.addEventListener('presentation:slidechange', ({ detail }) => {
    if (detail.activeSlide === slide) restartEntry();
    else reset();
  });

  replayButton.addEventListener('click', (event) => {
    event.preventDefault();
    playList(true);
  });
})();
