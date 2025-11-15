export default (element) => {
  // Inject styles CSS dans la page
  const style = document.createElement("style");
  style.textContent = `
    .scroll-snap-wrapper { scroll-snap-type: y mandatory; }
    .section-0,
    .section-1,
    .section-2,
    .section-3,
    .section-4,
    .section-5 { scroll-snap-align: start; }

    .letter { display: inline-block; }
    .tricksword { white-space: nowrap; }
  `;
  document.head.appendChild(style);

  // Charger Anime.js dynamiquement
  const loadAnime = () => {
    return new Promise((resolve) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/animejs/2.0.2/anime.min.js";
      s.onload = resolve;
      document.body.appendChild(s);
    });
  };

  // Le reste du script
  const init = () => {
    // 1) Split letters pour .tricks
    document.querySelectorAll('.tricks').forEach(node => {
      node.innerHTML = node.innerHTML.replace(
        /(^|<\/?[^>]+>|\s+)([^\s<]+)/g,
        '$1<span class="tricksword">$2</span>'
      );
    });
    document.querySelectorAll('.tricksword').forEach(w => {
      w.innerHTML = w.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
    });

    // 2) Timelines Anime.js (pas d'autoplay)
    const timelines = {
      '.fade-up': anime.timeline({ autoplay: false }).add({
        targets: '.fade-up .letter',
        translateY: [100, 0],
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 1800,
        delay: (el, i) => 300 + 30 * i
      }),
      '.fade-up2': anime.timeline({ autoplay: false }).add({
        targets: '.fade-up2 .letter',
        translateY: [100, 0],
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 1800,
        delay: (el, i) => 300 + 30 * i
      }),
      '.slide-up': anime.timeline({ autoplay: false }).add({
        targets: '.slide-up .letter',
        translateY: ['1.1em', 0],
        opacity: [0, 1],
        duration: 750,
        delay: (el, i) => 50 * i
      }),
      '.slide-in': anime.timeline({ autoplay: false }).add({
        targets: '.slide-in .letter',
        opacity: [0, 1],
        easing: 'easeInOutQuad',
        duration: 2250,
        delay: (el, i) => 150 * (i + 1)
      }),
      '.rotate-in': anime.timeline({ autoplay: false }).add({
        targets: '.rotate-in .letter',
        translateY: ['1.1em', 0],
        translateX: ['0.55em', 0],
        rotateZ: [180, 0],
        opacity: [0, 1],
        duration: 750,
        easing: 'easeOutExpo',
        delay: (el, i) => 50 * i
      }),
      '.pop-in': anime.timeline({ autoplay: false }).add({
        targets: '.pop-in .letter',
        scale: [0, 1],
        opacity: [0, 1],
        duration: 1500,
        elasticity: 600,
        delay: (el, i) => 45 * (i + 1)
      })
    };

    // Helpers
    function playTextTimelineIfMatch(el) {
      for (const sel in timelines) {
        if (el.matches(sel)) {
          timelines[sel].restart();
        }
      }
    }

    function revealTextWrap(section) {
      const tw = section.querySelector('.text-wrap');
      if (!tw) return;
      const computed = getComputedStyle(tw);
      if (computed.opacity === '0' || tw.style.opacity === '0') {
        tw.style.transition = 'opacity 420ms ease, transform 420ms ease';
        tw.style.opacity = '1';
        tw.style.transform = 'none';
        tw.style.willChange = 'auto';
      }
    }

    const rootEl = document.querySelector('.scroll-snap-wrapper') || null;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const sec = entry.target;

        sec.querySelectorAll('.fade-up, .fade-up2, .slide-up, .slide-in, .rotate-in, .pop-in')
          .forEach(playTextTimelineIfMatch);

        revealTextWrap(sec);
      });
    }, {
      root: rootEl,
      threshold: 0.55
    });

    document.querySelectorAll('.section-0, .section-1, .section-2, .section-3, .section-4, .section-5')
      .forEach(sec => io.observe(sec));

    const initiallyVisible = Array.from(document.querySelectorAll('.section-0, .section-1, .section-2, .section-3, .section-4, .section-5'))
      .find(sec => {
        const r = sec.getBoundingClientRect();
        const vh = (rootEl ? rootEl.clientHeight : window.innerHeight);
        const visible = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
        return visible >= (r.height * 0.55);
      });

    if (initiallyVisible) {
      initiallyVisible.querySelectorAll('.fade-up, .fade-up2, .slide-up, .slide-in, .rotate-in, .pop-in')
        .forEach(playTextTimelineIfMatch);
      revealTextWrap(initiallyVisible);
    }
  };

  // Charger Anime.js PUIS exécuter l'animation
  loadAnime().then(init);
};
