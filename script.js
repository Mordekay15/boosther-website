(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Header: solid background once the page scrolls */
  var header = document.querySelector("[data-header]");
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Mobile navigation */
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");
  function setNav(open) {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }
  toggle.addEventListener("click", function () {
    setNav(toggle.getAttribute("aria-expanded") !== "true");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setNav(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setNav(false);
      toggle.focus();
    }
  });

  /* Twinkling star sparkles (brand element: stars) */
  var sparkleColors = ["#FFFFFF", "#FFFFFF", "#F6D98B", "#FFDBDC"];
  document.querySelectorAll("[data-sparkles]").forEach(function (layer) {
    var count = layer.classList.contains("sparkles--light") ? 22 : 30;
    for (var i = 0; i < count; i++) {
      var s = document.createElement("span");
      s.className = "sparkle";
      var size = 4 + Math.random() * 12;
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      s.style.setProperty("--s", size.toFixed(1) + "px");
      s.style.setProperty("--c", sparkleColors[i % sparkleColors.length]);
      s.style.setProperty("--d", (3 + Math.random() * 4).toFixed(2) + "s");
      s.style.setProperty("--delay", (-Math.random() * 6).toFixed(2) + "s");
      s.style.setProperty("--o", (0.5 + Math.random() * 0.5).toFixed(2));
      layer.appendChild(s);
    }
  });

  /* Reveal-on-scroll, staggered within each parent */
  var reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var siblings = new Map();
    reveals.forEach(function (el) {
      var parent = el.parentElement;
      var idx = siblings.get(parent) || 0;
      el.style.setProperty("--delay", Math.min(idx * 0.09, 0.45) + "s");
      siblings.set(parent, idx + 1);
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* Gentle parallax on the hero cards */
  var visual = document.querySelector(".hero-visual");
  if (visual && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    var cards = visual.querySelectorAll(".float-card");
    document.querySelector(".hero").addEventListener("mousemove", function (e) {
      var x = e.clientX / window.innerWidth - 0.5;
      var y = e.clientY / window.innerHeight - 0.5;
      cards.forEach(function (card, i) {
        var depth = (i + 1) * 8;
        card.style.translate = (x * depth).toFixed(1) + "px " + (y * depth).toFixed(1) + "px";
      });
    });
  }

  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
