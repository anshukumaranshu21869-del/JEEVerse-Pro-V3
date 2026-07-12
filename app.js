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
/* ==========================================
   JEEVerse Pro V3
   App Logic - Part 2
========================================== */

let selectedSubject = null;
let examStarted = false;

function selectSubject(subjectName){

  selectedSubject = subjectName;

  document.querySelectorAll(".subject-card").forEach(card=>{
    card.classList.remove("active");
  });

  const card=document.querySelector(
    `[data-subject="${subjectName}"]`
  );

  if(card){
    card.classList.add("active");
  }

}

function startExam(){

  if(!selectedSubject){

    alert("Please select a subject first.");

    return;

  }

  examStarted=true;

  console.log(
    "Starting exam:",
    selectedSubject
  );

  alert(
    selectedSubject+
    " exam will start in the next update."
  );

}

const startButton=
document.getElementById(
"startExamBtn"
);

if(startButton){

  startButton.onclick=startExam;

}
