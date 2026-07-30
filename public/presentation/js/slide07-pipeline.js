(() => {
  const slide = document.querySelector('[data-slide07]');
  if (!slide) return;

  const pipeline = slide.querySelector('.solution-pipeline');
  const replayButton = slide.querySelector('[data-pipeline-replay]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let readyTimer;

  const clearReadyTimer = () => window.clearTimeout(readyTimer);

  const setReplayReady = (ready) => {
    replayButton.disabled = !ready;
    replayButton.classList.toggle('is-ready', ready);
  };

  const queueReplayControl = () => {
    clearReadyTimer();
    if (reducedMotion.matches) {
      setReplayReady(true);
      return;
    }
    readyTimer = window.setTimeout(() => setReplayReady(true), 6650);
  };

  const replayPipeline = () => {
    clearReadyTimer();
    setReplayReady(false);
    slide.classList.remove('pipeline-running');
    void pipeline.offsetWidth;
    slide.classList.add('pipeline-running');
    queueReplayControl();
  };

  const restartEntry = () => {
    clearReadyTimer();
    setReplayReady(false);
    slide.classList.remove('slide07-running', 'pipeline-running');
    void slide.offsetWidth;
    slide.classList.add('slide07-running');
    replayPipeline();
  };

  const reset = () => {
    clearReadyTimer();
    slide.classList.remove('slide07-running', 'pipeline-running');
    setReplayReady(false);
  };

  document.addEventListener('presentation:slidechange', ({ detail }) => {
    if (detail.activeSlide === slide) restartEntry();
    else reset();
  });

  replayButton.addEventListener('click', (event) => {
    event.preventDefault();
    replayPipeline();
  });
})();
