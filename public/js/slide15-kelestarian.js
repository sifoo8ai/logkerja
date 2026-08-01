(() => {
  const slide = document.querySelector('[data-slide-sustainability]');
  if (!slide) return;

  const replayButton = slide.querySelector('[data-sustainability-replay]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const nextButton = document.getElementById('next');
  let completionTimer;

  const clearTimer = () => window.clearTimeout(completionTimer);

  const setReplayReady = (ready) => {
    replayButton.disabled = !ready;
    replayButton.classList.toggle('is-ready', ready);
  };

  const finish = () => {
    clearTimer();
    slide.classList.remove('sustain-running', 'sustain-replay');
    slide.classList.add('sustain-complete');
    setReplayReady(true);
  };

  const play = (isReplay = false) => {
    clearTimer();
    setReplayReady(false);
    slide.classList.remove('sustain-running', 'sustain-replay', 'sustain-complete');
    void slide.offsetWidth;
    if (isReplay) slide.classList.add('sustain-replay');
    slide.classList.add('sustain-running');
    if (reducedMotion.matches) {
      finish();
      return;
    }
    completionTimer = window.setTimeout(finish, isReplay ? 5100 : 5150);
  };

  const reset = () => {
    clearTimer();
    slide.classList.remove('sustain-running', 'sustain-replay', 'sustain-complete');
    setReplayReady(false);
  };

  const skipToFinal = (event) => {
    if (!slide.classList.contains('active') || slide.classList.contains('sustain-complete')) return;
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
    play(true);
  });
})();
