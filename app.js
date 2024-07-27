// グローバル変数
let allQuizData = [];
let currentQuizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

// DOMが読み込まれたら実行
document.addEventListener('DOMContentLoaded', () => {
    fetchQuizData();
});

// JSONデータを取得
async function fetchQuizData() {
    try {
        const response = await fetch('aviation_quiz_data.json');
        const data = await response.json();
        allQuizData = data.quizSets;
        initializeQuiz();
    } catch (error) {
        console.error('データの取得に失敗しました:', error);
    }
}

// クイズの初期化
function initializeQuiz() {
    const quizSelection = document.getElementById('quiz-selection');
    quizSelection.innerHTML = '<h2>問題セットを選択してください</h2>';
    
    allQuizData.forEach((set, index) => {
        const button = document.createElement('button');
        button.textContent = set.name;
        button.addEventListener('click', () => startQuiz(index));
        quizSelection.appendChild(button);
    });
}

// ランダムに問題を選択する関数
function selectRandomQuestions(questions, count) {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// クイズの開始
function startQuiz(setIndex) {
    currentQuizQuestions = selectRandomQuestions(allQuizData[setIndex].questions, 10);
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('quiz-selection').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    loadQuestion();
}

// 問題の読み込み
function loadQuestion() {
    const question = currentQuizQuestions[currentQuestionIndex];
    document.getElementById('question-number').textContent = `問題 ${currentQuestionIndex + 1} / ${currentQuizQuestions.length}`;
    document.getElementById('question').textContent = question.question;

    const answersContainer = document.getElementById('answers');
    answersContainer.innerHTML = '';
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.classList.add('answer-option');
        button.addEventListener('click', () => selectAnswer(index));
        answersContainer.appendChild(button);
    });

    document.getElementById('submit-answer').style.display = 'inline-block';
    document.getElementById('next-question').style.display = 'none';
    document.getElementById('result').textContent = '';
    document.getElementById('explanation').textContent = '';
}

// 回答の選択
function selectAnswer(index) {
    const answerButtons = document.querySelectorAll('.answer-option');
    answerButtons.forEach(button => button.classList.remove('selected'));
    answerButtons[index].classList.add('selected');
}

// 回答の送信
function submitAnswer() {
    const selectedAnswer = document.querySelector('.answer-option.selected');
    if (!selectedAnswer) return;

    const selectedIndex = Array.from(selectedAnswer.parentNode.children).indexOf(selectedAnswer);
    const question = currentQuizQuestions[currentQuestionIndex];

    const resultElement = document.getElementById('result');
    const explanationElement = document.getElementById('explanation');

    if (selectedIndex === question.correct) {
        score++;
        resultElement.textContent = '正解！';
        resultElement.className = 'correct';
    } else {
        resultElement.textContent = '不正解。正解は: ' + question.answers[question.correct];
        resultElement.className = 'incorrect';
    }

    explanationElement.textContent = '解説: ' + question.explanation;

    document.getElementById('submit-answer').style.display = 'none';
    document.getElementById('next-question').style.display = 'inline-block';
}

// 次の問題へ
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuizQuestions.length) {
        loadQuestion();
    } else {
        showFinalScore();
    }
}

// 最終スコアの表示
function showFinalScore() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = `
        <h2>クイズ終了</h2>
        <p>あなたのスコア: ${score} / ${currentQuizQuestions.length}</p>
        <button onclick="initializeQuiz()" class="restart-button">別の問題セットを選択</button>
    `;
}

// イベントリスナーの設定
document.getElementById('submit-answer').addEventListener('click', submitAnswer);
document.getElementById('next-question').addEventListener('click', nextQuestion);