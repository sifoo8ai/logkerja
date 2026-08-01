(() => {
  const slide = document.querySelector('[data-slide-impact-workforce]');
  if (!slide) return;

  const comparison = slide.querySelector('.workforce-comparison');
  const impactCard = slide.querySelector('.workforce-impact-card');
  const replayButton = slide.querySelector('[data-impact-workforce-replay]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timers = [];

  const clearTimers = () => {
    timers.forEach((timer) => window.clearTimeout(timer));
    timers = [];
  };

  const after = (delay, callback) => {
    const timer = window.setTimeout(callback, delay);
    timers.push(timer);
  };

  const setReplayReady = (ready) => {
    replayButton.disabled = !ready;
    replayButton.classList.toggle('is-ready', ready);
  };

  const resetComparison = () => {
    clearTimers();
    slide.classList.remove('workforce-comparison-running', 'workforce-comparison-replay');
    comparison.classList.remove('is-complete');
    impactCard.classList.remove('is-complete');
    setReplayReady(false);
  };

  const completeImmediately = () => {
    slide.classList.remove('workforce-comparison-running', 'workforce-comparison-replay');
    comparison.classList.add('is-complete');
    impactCard.classList.add('is-complete');
    setReplayReady(true);
  };

  const playComparison = (isReplay = false) => {
    resetComparison();
    if (reducedMotion.matches) {
      completeImmediately();
      return;
    }

    if (isReplay) slide.classList.add('workforce-comparison-replay');
    void comparison.offsetWidth;
    slide.classList.add('workforce-comparison-running');
    after(isReplay ? 6100 : 7650, () => {
      comparison.classList.add('is-complete');
      impactCard.classList.add('is-complete');
      setReplayReady(true);
    });
  };

  const restartEntry = () => {
    resetComparison();
    slide.classList.remove('workforce-entry-running');
    void slide.offsetWidth;
    slide.classList.add('workforce-entry-running');
    if (reducedMotion.matches) {
      completeImmediately();
      return;
    }
    after(1460, () => playComparison(false));
  };

  const reset = () => {
    clearTimers();
    slide.classList.remove('workforce-entry-running', 'workforce-comparison-running', 'workforce-comparison-replay');
    comparison.classList.remove('is-complete');
    impactCard.classList.remove('is-complete');
    setReplayReady(false);
  };

  document.addEventListener('presentation:slidechange', ({ detail }) => {
    if (detail.activeSlide === slide) restartEntry();
    else reset();
  });

  replayButton.addEventListener('click', (event) => {
    event.preventDefault();
    playComparison(true);
  });
})();
