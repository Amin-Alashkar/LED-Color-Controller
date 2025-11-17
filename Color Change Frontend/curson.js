// curson.js 

window.addEventListener("load", () => {
  if (window.cursoreffects && window.cursoreffects.bubbleCursor) {
    try {
      new cursoreffects.bubbleCursor({
        fillColor: "transparent",
        strokeColor: "transparent",
      });
    } catch (e) {
      console.warn("cursor-effects lib: ", e);
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.getElementById("customCursor");
  if (!cursor) return;


  function randomNeonColor() {
    const h = Math.floor(Math.random() * 360);
    return `hsl(${h} 95% 55%)`;
  }

  function applyNeonTheme(color) {
    cursor.classList.remove("theme-black");
    if (color) {
      cursor.style.setProperty("--cursor-color", color);
      cursor.style.setProperty("--cursor-hover-color", color);
    } else {

      const initial = randomNeonColor();
      cursor.style.setProperty("--cursor-color", initial);
      cursor.style.setProperty("--cursor-hover-color", initial);
    }

    startIdleCycle();
  }

  function applyBlackTheme() {
    cursor.classList.add("theme-black");
    cursor.style.setProperty("--cursor-hover-color", "#ffffff");
    // stop neon idle
    stopIdleCycle();
  }


  window.setCursorTheme = function(themeName) {
    if (themeName === "black") applyBlackTheme();
    else applyNeonTheme(themeName && themeName.startsWith("#") ? themeName : null);
  };


  let idleInterval = null;
  function startIdleCycle() {
    // avoid multiple intervals
    stopIdleCycle();
    idleInterval = setInterval(() => {

      if (!cursor.classList.contains("theme-black")) {
        const c = randomNeonColor();
        cursor.style.setProperty("--cursor-color", c);
 
      }
    }, 2500);
  }
  function stopIdleCycle() {
    if (idleInterval) {
      clearInterval(idleInterval);
      idleInterval = null;
    }
  }


  applyNeonTheme();


  document.addEventListener("mousemove", e => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });

  const clickableElements = ["a", "button", ".custom-animation-btn", ".about-btn", ".color-display", ".color-ring", ".brightness-apply-btn", "input[type='range']"];

  document.addEventListener("mouseover", e => {
    if (clickableElements.some(sel => e.target.closest(sel))) {

      const colorDisplay = document.getElementById("colorDisplay");
      let siteColor = null;
      if (colorDisplay) {
        const bg = window.getComputedStyle(colorDisplay).backgroundColor;
        if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
          siteColor = bg;
        }
      }

      if (!cursor.classList.contains("theme-black")) {
        const hoverColor = siteColor || randomNeonColor();
        cursor.style.setProperty("--cursor-hover-color", hoverColor);
      }
      cursor.classList.add("cursor-hover");
    } else {
      cursor.classList.remove("cursor-hover");
    }
  });


  document.addEventListener("mousedown", () => {
    cursor.classList.add("cursor-active");
    cursor.classList.remove("anim-idle");
  });
  document.addEventListener("mouseup", () => {
    setTimeout(() => cursor.classList.remove("cursor-active"), 80);
    cursor.classList.add("anim-idle");
  });


  const colorInput = document.getElementById("colorPicker");
  if (colorInput) {
    colorInput.addEventListener("input", (e) => {
      const v = (e.target.value || "").toLowerCase();

      if (v === "#000000" || v === "#000") {
        applyBlackTheme();
      } else {

        applyNeonTheme(v);
      }
    });
  }


  if (typeof window.changeColor === "function") {
    const originalChange = window.changeColor;
    window.changeColor = function(color) {
      try {

        const c = (color || "").toString().toLowerCase();
        if (c === "#000000" || c === "#000" || c === "black") {
          applyBlackTheme();
        } else {
          applyNeonTheme(color);
        }
      } catch (err) { /* ignore */ }
      return originalChange.apply(this, arguments);
    };
  }


  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    stopIdleCycle();
    cursor.classList.remove("anim-idle");
  }

  
  if (!window.matchMedia || !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    startIdleCycle();
    cursor.classList.add("anim-idle");
  }
});
