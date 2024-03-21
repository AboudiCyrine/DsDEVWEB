document.addEventListener('DOMContentLoaded', () => {
    fetch('quizJson.json')
        .then(response => response.json())
        .then(data => {
            console.log('Questions loaded:', data.quizData);
            startQuiz(data.quizData);
        })
        .catch(error => console.error("Error loading quiz:", error));
});

let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let userAnswers = [];

function startQuiz(questions) {
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const nextButton = document.getElementById('next');
    const prevButton = document.getElementById('prev');
    const timerElement = document.getElementById('timer');

    function updateScoreAndProgress() {
        document.getElementById('score').textContent = `Score : ${score} sur ${questions.length}`;
        document.getElementById('progress').textContent = `Question ${currentQuestionIndex + 1} sur ${questions.length}`;
    }

    function showQuestion(question) {
        clearInterval(timerInterval);
        startTimer();

        questionElement.textContent = question.question;
        optionsElement.innerHTML = '';
        question.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.textContent = answer;
            button.onclick = () => selectOption(index, questions);
            optionsElement.appendChild(button);
        });

        updateScoreAndProgress();
    }

    function startTimer() {
        let time = 30; // Timer duration for each question in seconds
        timerElement.textContent = `Temps : ${time}`;
        timerInterval = setInterval(() => {
            time--;
            timerElement.textContent = `Temps : ${time}`;
            if (time <= 0) {
                clearInterval(timerInterval);
                moveToNextQuestion();
            }
        }, 1000);
    }

    function selectOption(selectedIndex, questions) {
        clearInterval(timerInterval); // Stop the timer when an answer is selected.

        const selectedAnswer = questions[currentQuestionIndex].answers[selectedIndex];
        const correctAnswer = questions[currentQuestionIndex].correctAnswer;
        const isCorrect = selectedAnswer === correctAnswer;

        // Store whether the answer was correct, not the index
        userAnswers[currentQuestionIndex] = isCorrect;

        // Update the score based on the answers
        updateScore(questions);

        // Ajouter la classe appropriée pour le smiley
        if (isCorrect) {
            document.getElementById('score').classList.add('happy');
            document.getElementById('score').classList.remove('sad');
        } else {
            document.getElementById('score').classList.add('sad');
            document.getElementById('score').classList.remove('happy');
        }
    }

    function updateScore(questions) {
        score = userAnswers.filter(isCorrect => isCorrect).length;
        updateScoreAndProgress(); // Make sure this updates the DOM
    }

    function updateScoreAndProgress() {
        document.getElementById('score').textContent = `Score: ${score} sur ${questions.length}`;
        // Update any other elements like progress here
    }

    function moveToNextQuestion() {
        clearInterval(timerInterval);

        if (currentQuestionIndex === questions.length - 1) {
            const quizContainer = document.getElementById('quiz-container');
            while (quizContainer.firstChild) {
                quizContainer.removeChild(quizContainer.firstChild);
            }

            const scoreMessage = document.createElement('div');
            scoreMessage.innerHTML = `<h1>Quiz terminé !</h1><p>Votre score est de ${score} sur ${questions.length}. Merci d'avoir testé notre quiz.</p>`;
            quizContainer.appendChild(scoreMessage);
        } else {
            currentQuestionIndex++;
            showQuestion(questions[currentQuestionIndex]);
        }
    }

    function moveToPrevQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showQuestion(questions[currentQuestionIndex]);
        }
    }

    nextButton.addEventListener('click', moveToNextQuestion);
    prevButton.addEventListener('click', moveToPrevQuestion);

    showQuestion(questions[currentQuestionIndex]);
}
