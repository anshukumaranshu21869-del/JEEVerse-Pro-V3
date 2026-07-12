"use strict";

/* ==========================================
   JEEVerse Pro V3
   Question Database
========================================== */

const TESTS = [
  {
    id: "mock-01",
    title: "JEE Main Full Mock Test 1",
    durationMinutes: 180,
    maximumMarks: 36,
    questions: [
      {
        id: "P01",
        subject: "Physics",
        chapter: "Units and Dimensions",
        type: "mcq",
        difficulty: "Easy",
        question: "The dimensional formula of velocity is:",
        options: [
          "MLT⁻¹",
          "M⁰LT⁻¹",
          "M⁰LT⁻²",
          "ML²T⁻¹"
        ],
        answer: 1,
        explanation:
          "Velocity is distance divided by time, so its dimensional formula is M⁰LT⁻¹."
      },

      {
        id: "P02",
        subject: "Physics",
        chapter: "Laws of Motion",
        type: "mcq",
        difficulty: "Easy",
        question:
          "A force of 10 N acts on a body of mass 2 kg. Its acceleration is:",
        options: [
          "2 m/s²",
          "5 m/s²",
          "10 m/s²",
          "20 m/s²"
        ],
        answer: 1,
        explanation:
          "Using F = ma, acceleration = 10 ÷ 2 = 5 m/s²."
      },

      {
        id: "P03",
        subject: "Physics",
        chapter: "Work, Energy and Power",
        type: "numerical",
        difficulty: "Easy",
        question:
          "A body has kinetic energy 100 J and mass 2 kg. Enter its speed in m/s.",
        answer: 10,
        explanation:
          "Using KE = ½mv², 100 = ½ × 2 × v², so v = 10 m/s."
      },

      {
        id: "C01",
        subject: "Chemistry",
        chapter: "Mole Concept",
        type: "mcq",
        difficulty: "Easy",
        question: "One mole contains:",
        options: [
          "6.022 × 10²³ particles",
          "3.011 × 10²³ particles",
          "1.204 × 10²⁴ particles",
          "9.8 × 10²³ particles"
        ],
        answer: 0,
        explanation:
          "One mole contains Avogadro's number, 6.022 × 10²³ particles."
      },

      {
        id: "C02",
        subject: "Chemistry",
        chapter: "Atomic Structure",
        type: "mcq",
        difficulty: "Easy",
        question: "The charge on an electron is:",
        options: [
          "Positive",
          "Negative",
          "Neutral",
          "Variable"
        ],
        answer: 1,
        explanation:
          "An electron carries one unit of negative charge."
      },

      {
        id: "C03",
        subject: "Chemistry",
        chapter: "Solutions",
        type: "numerical",
        difficulty: "Easy",
        question:
          "Enter the number of moles present in 18 g of water. Molar mass is 18 g/mol.",
        answer: 1,
        explanation:
          "Number of moles = mass ÷ molar mass = 18 ÷ 18 = 1."
      },

      {
        id: "M01",
        subject: "Mathematics",
        chapter: "Quadratic Equations",
        type: "mcq",
        difficulty: "Easy",
        question: "The roots of x² - 5x + 6 = 0 are:",
        options: [
          "1 and 6",
          "2 and 3",
          "-2 and -3",
          "3 and 5"
        ],
        answer: 1,
        explanation:
          "x² - 5x + 6 = (x - 2)(x - 3), so the roots are 2 and 3."
      },

      {
        id: "M02",
        subject: "Mathematics",
        chapter: "Trigonometry",
        type: "mcq",
        difficulty: "Easy",
        question: "The value of sin²θ + cos²θ is:",
        options: [
          "0",
          "1",
          "2",
          "Depends on θ"
        ],
        answer: 1,
        explanation:
          "sin²θ + cos²θ = 1 is a fundamental trigonometric identity."
      },

      {
        id: "M03",
        subject: "Mathematics",
        chapter: "Arithmetic",
        type: "numerical",
        difficulty: "Easy",
        question: "Enter the value of 12².",
        answer: 144,
        explanation:
          "12 × 12 = 144."
      }
    ]
  }
];

/* Make database available to app.js */

window.JEEVERSE_TESTS = TESTS;
