(() => {
  "use strict";

  const evidenceSets = {
    before: [
      { src: "assets/evidence_gallery/evidence-before01.png", alt: "Perbualan WhatsApp yang menunjukkan susulan pengesahan dokumen.", caption: "Susulan pengesahan dokumen melalui WhatsApp." },
      { src: "assets/evidence_gallery/evidence-before02.png", alt: "Perbualan WhatsApp yang menunjukkan permintaan tindakan segera.", caption: "Permintaan tindakan segera melalui WhatsApp." },
      { src: "assets/evidence_gallery/evidence-before03.png", alt: "Mesej WhatsApp yang memaparkan senarai nombor rujukan dokumen.", caption: "Senarai nombor rujukan dihantar dalam satu mesej." },
      { src: "assets/evidence_gallery/evidence-before04.png", alt: "Makluman Sistem Putra Finances dalam kumpulan WhatsApp.", caption: "Makluman dokumen Putra Finance dalam kumpulan WhatsApp." }
    ],
    after: [
      { src: "assets/evidence_gallery/evidence-after01.png", alt: "Paparan Dashboard Penyemak melalui desktop.", caption: "Paparan Dashboard Penyemak melalui desktop." },
      { src: "assets/evidence_gallery/evidence-after02.png", alt: "Jejak Audit dokumen.", caption: "Jejak Audit dokumen." },
      { src: "assets/evidence_gallery/evidence-after03.png", alt: "Paparan Chrome Browser Extension melalui peranti mudah alih.", caption: "Paparan Chrome Browser Extension / peranti mudah alih." },
      { src: "assets/evidence_gallery/evidence-after04.png", alt: "Paparan Chrome Browser Extension melalui peranti mudah alih.", caption: "Paparan Chrome Browser Extension / peranti mudah alih." },
      { src: "assets/evidence_gallery/evidence-after05.png", alt: "Paparan Notifikasi melalui peranti mudah alih.", caption: "Paparan Notifikasi melalui peranti mudah alih." }
    ],
    "impact-time": [
      { src: "assets/evidence_gallery/evidence-impacttime-before01.png", alt: "Paparan sebelum LogKerja.", caption: "Sebelum LogKerja." },
      { src: "assets/evidence_gallery/evidence-after01.png", alt: "Paparan selepas LogKerja.", caption: "Selepas LogKerja." }
    ]
  };

  const normalise = (index, items) => (index + items.length) % items.length;

  function createLightbox() {
    const root = document.createElement("div");
    root.className = "evidence-lightbox";
    root.setAttribute("aria-hidden", "true");
    root.inert = true;
    root.innerHTML = `
      <button class="lightbox-backdrop" type="button" data-lightbox-close aria-label="Tutup paparan bukti" tabindex="-1"></button>
      <section class="lightbox-panel" role="dialog" aria-modal="true" aria-label="Paparan besar bukti sistem">
        <button class="lightbox-close" type="button" data-lightbox-close aria-label="Tutup paparan bukti">×</button>
        <button class="lightbox-nav prev" type="button" data-lightbox-prev aria-label="Paparkan bukti sebelumnya"><span aria-hidden="true">‹</span></button>
        <div class="lightbox-stage" data-lightbox-stage><img class="lightbox-image" data-lightbox-image alt=""></div>
        <button class="lightbox-nav next" type="button" data-lightbox-next aria-label="Paparkan bukti seterusnya"><span aria-hidden="true">›</span></button>
        <div class="lightbox-meta"><span class="lightbox-caption" data-lightbox-caption></span><span class="lightbox-counter" data-lightbox-counter></span><button class="lightbox-zoom" type="button" data-lightbox-zoom aria-label="Besarkan imej" aria-pressed="false">⌕</button></div>
      </section>`;
    document.body.append(root);

    const image = root.querySelector("[data-lightbox-image]");
    const stage = root.querySelector("[data-lightbox-stage]");
    const caption = root.querySelector("[data-lightbox-caption]");
    const counter = root.querySelector("[data-lightbox-counter]");
    const zoomButton = root.querySelector("[data-lightbox-zoom]");
    const previous = root.querySelector("[data-lightbox-prev]");
    const next = root.querySelector("[data-lightbox-next]");
    const closeButtons = root.querySelectorAll("[data-lightbox-close]");
    let state = null;
    let zoomed = false;

    function updateZoom(nextZoomed) {
      zoomed = nextZoomed;
      stage.classList.toggle("is-zoomed", zoomed);
      stage.scrollTo({ top: 0, left: 0, behavior: "auto" });
      zoomButton.setAttribute("aria-pressed", String(zoomed));
      zoomButton.setAttribute("aria-label", zoomed ? "Kecilkan imej" : "Besarkan imej");
    }

    function showItem(item, index) {
      if (!state) return;
      state.index = index;
      updateZoom(false);
      image.classList.remove("is-visible");
      image.onload = () => requestAnimationFrame(() => image.classList.add("is-visible"));
      image.onerror = null;
      image.alt = item.alt;
      image.decoding = "async";
      image.src = item.src;
      caption.textContent = item.caption;
      counter.textContent = `${index + 1} / ${state.items.length}`;
    }

    function close({ restoreFocus = true } = {}) {
      if (!state) return;
      const opener = state.opener;
      state = null;
      updateZoom(false);
      root.classList.remove("is-open");
      root.setAttribute("aria-hidden", "true");
      root.inert = true;
      if (restoreFocus) opener?.focus();
    }

    function changeBy(delta) {
      if (!state) return;
      state.onChange(normalise(state.index + delta, state.items));
    }

    function trapFocus(event) {
      const focusable = [...root.querySelectorAll("button:not([disabled])")];
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    root.addEventListener("click", (event) => event.stopPropagation());
    closeButtons.forEach((button) => button.addEventListener("click", () => close()));
    previous.addEventListener("click", () => changeBy(-1));
    next.addEventListener("click", () => changeBy(1));
    zoomButton.addEventListener("click", () => updateZoom(!zoomed));
    image.addEventListener("click", () => updateZoom(!zoomed));
    document.addEventListener("keydown", (event) => {
      if (!state) return;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        close();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        event.stopPropagation();
        changeBy(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        event.stopPropagation();
        changeBy(1);
      } else if (event.key === "Tab") {
        trapFocus(event);
      } else if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        updateZoom(true);
      } else if (event.key === "-" || event.key === "0") {
        event.preventDefault();
        updateZoom(false);
      }
    }, true);

    return {
      open(nextState) {
        state = nextState;
        root.inert = false;
        root.classList.add("is-open");
        root.setAttribute("aria-hidden", "false");
        showItem(state.items[state.index], state.index);
        requestAnimationFrame(() => root.querySelector(".lightbox-close").focus());
      },
      showItem,
      close,
      isOpenFor(gallery) {
        return state?.gallery === gallery;
      }
    };
  }

  const lightbox = createLightbox();

  function initialiseGallery(gallery) {
    const items = evidenceSets[gallery.dataset.evidenceGallery];
    if (!items?.length) return;

    const stage = gallery.querySelector("[data-gallery-stage]");
    const caption = gallery.querySelector("[data-gallery-caption]");
    const counter = gallery.querySelector("[data-gallery-counter]");
    const dots = gallery.querySelector("[data-gallery-dots]");
    const previous = gallery.querySelector("[data-gallery-prev]");
    const next = gallery.querySelector("[data-gallery-next]");
    const open = gallery.querySelector("[data-gallery-open]");
    const slide = gallery.closest(".slide");
    let activeIndex = 0;
    let touchStartX = null;
    let transitionTimer = null;

    function prewarm(index) {
      const neighbour = items[normalise(index, items)];
      const preload = new Image();
      preload.src = neighbour.src;
    }

    function renderDots() {
      dots.replaceChildren();
      items.forEach((item, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "gallery-dot";
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-label", `Papar bukti ${index + 1}: ${item.caption}`);
        dot.setAttribute("aria-selected", String(index === activeIndex));
        dot.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          show(index);
        });
        dots.append(dot);
      });
    }

    function show(index) {
      activeIndex = normalise(index, items);
      const item = items[activeIndex];
      const outgoing = stage.querySelector(".gallery-image:not(.is-leaving)");
      const image = document.createElement("img");
      image.className = "gallery-image";
      image.src = item.src;
      image.alt = item.alt;
      image.loading = activeIndex === 0 ? "eager" : "lazy";
      image.decoding = "async";
      image.addEventListener("load", () => requestAnimationFrame(() => image.classList.add("is-visible")), { once: true });
      image.addEventListener("error", () => { caption.textContent = "Imej bukti tidak dapat dimuatkan."; }, { once: true });
      stage.append(image);
      caption.textContent = item.caption;
      counter.textContent = `${activeIndex + 1} / ${items.length}`;
      if (open) open.setAttribute("aria-label", `Buka ${item.caption} dalam paparan besar`);
      renderDots();
      prewarm(activeIndex + 1);

      if (outgoing) {
        outgoing.classList.add("is-leaving");
        clearTimeout(transitionTimer);
        transitionTimer = setTimeout(() => outgoing.remove(), 380);
      }
      if (lightbox.isOpenFor(gallery)) lightbox.showItem(item, activeIndex);
    }

    function reset() {
      if (activeIndex !== 0 || !stage.querySelector(".gallery-image")) show(0);
    }

    previous.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      show(activeIndex - 1);
    });
    next.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      show(activeIndex + 1);
    });
    open?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      lightbox.open({ gallery, items, index: activeIndex, opener: open, onChange: show });
    });

    gallery.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        event.stopPropagation();
        show(activeIndex - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        event.stopPropagation();
        show(activeIndex + 1);
      }
    }, true);
    gallery.addEventListener("touchstart", (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
    gallery.addEventListener("touchend", (event) => {
      if (touchStartX === null) return;
      const distance = event.changedTouches[0].clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(distance) < 42) return;
      show(distance < 0 ? activeIndex + 1 : activeIndex - 1);
    }, { passive: true });
    document.addEventListener("presentation:slidechange", (event) => {
      if (event.detail.activeSlide === slide) reset();
      else if (lightbox.isOpenFor(gallery)) lightbox.close({ restoreFocus: false });
    });

    show(0);
  }

  document.querySelectorAll("[data-evidence-gallery]").forEach(initialiseGallery);
})();
