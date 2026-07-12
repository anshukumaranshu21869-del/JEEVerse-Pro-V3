"use strict";

/* ==========================================
   JEEVerse Pro V3
   App Logic - Part 1
========================================== */

document.addEventListener("DOMContentLoaded", () => {

  initLoader();
  initDashboard();

});

/* -------------------------
   Loader
------------------------- */

function initLoader() {

  const loader = document.getElementById("loader");

  if (!loader) return;

  setTimeout(() => {

    loader.style.opacity = "0";

    setTimeout(() => {

      loader.remove();

    }, 400);

  }, 1800);

}

/* -------------------------
   Dashboard
------------------------- */

function initDashboard() {

  const startBtn =
    document.getElementById("startExamBtn");

  if (!startBtn) return;

  startBtn.addEventListener("click", () => {

    alert(
      "JEEVerse Pro V3 is ready. Exam engine will be connected in Part 2."
    );

  });

}
