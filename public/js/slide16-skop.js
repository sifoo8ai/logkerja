(() => {
  const slide = document.querySelector('[data-slide-scope]');
  if (!slide) return;

  const replayButton = slide.querySelector('[data-scope-replay]');
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
    slide.classList.remove('scope-running', 'scope-panel-replaying');
    slide.classList.add('scope-complete');
    setReplayReady(true);
  };

  const play = () => {
    clearTimer();
    setReplayReady(false);
    slide.classList.remove('scope-running', 'scope-panel-replaying', 'scope-complete');
    void slide.offsetWidth;
    slide.classList.add('scope-running');
    if (reducedMotion.matches) {
      finish();
      return;
    }
    completionTimer = window.setTimeout(finish, 3550);
  };

  const finishPanelReplay = () => {
    clearTimer();
    slide.classList.remove('scope-panel-replaying');
    replayButton.disabled = false;
  };

  const replayPanel = () => {
    clearTimer();
    replayButton.disabled = true;
    slide.classList.remove('scope-panel-replaying');
    void slide.offsetWidth;
    if (reducedMotion.matches) {
      finishPanelReplay();
      return;
    }
    slide.classList.add('scope-panel-replaying');
    completionTimer = window.setTimeout(finishPanelReplay, 1450);
  };

  const reset = () => {
    clearTimer();
    slide.classList.remove('scope-running', 'scope-panel-replaying', 'scope-complete');
    setReplayReady(false);
  };

  const skipToFinal = (event) => {
    if (!slide.classList.contains('active') || slide.classList.contains('scope-complete')) return;
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
    replayPanel();
  });
})();
