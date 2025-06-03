// Application Data and State Management
const appData = {
  regularVerbs: [],
  irregularVerbs: [],
  exerciseVerbs: [],
  regularRules: [],
};

async function loadAppData() {
  const [regularVerbs, irregularVerbs, exerciseVerbs, regularRules] =
    await Promise.all([
      fetch("data/regularVerbs.json").then((res) => res.json()),
      fetch("data/irregularVerbs.json").then((res) => res.json()),
      fetch("data/exerciseVerbs.json").then((res) => res.json()),
      fetch("data/regularRules.json").then((res) => res.json()),
    ]);
  appData.regularVerbs = regularVerbs;
  appData.irregularVerbs = irregularVerbs;
  appData.exerciseVerbs = exerciseVerbs;
  appData.regularRules = regularRules;
}

const translations = {
  welcome: { zh: "欢迎来到动词大师！", en: "Welcome to Verb Master!" },
  subtitle: {
    zh: "让学习英语动词过去式变得有趣！",
    en: "Making past tense verbs fun to learn!",
  },
  learn: { zh: "学习", en: "Learn" },
  practice: { zh: "练习", en: "Practice" },
  game: { zh: "游戏", en: "Game" },
  regularVerbs: { zh: "规则动词", en: "Regular Verbs" },
  irregularVerbs: { zh: "不规则动词", en: "Irregular Verbs" },
  checkAnswer: { zh: "检查答案", en: "Check Answer" },
  correct: { zh: "正确！", en: "Correct!" },
  incorrect: {
    zh: "加油！正确答案是：",
    en: "Try again! The correct answer is:",
  },
  score: { zh: "得分：", en: "Score:" },
  tryAgain: { zh: "再试一次", en: "Try Again" },
  congratulations: { zh: "恭喜！", en: "Congratulations!" },
  completed: {
    zh: "你已完成所有练习！",
    en: "You have completed all exercises!",
  },
  backToHome: { zh: "返回主页", en: "Back to Home" },
  chooseDifficulty: { zh: "选择难度：", en: "Choose Difficulty:" },
  easy: { zh: "简单", en: "Easy" },
  medium: { zh: "中等", en: "Medium" },
  hard: { zh: "困难", en: "Hard" },
  matchVerbs: {
    zh: "配对动词和它们的过去式",
    en: "Match the verbs with their past tense",
  },
  timeLeft: { zh: "剩余时间：", en: "Time Left:" },
  gameOver: { zh: "游戏结束！", en: "Game Over!" },
  yourScore: { zh: "你的得分：", en: "Your Score:" },
  seconds: { zh: "秒", en: "seconds" },
  playAgain: { zh: "再玩一次", en: "Play Again" },
  nextQuestion: { zh: "下一题", en: "Next Question" },
  startGame: { zh: "开始游戏", en: "Start Game" },
};

// Application State
let currentLanguage = "zh";
let currentScreen = "home";
let practiceState = {
  currentQuestion: 0,
  score: 0,
  answers: [],
};
let gameState = {
  difficulty: "easy",
  selectedCards: [],
  matchedPairs: 0,
  gameScore: 0,
  timer: 60,
  gameActive: false,
};

// DOM Elements
const screens = {
  home: document.getElementById("home-screen"),
  learn: document.getElementById("learn-screen"),
  practice: document.getElementById("practice-screen"),
  game: document.getElementById("game-screen"),
};

// Initialize Application
document.addEventListener("DOMContentLoaded", async function () {
  await loadAppData();
  initializeLanguage();
  initializeNavigation();
  initializeLearnSection();
  initializePracticeSection();
  initializeGameSection();

  // Show home screen by default
  showScreen("home");
});

// Language Management
function initializeLanguage() {
  const zhBtn = document.getElementById("zh-btn");
  const enBtn = document.getElementById("en-btn");

  zhBtn.addEventListener("click", () => switchLanguage("zh"));
  enBtn.addEventListener("click", () => switchLanguage("en"));

  updateLanguage();
}

function switchLanguage(lang) {
  currentLanguage = lang;

  // Update button states
  document.querySelectorAll(".language-toggle .btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.getElementById(lang + "-btn").classList.add("active");

  updateLanguage();
}

function updateLanguage() {
  // Update static text elements
  document.getElementById("welcome-title").textContent =
    translations.welcome[currentLanguage];
  document.getElementById("welcome-subtitle").textContent =
    translations.subtitle[currentLanguage];

  // Update button texts
  updateButtonText("learn-btn", translations.learn[currentLanguage]);
  updateButtonText("practice-btn", translations.practice[currentLanguage]);
  updateButtonText("game-btn", translations.game[currentLanguage]);

  // Update other elements
  updateElementText(
    "learn-title",
    currentLanguage === "zh" ? "学习动词过去式" : "Learn Past Tense Verbs"
  );
  updateElementText(
    "practice-title",
    currentLanguage === "zh" ? "练习动词过去式" : "Practice Past Tense Verbs"
  );
  updateElementText(
    "game-title",
    currentLanguage === "zh" ? "动词配对游戏" : "Verb Matching Game"
  );

  // Update tabs
  updateElementText("regular-tab", translations.regularVerbs[currentLanguage]);
  updateElementText(
    "irregular-tab",
    translations.irregularVerbs[currentLanguage]
  );

  // Update all back buttons
  document.querySelectorAll(".back-btn .btn-text").forEach((btn) => {
    btn.textContent = translations.backToHome[currentLanguage];
  });

  // Update practice elements
  updateElementText("score-label", translations.score[currentLanguage]);
  updateElementText(
    "congratulations-text",
    translations.congratulations[currentLanguage]
  );
  updateElementText("completed-text", translations.completed[currentLanguage]);
  updateElementText(
    "final-score-label",
    currentLanguage === "zh" ? "最终得分：" : "Final Score:"
  );

  // Update game elements
  updateElementText(
    "match-verbs-text",
    translations.matchVerbs[currentLanguage]
  );
  updateElementText(
    "choose-difficulty-text",
    translations.chooseDifficulty[currentLanguage]
  );
  updateElementText("easy-btn", translations.easy[currentLanguage]);
  updateElementText("medium-btn", translations.medium[currentLanguage]);
  updateElementText("hard-btn", translations.hard[currentLanguage]);
  updateElementText("start-game-btn", translations.startGame[currentLanguage]);
  updateElementText("time-left-label", translations.timeLeft[currentLanguage]);
  updateElementText("game-score-label", translations.score[currentLanguage]);
  updateElementText("seconds-text", translations.seconds[currentLanguage]);
  updateElementText("game-over-text", translations.gameOver[currentLanguage]);
  updateElementText("your-score-text", translations.yourScore[currentLanguage]);
  updateElementText("play-again-btn", translations.playAgain[currentLanguage]);

  // Refresh current screen content
  if (currentScreen === "learn") {
    populateLearnContent();
  } else if (currentScreen === "practice") {
    updatePracticeQuestion();
  }
}

function updateButtonText(buttonId, text) {
  const button = document.getElementById(buttonId);
  if (button) {
    const textSpan = button.querySelector(".btn-text");
    if (textSpan) {
      textSpan.textContent = text;
    }
  }
}

function updateElementText(elementId, text) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = text;
  }
}

// Navigation Management
function initializeNavigation() {
  // Home screen navigation
  document
    .getElementById("learn-btn")
    .addEventListener("click", () => showScreen("learn"));
  document
    .getElementById("practice-btn")
    .addEventListener("click", () => showScreen("practice"));
  document
    .getElementById("game-btn")
    .addEventListener("click", () => showScreen("game"));

  // Back buttons
  document.querySelectorAll(".back-btn").forEach((btn) => {
    btn.addEventListener("click", () => showScreen("home"));
  });
}

function showScreen(screenName) {
  // Hide all screens
  Object.values(screens).forEach((screen) => {
    screen.classList.remove("active");
  });

  // Show target screen
  screens[screenName].classList.add("active");
  currentScreen = screenName;

  // Initialize screen-specific content
  if (screenName === "learn") {
    initializeLearnContent();
  } else if (screenName === "practice") {
    resetPractice();
  } else if (screenName === "game") {
    resetGame();
  }
}

// Learn Section
function initializeLearnSection() {
  const regularTab = document.getElementById("regular-tab");
  const irregularTab = document.getElementById("irregular-tab");

  regularTab.addEventListener("click", () => switchTab("regular"));
  irregularTab.addEventListener("click", () => switchTab("irregular"));
}

function initializeLearnContent() {
  populateLearnContent();
}

function switchTab(tabName) {
  // Update tab buttons
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document.getElementById(tabName + "-tab").classList.add("active");

  // Update tab content
  document
    .querySelectorAll(".tab-content")
    .forEach((content) => content.classList.remove("active"));
  document.getElementById(tabName + "-content").classList.add("active");
}

function populateLearnContent() {
  populateRegularRules();
  populateRegularVerbs();
  populateIrregularVerbs();
}

function populateRegularRules() {
  const container = document.getElementById("regular-rules");
  container.innerHTML = "";

  appData.regularRules.forEach((rule) => {
    const ruleCard = document.createElement("div");
    ruleCard.className = "rule-card";

    ruleCard.innerHTML = `
      <div class="rule-title">${rule.rule}</div>
      <div class="rule-examples">
        ${rule.examples
          .map((example) => `<span class="rule-example">${example}</span>`)
          .join("")}
      </div>
    `;

    container.appendChild(ruleCard);
  });
}

function populateRegularVerbs() {
  const container = document.getElementById("regular-verbs");
  container.innerHTML = "";

  appData.regularVerbs.forEach((verb) => {
    const verbCard = createVerbCard(verb, "regular");
    container.appendChild(verbCard);
  });
}

function populateIrregularVerbs() {
  const container = document.getElementById("irregular-verbs");
  container.innerHTML = "";

  appData.irregularVerbs.forEach((verb) => {
    const verbCard = createVerbCard(verb, "irregular");
    container.appendChild(verbCard);
  });
}

function createVerbCard(verb, type) {
  const card = document.createElement("div");
  card.className = `verb-card ${type}`;
  card.innerHTML = `
    <div class="verb-original">
      ${verb.verb}
      <div class="verb-sound" title="播放原型" onclick="playSound('${
        verb.verb
      }')"></div>
    </div>
    <div class="verb-arrow">↓</div>
    <div class="verb-past">
      ${verb.past}
      ${
        type === "irregular"
          ? `<div class="verb-sound verb-sound-past" title="播放过去式" onclick="playSound('${verb.past}')"></div>`
          : ""
      }
    </div>
    <div class="verb-meaning">${verb.meaning}</div>
  `;
  return card;
}

function playSound(word) {
  if (!window.speechSynthesis) {
    alert("当前浏览器不支持语音合成");
    return;
  }
  const utterance = new window.SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  window.speechSynthesis.speak(utterance);
}

// Practice Section
function initializePracticeSection() {
  document
    .getElementById("retry-practice-btn")
    .addEventListener("click", resetPractice);
  document
    .getElementById("practice-home-btn")
    .addEventListener("click", () => showScreen("home"));
}

function resetPractice() {
  practiceState = {
    currentQuestion: 0,
    score: 0,
    answers: [],
  };

  document.getElementById("feedback-container").classList.add("hidden");
  document.getElementById("completion-container").classList.add("hidden");
  document.getElementById("exercise-container").classList.remove("hidden");

  updatePracticeQuestion();
  updatePracticeProgress();
  updatePracticeScore();
}

function updatePracticeQuestion() {
  if (practiceState.currentQuestion >= appData.exerciseVerbs.length) {
    showPracticeCompletion();
    return;
  }

  const currentExercise = appData.exerciseVerbs[practiceState.currentQuestion];
  const container = document.getElementById("exercise-container");

  container.innerHTML = `
    <div class="exercise-prompt">
      <span class="exercise-number">${
        currentLanguage === "zh" ? "题目" : "Question"
      } ${currentExercise.number}</span>
    </div>
    <div class="exercise-input-container">
      <span class="exercise-verb">${currentExercise.verb}</span>
      <span class="exercise-arrow">→</span>
      <input type="text" class="exercise-input" id="answer-input" placeholder="?" autocomplete="off">
    </div>
    <div class="exercise-meaning">(${currentExercise.meaning})</div>
    <button class="btn btn--primary check-answer-btn" onclick="checkAnswer()">${
      translations.checkAnswer[currentLanguage]
    }</button>
  `;

  // Focus on input and add enter key listener
  const input = document.getElementById("answer-input");
  input.focus();
  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      checkAnswer();
    }
  });
}

function checkAnswer() {
  const input = document.getElementById("answer-input");
  const userAnswer = input.value.trim().toLowerCase();
  const currentExercise = appData.exerciseVerbs[practiceState.currentQuestion];
  const correctAnswer = currentExercise.past.toLowerCase();

  const isCorrect = userAnswer === correctAnswer;

  if (isCorrect) {
    practiceState.score++;
    showFeedback(true, translations.correct[currentLanguage]);
  } else {
    showFeedback(
      false,
      `${translations.incorrect[currentLanguage]} ${currentExercise.past}`
    );
  }

  practiceState.answers.push({
    question: practiceState.currentQuestion,
    userAnswer: userAnswer,
    correctAnswer: correctAnswer,
    isCorrect: isCorrect,
  });

  updatePracticeScore();
  document.getElementById("exercise-container").classList.add("hidden");
}

function showFeedback(isCorrect, message) {
  const container = document.getElementById("feedback-container");
  const icon = document.getElementById("feedback-icon");
  const messageEl = document.getElementById("feedback-message");
  const nextBtn = document.getElementById("next-btn");

  container.classList.remove("hidden", "error");
  if (!isCorrect) {
    container.classList.add("error");
  }

  icon.textContent = isCorrect ? "✓" : "✗";
  icon.className = `feedback-icon ${isCorrect ? "correct" : "incorrect"}`;
  messageEl.textContent = message;

  nextBtn.textContent =
    practiceState.currentQuestion < appData.exerciseVerbs.length - 1
      ? translations.nextQuestion[currentLanguage]
      : currentLanguage === "zh"
      ? "查看结果"
      : "View Results";

  nextBtn.onclick = nextQuestion;

  // Add animation
  if (!isCorrect) {
    container.style.animation = "shake 0.5s";
    setTimeout(() => {
      container.style.animation = "";
    }, 500);
  }
}

function nextQuestion() {
  practiceState.currentQuestion++;
  updatePracticeProgress();

  document.getElementById("feedback-container").classList.add("hidden");
  document.getElementById("exercise-container").classList.remove("hidden");

  updatePracticeQuestion();
}

function updatePracticeProgress() {
  const progressLabel = document.getElementById("progress-label");
  const progressBar = document.getElementById("progress-bar");

  const current = practiceState.currentQuestion + 1;
  const total = appData.exerciseVerbs.length;
  const percentage = (current / total) * 100;

  progressLabel.textContent =
    currentLanguage === "zh"
      ? `题目 ${current}/${total}`
      : `Question ${current}/${total}`;
  progressBar.style.width = `${percentage}%`;
}

function updatePracticeScore() {
  const scoreEl = document.getElementById("score");
  scoreEl.textContent = `${practiceState.score}/${appData.exerciseVerbs.length}`;
}

function showPracticeCompletion() {
  document.getElementById("exercise-container").classList.add("hidden");
  document.getElementById("feedback-container").classList.add("hidden");
  document.getElementById("completion-container").classList.remove("hidden");

  document.getElementById(
    "final-score"
  ).textContent = `${practiceState.score}/${appData.exerciseVerbs.length}`;

  // Trigger confetti animation
  setTimeout(() => {
    document.querySelectorAll(".confetti").forEach((confetti, index) => {
      confetti.style.animationDelay = `${index * 0.2}s`;
    });
  }, 100);
}

// Game Section
function initializeGameSection() {
  document
    .getElementById("easy-btn")
    .addEventListener("click", () => selectDifficulty("easy"));
  document
    .getElementById("medium-btn")
    .addEventListener("click", () => selectDifficulty("medium"));
  document
    .getElementById("hard-btn")
    .addEventListener("click", () => selectDifficulty("hard"));
  document
    .getElementById("start-game-btn")
    .addEventListener("click", startGame);
  document
    .getElementById("play-again-btn")
    .addEventListener("click", resetGame);
  document
    .getElementById("game-home-btn")
    .addEventListener("click", () => showScreen("home"));
}

function selectDifficulty(difficulty) {
  gameState.difficulty = difficulty;

  // Update button states
  document
    .querySelectorAll(".difficulty-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document.getElementById(difficulty + "-btn").classList.add("active");

  // Update timer based on difficulty
  const timers = { easy: 90, medium: 60, hard: 30 };
  gameState.timer = timers[difficulty];
}

function resetGame() {
  gameState = {
    difficulty: gameState.difficulty || "easy",
    selectedCards: [],
    matchedPairs: 0,
    gameScore: 0,
    timer: gameState.timer || 60,
    gameActive: false,
  };

  document.getElementById("game-intro").classList.remove("hidden");
  document.getElementById("game-area").classList.add("hidden");
  document.getElementById("game-result").classList.add("hidden");

  updateGameScore();
}

function startGame() {
  document.getElementById("game-intro").classList.add("hidden");
  document.getElementById("game-area").classList.remove("hidden");

  gameState.gameActive = true;
  generateGameBoard();
  startGameTimer();
  updateGameScore();
}

function generateGameBoard() {
  const board = document.getElementById("game-board");
  board.innerHTML = "";

  // Select verbs based on difficulty
  const verbCounts = { easy: 4, medium: 6, hard: 8 };
  const verbCount = verbCounts[gameState.difficulty];

  // Combine both regular and irregular verbs for selection
  const allVerbs = [...appData.regularVerbs, ...appData.irregularVerbs];
  const selectedVerbs = shuffleArray(allVerbs).slice(0, verbCount);

  // Create card pairs
  const gameCards = [];
  selectedVerbs.forEach((verb, index) => {
    gameCards.push({
      id: index * 2,
      type: "original",
      verb: verb.verb,
      pair: index,
    });
    gameCards.push({
      id: index * 2 + 1,
      type: "past",
      verb: verb.past,
      pair: index,
    });
  });

  // Shuffle and create DOM elements
  shuffleArray(gameCards).forEach((card) => {
    const cardEl = document.createElement("div");
    cardEl.className = "game-card";
    cardEl.dataset.id = card.id;
    cardEl.dataset.pair = card.pair;
    cardEl.onclick = () => selectGameCard(cardEl, card);

    cardEl.innerHTML = `
      <div class="game-card-front">?</div>
      <div class="game-card-back">${card.verb}</div>
    `;

    board.appendChild(cardEl);
  });

  gameState.totalPairs = verbCount;
}

function selectGameCard(cardEl, card) {
  if (
    !gameState.gameActive ||
    cardEl.classList.contains("flipped") ||
    cardEl.classList.contains("matched")
  ) {
    return;
  }

  cardEl.classList.add("flipped");
  gameState.selectedCards.push({ element: cardEl, card: card });

  if (gameState.selectedCards.length === 2) {
    setTimeout(checkGameMatch, 800);
  }
}

function checkGameMatch() {
  const [first, second] = gameState.selectedCards;

  if (first.card.pair === second.card.pair) {
    // Match found
    first.element.classList.add("matched");
    second.element.classList.add("matched");
    gameState.matchedPairs++;
    gameState.gameScore += 10;

    if (gameState.matchedPairs === gameState.totalPairs) {
      // Game won
      gameState.gameScore += gameState.timer * 2; // Bonus for remaining time
      endGame(true);
    }
  } else {
    // No match
    first.element.classList.remove("flipped");
    second.element.classList.remove("flipped");
  }

  gameState.selectedCards = [];
  updateGameScore();
}

function startGameTimer() {
  const timerEl = document.getElementById("timer");

  const countdown = setInterval(() => {
    gameState.timer--;
    timerEl.textContent = gameState.timer;

    if (gameState.timer <= 0) {
      clearInterval(countdown);
      endGame(false);
    }

    if (!gameState.gameActive) {
      clearInterval(countdown);
    }
  }, 1000);
}

function endGame(won) {
  gameState.gameActive = false;

  setTimeout(() => {
    document.getElementById("game-result").classList.remove("hidden");
    document.getElementById("final-game-score").textContent =
      gameState.gameScore;

    if (won) {
      showToast(
        currentLanguage === "zh" ? "太棒了！你赢了！" : "Awesome! You won!"
      );
    }
  }, 1000);
}

function updateGameScore() {
  document.getElementById("game-score").textContent = gameState.gameScore;
}

// Utility Functions
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function showToast(message) {
  // Create and show a temporary toast message
  const toast = document.createElement("div");
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--color-primary);
    color: white;
    padding: 12px 24px;
    border-radius: 25px;
    font-weight: 500;
    z-index: 1000;
    animation: fadeInUp 0.3s ease-out;
  `;
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "fadeOut 0.3s ease-out";
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 2000);
}

// Add click sound effects (visual feedback)
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn") || e.target.closest(".btn")) {
    const btn = e.target.classList.contains("btn")
      ? e.target
      : e.target.closest(".btn");
    btn.style.transform = "scale(0.95)";
    setTimeout(() => {
      btn.style.transform = "";
    }, 150);
  }
});

// Initialize tooltips for ADHD-friendly guidance
function initializeTooltips() {
  const elements = [
    {
      selector: ".language-toggle",
      message:
        currentLanguage === "zh" ? "点击切换语言" : "Click to switch language",
    },
    {
      selector: ".character",
      message:
        currentLanguage === "zh"
          ? "我是你的学习伙伴！"
          : "I am your learning companion!",
    },
  ];

  elements.forEach((item) => {
    const el = document.querySelector(item.selector);
    if (el) {
      el.title = item.message;
    }
  });
}

// Accessibility enhancements
document.addEventListener("keydown", function (e) {
  // Allow Enter key to submit answers
  if (
    e.key === "Enter" &&
    document.activeElement.classList.contains("exercise-input")
  ) {
    checkAnswer();
  }

  // Allow Escape key to go back to home
  if (e.key === "Escape" && currentScreen !== "home") {
    showScreen("home");
  }
});

// Initialize on load
window.addEventListener("load", function () {
  initializeTooltips();

  // Add focus indicators for better accessibility
  document.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      document.body.classList.add("keyboard-navigation");
    }
  });

  document.addEventListener("mousedown", function () {
    document.body.classList.remove("keyboard-navigation");
  });
});
