(() => {
  const slide = document.querySelector('[data-slide08]');
  if (!slide) return;

  const stage = slide.querySelector('.workflow-stage');
  const replayButton = slide.querySelector('[data-workflow-replay]');
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
    readyTimer = window.setTimeout(() => setReplayReady(true), isReplay ? 6700 : 7800);
  };

  const replayWorkflow = (isReplay = true) => {
    clearReadyTimer();
    setReplayReady(false);
    slide.classList.remove('workflow-flow-running', 'workflow-flow-replay');
    void stage.offsetWidth;
    if (isReplay) slide.classList.add('workflow-flow-replay');
    slide.classList.add('workflow-flow-running');
    queueReplayControl(isReplay);
  };

  const restartEntry = () => {
    clearReadyTimer();
    setReplayReady(false);
    slide.classList.remove('workflow-entry-running', 'workflow-flow-running', 'workflow-flow-replay');
    void slide.offsetWidth;
    slide.classList.add('workflow-entry-running');
    replayWorkflow(false);
  };

  const reset = () => {
    clearReadyTimer();
    slide.classList.remove('workflow-entry-running', 'workflow-flow-running', 'workflow-flow-replay');
    setReplayReady(false);
  };

  document.addEventListener('presentation:slidechange', ({ detail }) => {
    if (detail.activeSlide === slide) restartEntry();
    else reset();
  });

  replayButton.addEventListener('click', (event) => {
    event.preventDefault();
    replayWorkflow();
  });
})();
