(() => {
  const slide = document.querySelector('[data-slide-impact-time]');
  if (!slide) return;

  const metric = slide.querySelector('.time-metric');
  const counter = slide.querySelector('[data-time-counter]');
  const replayButton = slide.querySelector('[data-impact-time-replay]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let countdownFrame;
  let countdownTimer;
  let finalTimer;
  let readyTimer;

  const clearTimers = () => {
    window.cancelAnimationFrame(countdownFrame);
    window.clearTimeout(countdownTimer);
    window.clearTimeout(finalTimer);
    window.clearTimeout(readyTimer);
  };

  const setReplayReady = (ready) => {
    replayButton.disabled = !ready;
    replayButton.classList.toggle('is-ready', ready);
  };

  const finishComparison = () => {
    slide.classList.remove('is-counting');
    metric.classList.add('is-final');
    readyTimer = window.setTimeout(() => setReplayReady(true), 1800);
  };

  const runCountdown = () => {
    slide.classList.add('is-counting');
    const start = performance.now();
    const duration = 2300;
    const update = (now) => {
      const elapsed = Math.min(duration, now - start);
      const value = Math.max(10, 30 - Math.floor((elapsed / duration) * 20));
      counter.textContent = String(value);
      if (elapsed < duration) countdownFrame = window.requestAnimationFrame(update);
      else {
        counter.textContent = '10';
        finalTimer = window.setTimeout(finishComparison, 300);
      }
    };
    countdownFrame = window.requestAnimationFrame(update);
  };

  const playMetric = (isReplay = true) => {
    clearTimers();
    setReplayReady(false);
    slide.classList.remove('impact-time-metric-running', 'impact-time-metric-replay', 'is-counting');
    metric.classList.remove('is-final');
    counter.textContent = '30';
    void metric.offsetWidth;
    if (isReplay) slide.classList.add('impact-time-metric-replay');
    slide.classList.add('impact-time-metric-running');
    if (reducedMotion.matches) {
      metric.classList.add('is-final');
      setReplayReady(true);
      return;
    }
    countdownTimer = window.setTimeout(runCountdown, isReplay ? 650 : 2200);
  };

  const restartEntry = () => {
    clearTimers();
    setReplayReady(false);
    slide.classList.remove('impact-time-entry-running', 'impact-time-metric-running', 'impact-time-metric-replay', 'is-counting');
    metric.classList.remove('is-final');
    counter.textContent = '30';
    void slide.offsetWidth;
    slide.classList.add('impact-time-entry-running');
    playMetric(false);
  };

  const reset = () => {
    clearTimers();
    slide.classList.remove('impact-time-entry-running', 'impact-time-metric-running', 'impact-time-metric-replay', 'is-counting');
    metric.classList.remove('is-final');
    counter.textContent = '30';
    setReplayReady(false);
  };

  document.addEventListener('presentation:slidechange', ({ detail }) => {
    if (detail.activeSlide === slide) restartEntry();
    else reset();
  });

  replayButton.addEventListener('click', (event) => {
    event.preventDefault();
    playMetric();
  });
})();
