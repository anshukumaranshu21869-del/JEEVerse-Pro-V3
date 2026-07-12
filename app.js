"use strict";

/* ==========================================
   JEEVerse Pro V3
   App.js — Part 1
   Dashboard + Test Selection + Instructions
========================================== */

document.addEventListener("DOMContentLoaded", initialiseApp);

/* ==========================================
   ELEMENT REFERENCES
========================================== */

const loadingScreen =
  document.getElementById("loadingScreen");

const dashboardScreen =
  document.getElementById("dashboardScreen");

const instructionScreen =
  document.getElementById("instructionScreen");

const examScreen =
  document.getElementById("examScreen");

const selectedTestTitle =
  document.getElementById("selectedTestTitle");

const examTitle =
  document.getElementById("examTitle");

const continueTestBtn =
  document.getElementById("continueTestBtn");

const backToDashboardBtn =
  document.getElementById("backToDashboardBtn");

const agreementCheckbox =
  document.getElementById("agreementCheckbox");

const beginExamBtn =
  document.getElementById("beginExamBtn");

const exitExamBtn =
  document.getElementById("exitExamBtn");

const themeBtn =
  document.getElementById("themeBtn");

const toast =
  document.getElementById("toast");

const toastMessage =
  document.getElementById("toastMessage");

/* ==========================================
   APP STATE
========================================== */

let selectedTestId = "mock-01";
let selectedTest = null;
let toastTimer = null;

/* ==========================================
   INITIALISE APP
========================================== */

function initialiseApp() {
  connectEvents();
  restoreTheme();

  window.setTimeout(() => {
    loadingScreen?.classList.add("hidden");
    dashboardScreen?.classList.remove("hidden");
  }, 1400);
}

/* ==========================================
   EVENT CONNECTIONS
========================================== */

function connectEvents() {
  continueTestBtn?.addEventListener("click", () => {
    openInstructionScreen("mock-01");
  });

  document
    .querySelectorAll(".start-test-btn:not(.disabled)")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const testId = button.dataset.testId;

        if (testId) {
          openInstructionScreen(testId);
        }
      });
    });

  backToDashboardBtn?.addEventListener(
    "click",
    showDashboard
  );

  agreementCheckbox?.addEventListener(
    "change",
    updateBeginButton
  );

  beginExamBtn?.addEventListener(
    "click",
    beginExamination
  );

  exitExamBtn?.addEventListener(
    "click",
    showDashboard
  );

  themeBtn?.addEventListener(
    "click",
    toggleTheme
  );

  initialiseFilters();
}

/* ==========================================
   TEST SELECTION
========================================== */

function openInstructionScreen(testId) {
  const tests = window.JEEVERSE_TESTS || [];

  selectedTest =
    tests.find((test) => test.id === testId) ||
    tests[0] ||
    null;

  selectedTestId = testId;

  if (selectedTestTitle) {
    selectedTestTitle.textContent =
      selectedTest?.title ||
      "JEE Main Full Mock Test 1";
  }

  agreementCheckbox.checked = false;
  updateBeginButton();

  dashboardScreen?.classList.add("hidden");
  examScreen?.classList.add("hidden");
  instructionScreen?.classList.remove("hidden");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

/* ==========================================
   BEGIN EXAM
========================================== */

function updateBeginButton() {
  if (!beginExamBtn || !agreementCheckbox) {
    return;
  }

  beginExamBtn.disabled =
    !agreementCheckbox.checked;
}

function beginExamination() {
  if (!agreementCheckbox?.checked) {
    showToast(
      "Please accept the instructions first."
    );
    return;
  }

  instructionScreen?.classList.add("hidden");
  dashboardScreen?.classList.add("hidden");
  examScreen?.classList.remove("hidden");

  if (examTitle) {
    examTitle.textContent =
      selectedTest?.title ||
      "JEE Main Full Mock Test 1";
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  showToast("Examination started.");
}

/* ==========================================
   DASHBOARD
========================================== */

function showDashboard() {
  instructionScreen?.classList.add("hidden");
  examScreen?.classList.add("hidden");
  dashboardScreen?.classList.remove("hidden");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

/* ==========================================
   TEST FILTERS
========================================== */

function initialiseFilters() {
  const filterButtons =
    document.querySelectorAll(".filter-btn");

  const testCards =
    document.querySelectorAll(".test-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter =
        button.dataset.filter || "all";

      filterButtons.forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      testCards.forEach((card) => {
        const category =
          card.dataset.category;

        const shouldShow =
          filter === "all" ||
          category === filter;

        card.classList.toggle(
          "hidden",
          !shouldShow
        );
      });
    });
  });
}

/* ==========================================
   THEME
========================================== */

function toggleTheme() {
  const darkMode =
    document.body.classList.toggle(
      "dark-theme"
    );

  localStorage.setItem(
    "jeeverse-theme",
    darkMode ? "dark" : "light"
  );

  if (themeBtn) {
    themeBtn.textContent =
      darkMode ? "☀" : "☾";
  }
}

function restoreTheme() {
  const savedTheme =
    localStorage.getItem(
      "jeeverse-theme"
    );

  const darkMode =
    savedTheme === "dark";

  document.body.classList.toggle(
    "dark-theme",
    darkMode
  );

  if (themeBtn) {
    themeBtn.textContent =
      darkMode ? "☀" : "☾";
  }
}

/* ==========================================
   TOAST
========================================== */

function showToast(message) {
  if (!toast || !toastMessage) {
    return;
  }

  window.clearTimeout(toastTimer);

  toastMessage.textContent = message;
  toast.classList.add("show");

  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}
