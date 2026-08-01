(() => {
  const slide = document.querySelector('[data-slide-significance]');
  if (!slide) return;

  const replayButton = slide.querySelector('[data-significance-replay]');
  const nextButton = document.getElementById('next');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let completionTimer;

  const clearTimer = () => window.clearTimeout(completionTimer);

  const setReplayReady = (ready) => {
    replayButton.disabled = !ready;
    replayButton.classList.toggle('is-ready', ready);
  };

  const finish = () => {
    clearTimer();
    slide.classList.remove('significance-running');
    slide.classList.add('significance-complete');
    setReplayReady(true);
  };

  const play = () => {
    clearTimer();
    setReplayReady(false);
    slide.classList.remove('significance-running', 'significance-complete');
    void slide.offsetWidth;
    slide.classList.add('significance-running');
    if (reducedMotion.matches) {
      finish();
      return;
    }
    completionTimer = window.setTimeout(finish, 5300);
  };

  const reset = () => {
    clearTimer();
    slide.classList.remove('significance-running', 'significance-complete');
    setReplayReady(false);
  };

  const skipToFinal = (event) => {
    if (!slide.classList.contains('active') || slide.classList.contains('significance-complete')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    finish();
  };

  document.addEventListener('presentation:slidechange', ({ detail }) => {
    if (detail.activeSlide === slide) play();
    else reset();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === ' ') skipToFinal(event);
  }, true);

  nextButton?.addEventListener('click', skipToFinal, true);

  replayButton.addEventListener('click', (event) => {
    event.preventDefault();
    play();
  });
})();
