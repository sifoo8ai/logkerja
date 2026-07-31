(() => {
  const slide = document.querySelector('[data-slide-milestone]');
  if (!slide) return;

  const timeline = slide.querySelector('.milestone-timeline');
  const replayButton = slide.querySelector('[data-milestone-replay]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let readyTimer;

  const clearReadyTimer = () => window.clearTimeout(readyTimer);

  const setReplayReady = (ready) => {
    replayButton.disabled = !ready;
    replayButton.classList.toggle('is-ready', ready);
  };

  const queueReplayControl = (isReplay) => {
    clearReadyTimer();
    if (reducedMotion.matches) {
      setReplayReady(true);
      return;
    }
    readyTimer = window.setTimeout(() => setReplayReady(true), isReplay ? 7800 : 8900);
  };

  const replayTimeline = (isReplay = true) => {
    clearReadyTimer();
    setReplayReady(false);
    slide.classList.remove('milestone-flow-running', 'milestone-flow-replay');
    void timeline.offsetWidth;
    if (isReplay) slide.classList.add('milestone-flow-replay');
    slide.classList.add('milestone-flow-running');
    queueReplayControl(isReplay);
  };

  const restartEntry = () => {
    clearReadyTimer();
    setReplayReady(false);
    slide.classList.remove('milestone-entry-running', 'milestone-flow-running', 'milestone-flow-replay');
    void slide.offsetWidth;
    slide.classList.add('milestone-entry-running');
    replayTimeline(false);
  };

  const reset = () => {
    clearReadyTimer();
    slide.classList.remove('milestone-entry-running', 'milestone-flow-running', 'milestone-flow-replay');
    setReplayReady(false);
  };

  document.addEventListener('presentation:slidechange', ({ detail }) => {
    if (detail.activeSlide === slide) restartEntry();
    else reset();
  });

  replayButton.addEventListener('click', (event) => {
    event.preventDefault();
    replayTimeline();
  });
})();
