(() => {
  const slide = document.querySelector('[data-slide-impact-value]');
  if (!slide) return;

  const replayButton = slide.querySelector('[data-impact-value-replay]');
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

  const finishCards = () => {
    slide.classList.add('value-cards-complete');
    setReplayReady(true);
  };

  const playCards = (isReplay = false) => {
    clearTimers();
    setReplayReady(false);
    slide.classList.remove('value-cards-running', 'value-cards-replay', 'value-cards-complete');
    void slide.offsetWidth;
    if (isReplay) slide.classList.add('value-cards-replay');
    slide.classList.add('value-cards-running');
    if (reducedMotion.matches) {
      finishCards();
      return;
    }
    readyTimer = window.setTimeout(finishCards, isReplay ? 3250 : 4800);
  };

  const restartEntry = () => {
    clearTimers();
    setReplayReady(false);
    slide.classList.remove('value-entry-running', 'value-cards-running', 'value-cards-replay', 'value-cards-complete');
    void slide.offsetWidth;
    slide.classList.add('value-entry-running');
    if (reducedMotion.matches) {
      playCards();
      return;
    }
    startTimer = window.setTimeout(() => playCards(), 10);
  };

  const reset = () => {
    clearTimers();
    slide.classList.remove('value-entry-running', 'value-cards-running', 'value-cards-replay', 'value-cards-complete');
    setReplayReady(false);
  };

  document.addEventListener('presentation:slidechange', ({ detail }) => {
    if (detail.activeSlide === slide) restartEntry();
    else reset();
  });

  replayButton.addEventListener('click', (event) => {
    event.preventDefault();
    playCards(true);
  });
})();
