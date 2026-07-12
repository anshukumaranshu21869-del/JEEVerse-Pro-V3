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
/* ==========================================
   APP.JS — PART 2A
   BASIC CBT QUESTION ENGINE
========================================== */

let examQuestions = [];
let currentQuestionIndex = 0;
let examResponses = [];
let examStatuses = [];
let examTimeRemaining = 0;
let examTimerInterval = null;
let examSubmitted = false;

/* ==========================================
   BEGIN REAL EXAMINATION
========================================== */

function beginExamination() {
  if (!agreementCheckbox?.checked) {
    showToast("Please accept the instructions first.");
    return;
  }

  if (!selectedTest) {
    const tests = window.JEEVERSE_TESTS || [];
    selectedTest =
      tests.find((test) => test.id === selectedTestId) ||
      tests[0] ||
      null;
  }

  if (!selectedTest || !selectedTest.questions?.length) {
    showToast("Questions are not available.");
    return;
  }

  examQuestions = selectedTest.questions;
  currentQuestionIndex = 0;

  examResponses =
    Array(examQuestions.length).fill(null);

  examStatuses =
    Array(examQuestions.length).fill("not-visited");

  examTimeRemaining =
    Number(selectedTest.durationMinutes || 180) * 60;

  examSubmitted = false;

  instructionScreen?.classList.add("hidden");
  dashboardScreen?.classList.add("hidden");
  examScreen?.classList.remove("hidden");

  if (examTitle) {
    examTitle.textContent = selectedTest.title;
  }

  buildExamInterface();
  renderCurrentQuestion();
  startExamTimer();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  showToast("Examination started. All the best!");
}

/* ==========================================
   BUILD CBT INTERFACE
========================================== */

function buildExamInterface() {
  const oldPlaceholder =
    examScreen?.querySelector(".exam-placeholder");

  if (!oldPlaceholder) {
    return;
  }

  oldPlaceholder.innerHTML = `
    <div class="cbt-layout">

      <section class="cbt-main-panel">

        <div class="subject-tabs" id="subjectTabs">
          <button
            class="subject-tab active"
            data-subject="Physics"
            type="button"
          >
            Physics
          </button>

          <button
            class="subject-tab"
            data-subject="Chemistry"
            type="button"
          >
            Chemistry
          </button>

          <button
            class="subject-tab"
            data-subject="Mathematics"
            type="button"
          >
            Mathematics
          </button>
        </div>

        <article class="cbt-question-card">

          <div class="question-meta-row">

            <div>
              <span id="questionNumberLabel">
                Question 1
              </span>

              <strong id="questionSubjectLabel">
                Physics
              </strong>
            </div>

            <div class="question-badges">
              <span id="questionTypeLabel">
                MCQ
              </span>

              <span id="questionDifficultyLabel">
                Easy
              </span>
            </div>

          </div>

          <div class="chapter-row">
            Chapter:
            <strong id="questionChapterLabel">
              Loading
            </strong>
          </div>

          <h2
            id="questionTextLabel"
            class="question-text"
          >
            Loading question...
          </h2>

          <div
            id="optionContainer"
            class="option-container"
          ></div>

          <div
            id="numericalContainer"
            class="numerical-container hidden"
          >
            <label for="numericalAnswerInput">
              Enter numerical answer
            </label>

            <input
              id="numericalAnswerInput"
              type="number"
              inputmode="decimal"
              placeholder="Enter answer"
            >
          </div>

        </article>

        <footer class="question-action-bar">

          <div class="left-actions">

            <button
              id="previousQuestionBtn"
              class="secondary-btn"
              type="button"
            >
              ← Previous
            </button>

            <button
              id="clearResponseBtn"
              class="secondary-btn"
              type="button"
            >
              Clear Response
            </button>

          </div>

          <div class="right-actions">

            <button
              id="markReviewBtn"
              class="secondary-btn"
              type="button"
            >
              Mark for Review
            </button>

            <button
              id="saveNextBtn"
              class="primary-btn"
              type="button"
            >
              Save & Next →
            </button>

          </div>

        </footer>

      </section>

      <aside class="cbt-sidebar">

        <div class="candidate-box">
          <div class="student-avatar">A</div>

          <div>
            <strong>JEE Aspirant</strong>
            <span>Mock Test Candidate</span>
          </div>
        </div>

        <div class="palette-heading">
          <span>Question Palette</span>
          <strong id="paletteSubjectLabel">
            Physics
          </strong>
        </div>

        <div
          id="questionPalette"
          class="question-palette"
        ></div>

        <div class="palette-legend">

          <div>
            <span class="legend-box not-visited"></span>
            Not Visited
          </div>

          <div>
            <span class="legend-box not-answered"></span>
            Not Answered
          </div>

          <div>
            <span class="legend-box answered"></span>
            Answered
          </div>

          <div>
            <span class="legend-box reviewed"></span>
            Review
          </div>

        </div>

        <button
          id="finalSubmitBtn"
          class="primary-btn full-width"
          type="button"
        >
          Submit Test
        </button>

      </aside>

    </div>
  `;

  connectExamEvents();
}

/* ==========================================
   CONNECT EXAM EVENTS
========================================== */

function connectExamEvents() {
  document
    .querySelectorAll(".subject-tab")
    .forEach((button) => {
      button.addEventListener("click", () => {
        changeExamSubject(button.dataset.subject);
      });
    });

  document
    .getElementById("previousQuestionBtn")
    ?.addEventListener(
      "click",
      goToPreviousQuestion
    );

  document
    .getElementById("clearResponseBtn")
    ?.addEventListener(
      "click",
      clearCurrentResponse
    );

  document
    .getElementById("markReviewBtn")
    ?.addEventListener(
      "click",
      markCurrentForReview
    );

  document
    .getElementById("saveNextBtn")
    ?.addEventListener(
      "click",
      saveAndGoNext
    );

  document
    .getElementById("numericalAnswerInput")
    ?.addEventListener(
      "input",
      saveNumericalAnswer
    );

  document
    .getElementById("finalSubmitBtn")
    ?.addEventListener(
      "click",
      confirmFinalSubmission
    );
}

/* ==========================================
   RENDER CURRENT QUESTION
========================================== */

function renderCurrentQuestion() {
  const question =
    examQuestions[currentQuestionIndex];

  if (!question) {
    showToast("Question could not be loaded.");
    return;
  }

  if (
    examStatuses[currentQuestionIndex] ===
    "not-visited"
  ) {
    examStatuses[currentQuestionIndex] =
      "not-answered";
  }

  setText(
    "questionNumberLabel",
    `Question ${getSubjectPosition(question)}`
  );

  setText(
    "questionSubjectLabel",
    question.subject
  );

  setText(
    "questionTypeLabel",
    question.type === "numerical"
      ? "Numerical"
      : "MCQ"
  );

  setText(
    "questionDifficultyLabel",
    question.difficulty
  );

  setText(
    "questionChapterLabel",
    question.chapter
  );

  setText(
    "questionTextLabel",
    question.question
  );

  renderQuestionAnswerArea(question);
  updateActiveSubjectTab(question.subject);
  renderQuestionPalette();
  updatePreviousButton();
}

/* ==========================================
   ANSWER AREA
========================================== */

function renderQuestionAnswerArea(question) {
  const optionContainer =
    document.getElementById("optionContainer");

  const numericalContainer =
    document.getElementById("numericalContainer");

  const numericalInput =
    document.getElementById("numericalAnswerInput");

  if (!optionContainer) {
    return;
  }

  optionContainer.innerHTML = "";

  if (question.type === "numerical") {
    optionContainer.classList.add("hidden");
    numericalContainer?.classList.remove("hidden");

    if (numericalInput) {
      numericalInput.value =
        examResponses[currentQuestionIndex] ?? "";
    }

    return;
  }

  optionContainer.classList.remove("hidden");
  numericalContainer?.classList.add("hidden");

  question.options.forEach(
    (option, optionIndex) => {
      const button =
        document.createElement("button");

      button.type = "button";
      button.className = "option-button";

      if (
        examResponses[currentQuestionIndex] ===
        optionIndex
      ) {
        button.classList.add("selected");
      }

      const optionLetter =
        String.fromCharCode(65 + optionIndex);

      button.innerHTML = `
        <span class="option-letter">
          ${optionLetter}
        </span>

        <span class="option-value"></span>
      `;

      button.querySelector(
        ".option-value"
      ).textContent = option;

      button.addEventListener("click", () => {
        selectMCQAnswer(optionIndex);
      });

      optionContainer.appendChild(button);
    }
  );
}

/* ==========================================
   SELECT ANSWERS
========================================== */

function selectMCQAnswer(optionIndex) {
  examResponses[currentQuestionIndex] =
    optionIndex;

  examStatuses[currentQuestionIndex] =
    "answered";

  renderQuestionAnswerArea(
    examQuestions[currentQuestionIndex]
  );

  renderQuestionPalette();
}

function saveNumericalAnswer(event) {
  const value = event.target.value.trim();

  examResponses[currentQuestionIndex] =
    value === "" ? null : value;

  examStatuses[currentQuestionIndex] =
    value === ""
      ? "not-answered"
      : "answered";

  renderQuestionPalette();
}

/* ==========================================
   SMALL HELPERS
========================================== */

function setText(elementId, value) {
  const element =
    document.getElementById(elementId);

  if (element) {
    element.textContent = value;
  }
}

function getSubjectQuestionIndexes(subject) {
  return examQuestions
    .map((question, index) => ({
      question,
      index
    }))
    .filter(
      (item) =>
        item.question.subject === subject
    )
    .map((item) => item.index);
}

function getSubjectPosition(question) {
  const indexes =
    getSubjectQuestionIndexes(question.subject);

  return (
    indexes.indexOf(currentQuestionIndex) + 1
  );
}

function updateActiveSubjectTab(subject) {
  document
    .querySelectorAll(".subject-tab")
    .forEach((button) => {
      button.classList.toggle(
        "active",
        button.dataset.subject === subject
      );
    });

  setText(
    "paletteSubjectLabel",
    subject
  );
}
/* ==========================================
   APP.JS — PART 2B
   NAVIGATION + PALETTE + TIMER
========================================== */

/* ==========================================
   SUBJECT SWITCHING
========================================== */

function changeExamSubject(subject) {
  const subjectIndexes =
    getSubjectQuestionIndexes(subject);

  if (!subjectIndexes.length) {
    showToast(`${subject} questions are unavailable.`);
    return;
  }

  const firstNotVisited =
    subjectIndexes.find(
      (index) =>
        examStatuses[index] === "not-visited"
    );

  currentQuestionIndex =
    firstNotVisited ?? subjectIndexes[0];

  renderCurrentQuestion();
}

/* ==========================================
   PREVIOUS QUESTION
========================================== */

function goToPreviousQuestion() {
  if (currentQuestionIndex <= 0) {
    showToast("This is the first question.");
    return;
  }

  currentQuestionIndex -= 1;
  renderCurrentQuestion();
}

/* ==========================================
   SAVE AND NEXT
========================================== */

function saveAndGoNext() {
  const response =
    examResponses[currentQuestionIndex];

  examStatuses[currentQuestionIndex] =
    response === null ||
    response === ""
      ? "not-answered"
      : "answered";

  moveToNextQuestion();
}

/* ==========================================
   MARK FOR REVIEW
========================================== */

function markCurrentForReview() {
  const response =
    examResponses[currentQuestionIndex];

  examStatuses[currentQuestionIndex] =
    response === null ||
    response === ""
      ? "reviewed"
      : "answered-reviewed";

  renderQuestionPalette();
  moveToNextQuestion();
}

/* ==========================================
   CLEAR RESPONSE
========================================== */

function clearCurrentResponse() {
  examResponses[currentQuestionIndex] =
    null;

  examStatuses[currentQuestionIndex] =
    "not-answered";

  const numericalInput =
    document.getElementById(
      "numericalAnswerInput"
    );

  if (numericalInput) {
    numericalInput.value = "";
  }

  renderQuestionAnswerArea(
    examQuestions[currentQuestionIndex]
  );

  renderQuestionPalette();

  showToast("Response cleared.");
}

/* ==========================================
   MOVE TO NEXT QUESTION
========================================== */

function moveToNextQuestion() {
  if (
    currentQuestionIndex <
    examQuestions.length - 1
  ) {
    currentQuestionIndex += 1;
    renderCurrentQuestion();
    return;
  }

  showToast(
    "You have reached the final question."
  );
}

/* ==========================================
   GO TO PALETTE QUESTION
========================================== */

function goToPaletteQuestion(index) {
  if (
    index < 0 ||
    index >= examQuestions.length
  ) {
    return;
  }

  currentQuestionIndex = index;
  renderCurrentQuestion();
}

/* ==========================================
   QUESTION PALETTE
========================================== */

function renderQuestionPalette() {
  const palette =
    document.getElementById(
      "questionPalette"
    );

  if (!palette) {
    return;
  }

  palette.innerHTML = "";

  const currentQuestion =
    examQuestions[currentQuestionIndex];

  if (!currentQuestion) {
    return;
  }

  const subjectIndexes =
    getSubjectQuestionIndexes(
      currentQuestion.subject
    );

  subjectIndexes.forEach(
    (questionIndex, position) => {
      const button =
        document.createElement("button");

      button.type = "button";
      button.className =
        "palette-button";

      button.textContent =
        String(position + 1);

      button.classList.add(
        getPaletteClass(
          examStatuses[questionIndex]
        )
      );

      if (
        questionIndex ===
        currentQuestionIndex
      ) {
        button.classList.add("current");
      }

      button.addEventListener(
        "click",
        () => {
          goToPaletteQuestion(
            questionIndex
          );
        }
      );

      palette.appendChild(button);
    }
  );
}

function getPaletteClass(status) {
  const statusClasses = {
    "not-visited": "not-visited",
    "not-answered": "not-answered",
    answered: "answered",
    reviewed: "reviewed",
    "answered-reviewed":
      "answered-reviewed"
  };

  return (
    statusClasses[status] ||
    "not-visited"
  );
}

/* ==========================================
   PREVIOUS BUTTON STATE
========================================== */

function updatePreviousButton() {
  const previousButton =
    document.getElementById(
      "previousQuestionBtn"
    );

  if (previousButton) {
    previousButton.disabled =
      currentQuestionIndex === 0;
  }
}

/* ==========================================
   EXAM TIMER
========================================== */

function startExamTimer() {
  window.clearInterval(
    examTimerInterval
  );

  updateExamTimerDisplay();

  examTimerInterval =
    window.setInterval(() => {
      examTimeRemaining -= 1;

      updateExamTimerDisplay();

      if (examTimeRemaining <= 0) {
        window.clearInterval(
          examTimerInterval
        );

        submitExamAutomatically();
      }
    }, 1000);
}

function updateExamTimerDisplay() {
  const timerElement =
    document.getElementById(
      "examTimer"
    );

  if (!timerElement) {
    return;
  }

  timerElement.textContent =
    formatExamTime(
      examTimeRemaining
    );

  timerElement.classList.toggle(
    "urgent",
    examTimeRemaining <= 300
  );
}

function formatExamTime(totalSeconds) {
  const safeSeconds =
    Math.max(0, totalSeconds);

  const hours =
    Math.floor(
      safeSeconds / 3600
    );

  const minutes =
    Math.floor(
      (safeSeconds % 3600) / 60
    );

  const seconds =
    safeSeconds % 60;

  return [
    hours,
    minutes,
    seconds
  ]
    .map((value) =>
      String(value).padStart(
        2,
        "0"
      )
    )
    .join(":");
}

/* ==========================================
   AUTO SUBMISSION
========================================== */

function submitExamAutomatically() {
  if (examSubmitted) {
    return;
  }

  showToast(
    "Time is over. Test submitted automatically."
  );

  completeExamSubmission(true);
}
/* ==========================================
   APP.JS — PART 2C
   SUBMISSION + SCORE + RESULT SCREEN
========================================== */

/* ==========================================
   MANUAL SUBMISSION
========================================== */

function confirmFinalSubmission() {
  if (examSubmitted) {
    return;
  }

  const attempted =
    examResponses.filter(
      (response) =>
        response !== null &&
        response !== ""
    ).length;

  const unattempted =
    examQuestions.length - attempted;

  const confirmed = window.confirm(
    `Submit this test?\n\nAttempted: ${attempted}\nUnattempted: ${unattempted}`
  );

  if (!confirmed) {
    return;
  }

  completeExamSubmission(false);
}

/* ==========================================
   COMPLETE EXAM SUBMISSION
========================================== */

function completeExamSubmission(
  automaticSubmission = false
) {
  if (examSubmitted) {
    return;
  }

  examSubmitted = true;

  window.clearInterval(
    examTimerInterval
  );

  const result =
    calculateExamResult();

  renderResultScreen(
    result,
    automaticSubmission
  );

  saveResultToBrowser(result);
}

/* ==========================================
   RESULT CALCULATION
========================================== */

function calculateExamResult() {
  let correct = 0;
  let incorrect = 0;
  let attempted = 0;
  let score = 0;

  const subjectResults = {
    Physics: createSubjectResult(),
    Chemistry: createSubjectResult(),
    Mathematics: createSubjectResult()
  };

  examQuestions.forEach(
    (question, index) => {
      const response =
        examResponses[index];

      const subjectResult =
        subjectResults[
          question.subject
        ];

      subjectResult.total += 1;

      const wasAttempted =
        response !== null &&
        response !== "";

      if (!wasAttempted) {
        return;
      }

      attempted += 1;
      subjectResult.attempted += 1;

      const isCorrect =
        isAnswerCorrect(
          question,
          response
        );

      if (isCorrect) {
        correct += 1;
        score += 4;

        subjectResult.correct += 1;
        subjectResult.score += 4;
      } else {
        incorrect += 1;
        subjectResult.incorrect += 1;

        if (question.type !== "numerical") {
          score -= 1;
          subjectResult.score -= 1;
        }
      }
    }
  );

  const unattempted =
    examQuestions.length - attempted;

  const maximumMarks =
    examQuestions.length * 4;

  const accuracy =
    attempted > 0
      ? Math.round(
          (correct / attempted) * 100
        )
      : 0;

  const scorePercentage =
    maximumMarks > 0
      ? Math.max(
          0,
          Math.round(
            (score / maximumMarks) *
              100
          )
        )
      : 0;

  return {
    correct,
    incorrect,
    attempted,
    unattempted,
    score,
    maximumMarks,
    accuracy,
    scorePercentage,
    subjectResults
  };
}

function createSubjectResult() {
  return {
    total: 0,
    attempted: 0,
    correct: 0,
    incorrect: 0,
    score: 0
  };
}

/* ==========================================
   ANSWER CHECKING
========================================== */

function isAnswerCorrect(
  question,
  response
) {
  if (question.type === "numerical") {
    const userAnswer =
      Number(response);

    const correctAnswer =
      Number(question.answer);

    return (
      Number.isFinite(userAnswer) &&
      Number.isFinite(correctAnswer) &&
      Math.abs(
        userAnswer -
          correctAnswer
      ) < 0.0001
    );
  }

  return (
    Number(response) ===
    Number(question.answer)
  );
}

/* ==========================================
   RESULT SCREEN
========================================== */

function renderResultScreen(
  result,
  automaticSubmission
) {
  const examPlaceholder =
    examScreen?.querySelector(
      ".exam-placeholder"
    );

  if (!examPlaceholder) {
    return;
  }

  examPlaceholder.innerHTML = `
    <section class="result-wrapper">

      <div class="result-header-card">

        <span class="result-badge">
          Test Completed
        </span>

        <h1>
          ${selectedTest?.title || "JEE Main Mock Test"}
        </h1>

        <p>
          ${
            automaticSubmission
              ? "Time ended and your test was submitted automatically."
              : "Your test was submitted successfully."
          }
        </p>

        <div class="result-score-circle">
          <strong>
            ${result.score}
          </strong>

          <span>
            / ${result.maximumMarks}
          </span>
        </div>

      </div>

      <div class="result-stat-grid">

        <article class="result-stat-card">
          <strong>
            ${result.correct}
          </strong>
          <span>Correct</span>
        </article>

        <article class="result-stat-card">
          <strong>
            ${result.incorrect}
          </strong>
          <span>Incorrect</span>
        </article>

        <article class="result-stat-card">
          <strong>
            ${result.unattempted}
          </strong>
          <span>Unattempted</span>
        </article>

        <article class="result-stat-card">
          <strong>
            ${result.accuracy}%
          </strong>
          <span>Accuracy</span>
        </article>

      </div>

      <section class="result-analysis-card">

        <h2>Subject-wise Analysis</h2>

        ${createSubjectResultHTML(
          result.subjectResults
        )}

      </section>

      <section class="result-message-card">

        <h2>Performance Recommendation</h2>

        <p>
          ${getResultRecommendation(
            result.scorePercentage
          )}
        </p>

      </section>

      <div class="result-action-row">

        <button
          id="reviewAttemptBtn"
          class="secondary-btn"
          type="button"
        >
          Review Answers
        </button>

        <button
          id="retakeExamBtn"
          class="primary-btn"
          type="button"
        >
          Retake Test
        </button>

        <button
          id="resultDashboardBtn"
          class="secondary-btn"
          type="button"
        >
          Back to Dashboard
        </button>

      </div>

    </section>
  `;

  connectResultEvents();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  showToast(
    "Result generated successfully."
  );
}

/* ==========================================
   SUBJECT RESULT HTML
========================================== */

function createSubjectResultHTML(
  subjectResults
) {
  return Object.entries(
    subjectResults
  )
    .map(([subject, data]) => {
      const accuracy =
        data.attempted > 0
          ? Math.round(
              (data.correct /
                data.attempted) *
                100
            )
          : 0;

      return `
        <div class="subject-result-row">

          <div class="subject-result-top">
            <strong>${subject}</strong>

            <span>
              ${data.score} Marks
            </span>
          </div>

          <div class="result-progress-track">
            <span
              style="width: ${accuracy}%"
            ></span>
          </div>

          <div class="subject-result-bottom">
            <span>
              Attempted:
              ${data.attempted}/${data.total}
            </span>

            <span>
              Correct:
              ${data.correct}
            </span>

            <span>
              Accuracy:
              ${accuracy}%
            </span>
          </div>

        </div>
      `;
    })
    .join("");
}

/* ==========================================
   RECOMMENDATION
========================================== */

function getResultRecommendation(
  percentage
) {
  if (percentage >= 80) {
    return "Excellent attempt. Continue full-length mock practice and carefully revise every incorrect question.";
  }

  if (percentage >= 60) {
    return "Good performance. Improve weak chapters, reduce negative marking and practise medium-level questions.";
  }

  if (percentage >= 40) {
    return "Your preparation is progressing. Revise formulas, strengthen concepts and practise chapter-wise tests.";
  }

  return "Focus on basic concepts first. Complete NCERT-level preparation and practise easier questions before full mock tests.";
}

/* ==========================================
   RESULT BUTTON EVENTS
========================================== */

function connectResultEvents() {
  document
    .getElementById(
      "reviewAttemptBtn"
    )
    ?.addEventListener(
      "click",
      reviewSubmittedAttempt
    );

  document
    .getElementById(
      "retakeExamBtn"
    )
    ?.addEventListener(
      "click",
      retakeCurrentExam
    );

  document
    .getElementById(
      "resultDashboardBtn"
    )
    ?.addEventListener(
      "click",
      showDashboard
    );
}

/* ==========================================
   REVIEW ATTEMPT
========================================== */

function reviewSubmittedAttempt() {
  currentQuestionIndex = 0;

  buildExamInterface();
  renderCurrentQuestion();

  showToast(
    "Review mode opened."
  );
}

/* ==========================================
   RETAKE TEST
========================================== */

function retakeCurrentExam() {
  window.clearInterval(
    examTimerInterval
  );

  examSubmitted = false;
  currentQuestionIndex = 0;

  examResponses =
    Array(examQuestions.length)
      .fill(null);

  examStatuses =
    Array(examQuestions.length)
      .fill("not-visited");

  examTimeRemaining =
    Number(
      selectedTest?.durationMinutes ||
      180
    ) * 60;

  buildExamInterface();
  renderCurrentQuestion();
  startExamTimer();

  showToast(
    "Test restarted successfully."
  );
}

/* ==========================================
   SAVE RESULT LOCALLY
========================================== */

function saveResultToBrowser(result) {
  const storedResults =
    JSON.parse(
      localStorage.getItem(
        "jeeverse-results"
      ) || "[]"
    );

  storedResults.push({
    testId: selectedTestId,
    title:
      selectedTest?.title ||
      "JEE Main Mock Test",
    score: result.score,
    maximumMarks:
      result.maximumMarks,
    accuracy: result.accuracy,
    completedAt:
      new Date().toISOString()
  });

  localStorage.setItem(
    "jeeverse-results",
    JSON.stringify(
      storedResults.slice(-20)
    )
  );
     }
