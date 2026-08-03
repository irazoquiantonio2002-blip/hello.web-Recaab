(function () {
  const WA_NUMBER = "524424630207";

  document.body.classList.add("is-loading");

  const loader = document.getElementById("loader");
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mob-menu");
  const marquee = document.getElementById("marquee");
  const year = document.getElementById("year");
  const form = document.getElementById("wa-form");

  function hideLoader() {
    if (!loader) return;

    window.setTimeout(() => {
      loader.classList.add("loader-hidden");
      document.body.classList.remove("is-loading");
    }, 1350);
  }

  function setNavbarState() {
    if (!navbar) return;
    navbar.classList.toggle("scrolled", window.scrollY > 22);
  }

  function setupNavigation() {
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("open");
      hamburger.classList.toggle("active", isOpen);
      hamburger.setAttribute("aria-expanded", String(isOpen));
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        hamburger.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  function setupMarquee() {
    if (!marquee) return;
    const phrases = [
      "HVAC en Querétaro",
      "Venta de minisplit",
      "Mantenimiento preventivo",
      "Refrigeración industrial",
      "Tratamiento de agua",
      "Instalación de CCTV",
      "Chillers y control",
      "Atención siempre abierta"
    ];

    const content = Array.from({ length: 2 }, () =>
      phrases.map((phrase) => `<span>${phrase}</span>`).join("")
    ).join("");

    marquee.innerHTML = content;
  }

  function setupReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px"
    });

    items.forEach((item) => observer.observe(item));
  }

  function setupCounters() {
    const counters = document.querySelectorAll(".stat-num");
    if (!counters.length) return;

    const animateCounter = (counter) => {
      const target = Number(counter.dataset.count || 0);
      const suffix = counter.dataset.suffix || "";
      const duration = 1450;
      const start = performance.now();

      const frame = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        counter.textContent = `${value}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(frame);
        }
      };

      requestAnimationFrame(frame);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.55 });

    counters.forEach((counter) => observer.observe(counter));
  }

  function setupWhatsAppForm() {
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const name = document.getElementById("f-name").value.trim();
      const interest = document.getElementById("f-interest").value;
      const message = document.getElementById("f-msg").value.trim();

      const text = [
        "Hola RECAAV, visité su sitio web y quiero solicitar una cotización.",
        "",
        `Nombre: ${name}`,
        `Servicio de interés: ${interest}`,
        `Detalle: ${message}`
      ].join("\n");

      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    });
  }

  function setupHeroCanvas() {
    const canvas = document.getElementById("hero-canvas");
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 0;
    let height = 0;
    let particles = [];
    let rafId;
    const pointer = { x: 0.72, y: 0.36 };

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = Math.max(38, Math.min(92, Math.floor(width / 18)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        size: Math.random() * 1.8 + 0.7,
        alpha: Math.random() * 0.42 + 0.16
      }));
    }

    function drawLines() {
      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 125) {
            context.strokeStyle = `rgba(127, 207, 255, ${0.12 * (1 - distance / 125)})`;
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(a.x, a.y);
            context.lineTo(b.x, b.y);
            context.stroke();
          }
        }
      }
    }

    function tick() {
      context.clearRect(0, 0, width, height);
      const gravityX = width * pointer.x;
      const gravityY = height * pointer.y;

      particles.forEach((particle) => {
        const dx = gravityX - particle.x;
        const dy = gravityY - particle.y;
        particle.x += particle.vx + dx * 0.00016;
        particle.y += particle.vy + dy * 0.00016;

        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;

        context.fillStyle = `rgba(157, 217, 255, ${particle.alpha})`;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      });

      drawLines();
      rafId = requestAnimationFrame(tick);
    }

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", (event) => {
      pointer.x = event.clientX / Math.max(window.innerWidth, 1);
      pointer.y = event.clientY / Math.max(window.innerHeight, 1);
    }, { passive: true });

    resize();
    tick();

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        tick();
      }
    });
  }

  function setupMagneticTitles() {
    const titles = document.querySelectorAll(".section-title, .why-quote");

    titles.forEach((title) => {
      title.addEventListener("pointermove", (event) => {
        const rect = title.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        title.style.transform = `translate(${x * 8}px, ${y * 6}px)`;
      });

      title.addEventListener("pointerleave", () => {
        title.style.transform = "";
      });
    });
  }

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  window.addEventListener("scroll", setNavbarState, { passive: true });
  window.addEventListener("load", hideLoader);

  setNavbarState();
  setupNavigation();
  setupMarquee();
  setupReveal();
  setupCounters();
  setupWhatsAppForm();
  setupHeroCanvas();
  setupMagneticTitles();
})();
