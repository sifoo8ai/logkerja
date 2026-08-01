(() => {
  const slide = document.querySelector('[data-slide-demo]');
  if (!slide) return;

  const demoId = 'cms8csf8x07xnqm684zxzqc06';
  const backupPath = 'assets/logkerja-demo-backup.mp4';
  const launchButton = slide.querySelector('[data-demo-launch]');
  const backupButton = slide.querySelector('[data-demo-video]');
  const replayButton = slide.querySelector('[data-demo-replay]');
  const message = slide.querySelector('[data-demo-message]');
  const videoOverlay = document.querySelector('[data-demo-video-overlay]');
  const videoPlayer = videoOverlay.querySelector('[data-demo-video-player]');
  const closeButtons = [...videoOverlay.querySelectorAll('[data-demo-video-close]')];
  const nextButton = document.getElementById('next');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let completionTimer;
  let popupObserver;
  let popupDiscoveryTimer;
  let popupPollTimer;
  let popupSeen = false;
  let externalDemoOpen = false;
  let videoAvailable = false;

  const dispatchTimer = (action) => document.dispatchEvent(new CustomEvent('presentation:timer', { detail: { action } }));
  const clearTimer = () => window.clearTimeout(completionTimer);
  const clearPopupWatch = () => {
    popupObserver?.disconnect();
    window.clearTimeout(popupDiscoveryTimer);
    window.clearInterval(popupPollTimer);
    popupObserver = undefined;
    popupDiscoveryTimer = undefined;
    popupPollTimer = undefined;
  };

  const setReplayReady = (ready) => {
    replayButton.disabled = !ready;
    replayButton.classList.toggle('is-ready', ready);
  };

  const finish = () => {
    clearTimer();
    slide.classList.remove('demo-running');
    slide.classList.add('demo-complete');
    setReplayReady(true);
  };

  const play = () => {
    clearTimer();
    setReplayReady(false);
    slide.classList.remove('demo-running', 'demo-complete');
    void slide.offsetWidth;
    slide.classList.add('demo-running');
    if (reducedMotion.matches) {
      finish();
      return;
    }
    completionTimer = window.setTimeout(finish, 2750);
  };

  const reset = () => {
    clearTimer();
    slide.classList.remove('demo-running', 'demo-complete');
    setReplayReady(false);
  };

  const setPresentationOverlay = (open) => {
    document.documentElement.classList.toggle('presentation-overlay-open', open);
    dispatchTimer(open ? 'pause' : 'resume');
  };

  const showOnlineFailure = () => {
    message.textContent = 'Demo dalam talian tidak dapat dibuka. Gunakan video sandaran.';
    message.classList.add('is-visible');
    if (videoAvailable) backupButton.classList.add('is-emphasized');
  };

  const closeVideo = () => {
    if (!videoOverlay.classList.contains('is-open')) return;
    videoPlayer.pause();
    videoOverlay.classList.remove('is-open');
    videoOverlay.setAttribute('aria-hidden', 'true');
    videoOverlay.inert = true;
    setPresentationOverlay(false);
    backupButton.focus();
  };

  const openVideo = () => {
    if (!videoAvailable) return;
    if (!videoPlayer.src) videoPlayer.src = backupPath;
    videoOverlay.classList.add('is-open');
    videoOverlay.setAttribute('aria-hidden', 'false');
    videoOverlay.inert = false;
    setPresentationOverlay(true);
    videoPlayer.play().catch(() => {});
    closeButtons[1]?.focus();
  };

  const hasSupademoPopup = () => [...document.querySelectorAll('[id*="supademo" i], [class*="supademo" i], iframe[src*="supademo"]')]
    .some((element) => {
      if (element.tagName === 'SCRIPT') return false;
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && Number.parseFloat(style.opacity || '1') > .02
        && rect.width > 1
        && rect.height > 1;
    });

  const closeExternalDemo = () => {
    if (!externalDemoOpen) return;
    externalDemoOpen = false;
    clearPopupWatch();
    setPresentationOverlay(false);
    launchButton.focus();
  };

  const watchSupademoPopup = () => {
    const inspect = () => {
      const isVisible = hasSupademoPopup();
      if (isVisible) popupSeen = true;
      if (popupSeen && !isVisible) closeExternalDemo();
    };
    popupObserver = new MutationObserver(inspect);
    popupObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
    inspect();
    popupPollTimer = window.setInterval(inspect, 120);
    popupDiscoveryTimer = window.setTimeout(() => {
      if (!popupSeen) {
        closeExternalDemo();
        showOnlineFailure();
      }
    }, 3000);
  };

  const launchDemo = () => {
    message.textContent = '';
    message.classList.remove('is-visible');
    backupButton.classList.remove('is-emphasized');
    if (!window.Supademo || typeof window.Supademo.open !== 'function') {
      showOnlineFailure();
      return;
    }
    try {
      popupSeen = false;
      externalDemoOpen = true;
      setPresentationOverlay(true);
      window.Supademo.open(demoId);
      watchSupademoPopup();
    } catch {
      closeExternalDemo();
      showOnlineFailure();
    }
  };

  const skipToFinal = (event) => {
    if (!slide.classList.contains('active') || slide.classList.contains('demo-complete')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    finish();
  };

  const probeBackupVideo = () => {
    const probe = document.createElement('video');
    probe.preload = 'metadata';
    probe.addEventListener('loadedmetadata', () => {
      videoAvailable = true;
      backupButton.hidden = false;
      probe.removeAttribute('src');
      probe.load();
    }, { once: true });
    probe.addEventListener('error', () => {
      videoAvailable = false;
      backupButton.hidden = true;
    }, { once: true });
    probe.src = backupPath;
  };

  document.addEventListener('presentation:slidechange', ({ detail }) => {
    if (detail.activeSlide === slide) play();
    else {
      reset();
      closeVideo();
      closeExternalDemo();
    }
  });

  document.addEventListener('keydown', (event) => {
    const overlayOpen = videoOverlay.classList.contains('is-open') || externalDemoOpen;
    if (!overlayOpen) {
      if (event.key === 'ArrowRight' || event.key === ' ') skipToFinal(event);
      return;
    }
    if (videoOverlay.classList.contains('is-open') && event.key === 'Escape') {
      event.preventDefault();
      event.stopImmediatePropagation();
      closeVideo();
    }
    if (externalDemoOpen && event.key === 'Escape') window.setTimeout(() => {
      if (!hasSupademoPopup()) closeExternalDemo();
    }, 0);
  }, true);

  nextButton?.addEventListener('click', skipToFinal, true);
  launchButton.addEventListener('click', launchDemo);
  backupButton.addEventListener('click', openVideo);
  replayButton.addEventListener('click', (event) => {
    event.preventDefault();
    play();
  });
  closeButtons.forEach((button) => button.addEventListener('click', closeVideo));
  window.addEventListener('focus', () => {
    if (externalDemoOpen) window.setTimeout(() => {
      if (!hasSupademoPopup()) closeExternalDemo();
    }, 120);
  });

  probeBackupVideo();
})();
