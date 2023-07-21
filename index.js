var currentQuestion = 0;
var totalQuestions = 3;
var correctAnswers = 0;
var selectedOptions = [];
var quizCompleted = false;
var nextQuestionShown = false;

var questions = [
  {
    questionText: ' Question 1: In preparation for the possibility of an attack:',
    type: 'multi', // Type 'multi' indicates multi-choice question
    options: ['Keep all systems and software up-to-date with the latest security patches.', 'Implement strong password policies for all user accounts.','test','1'],
    correctAnswers: ['Keep all systems and software up-to-date with the latest security patches.', 'Implement strong password policies for all user accounts.']
  },
  {
    questionText: 'Question 2: Abnormal inbound web traffic is detected:',
    type: 'multi', // Type 'multi' indicates multi-choice question
    options: ['Check the Sophos firewall logs for any anomalies in incoming traffic.', 'Run an antivirus/anti-malware scan on all systems to identify and remove potential threats.'],
    correctAnswers: ['Check the Sophos firewall logs for any anomalies in incoming traffic.', 'Run an antivirus/anti-malware scan on all systems to identify and remove potential threats.']
  },
  {
    questionText: 'Question 3: What is the largest planet in our solar system?',
    type: 'single', // Type 'single' indicates single-choice question
    options: ['Mars', 'Jupiter', 'Venus', 'Saturn'],
    correctAnswer: 'Jupiter'
  }
];

function showQuestion() {
  var questionBox = document.querySelector('.question-box');
  var question = questionBox.querySelector('.question');
  var feedback = questionBox.querySelector('.feedback');

  var currentQuestionText = questions[currentQuestion].questionText;

  document.getElementById('questionText').textContent = currentQuestionText;

  var optionsList = document.getElementById('optionsList');
  optionsList.innerHTML = '';

  var options = questions[currentQuestion].options;
  for (var i = 0; i < options.length; i++) {
    var option = options[i];
    var li = document.createElement('li');
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'option-button';
    button.setAttribute('onclick', 'selectOption("' + option + '", this)');
    button.innerHTML = '<span class="option-letter">' + String.fromCharCode(65 + i) + '.</span> ' + option;
    li.appendChild(button);
    optionsList.appendChild(li);
  }

  question.style.display = 'block';

  var selectedOption = selectedOptions[currentQuestion];
  if (selectedOption) {
    if (questions[currentQuestion].type === 'single') {
      var selectedValue = selectedOption;
      var correctValue = questions[currentQuestion].correctAnswer;

      if (selectedValue === correctValue) {
        feedback.textContent = 'Correct!';
        feedback.className = 'feedback correct';
      } else {
        feedback.textContent = 'Incorrect!';
        feedback.className = 'feedback incorrect';
      }

      var optionButtons = document.querySelectorAll('.option-button');
      optionButtons.forEach(function(button) {
        var optionValue = button.textContent.trim().slice(3);
        button.style.backgroundColor = selectedValue === optionValue ? 'lightgreen' : '';
      });
    } else if (questions[currentQuestion].type === 'multi') {
      var selectedValues = selectedOption;
      var correctValues = questions[currentQuestion].correctAnswers;

      var optionButtons = document.querySelectorAll('.option-button');
      optionButtons.forEach(function(button) {
        var optionValue = button.textContent.trim().slice(3);
        button.style.backgroundColor = selectedValues.includes(optionValue) ? 'lightgreen' : '';
      });
    }
  } else {
    feedback.textContent = '';
    feedback.className = 'feedback';
  }
}

function selectOption(value, button) {
  if (nextQuestionShown) {
    return; // Do not allow changing selection if next question is shown
  }

  if (questions[currentQuestion].type === 'single') {
    selectedOptions[currentQuestion] = value;

    var optionButtons = document.querySelectorAll('.option-button');
    optionButtons.forEach(function(button) {
      var optionValue = button.textContent.trim().slice(3);
      button.style.backgroundColor = selectedOptions[currentQuestion] === optionValue ? 'lightgreen' : '';
    });

    var feedback = document.querySelector('.feedback');
    if (selectedOptions[currentQuestion] === questions[currentQuestion].correctAnswer) {
      feedback.textContent = 'Correct!';
      feedback.className = 'feedback correct';
    } else {
      feedback.textContent = 'Incorrect! The correct answer is: ' + questions[currentQuestion].correctAnswer;
      feedback.className = 'feedback incorrect';

      // Highlight the correct answer button
      optionButtons.forEach(function(button) {
        var optionValue = button.textContent.trim().slice(3);
        if (optionValue === questions[currentQuestion].correctAnswer) {
          button.style.backgroundColor = 'lightgreen';
        }
      });
    }
  } else if (questions[currentQuestion].type === 'multi') {
    if (!Array.isArray(selectedOptions[currentQuestion])) {
      selectedOptions[currentQuestion] = [];
    }

    if (selectedOptions[currentQuestion].includes(value)) {
      // If the option is already selected, deselect it
      var index = selectedOptions[currentQuestion].indexOf(value);
      if (index !== -1) {
        selectedOptions[currentQuestion].splice(index, 1);
      }
    } else {
      // Otherwise, add the option to the selected options array
      selectedOptions[currentQuestion].push(value);
    }

    var optionButtons = document.querySelectorAll('.option-button');
    optionButtons.forEach(function(button) {
      var optionValue = button.textContent.trim().slice(3);
      button.style.backgroundColor = selectedOptions[currentQuestion].includes(optionValue) ? 'lightgreen' : '';
    });
  }
}


function previousQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion();
  }
}

function nextQuestion() {
  if (questions[currentQuestion].type === 'single') {
    if (!selectedOptions[currentQuestion]) {
      return; // Do not proceed if an option is not selected
    }
  } else if (questions[currentQuestion].type === 'multi') {
    if (!selectedOptions[currentQuestion] || selectedOptions[currentQuestion].length === 0) {
      return; // Do not proceed if no options are selected
    }
  }

  var optionButtons = document.querySelectorAll('.option-button');
  optionButtons.forEach(function(button) {
    button.style.backgroundColor = '';
  });

  if (questions[currentQuestion].type === 'single') {
    if (selectedOptions[currentQuestion] === questions[currentQuestion].correctAnswer) {
      correctAnswers++; // Increment correctAnswers count
    }
  } else if (questions[currentQuestion].type === 'multi') {
    var selectedValues = selectedOptions[currentQuestion];
    var correctValues = questions[currentQuestion].correctAnswers;

    var areEqual = selectedValues.length === correctValues.length &&
      selectedValues.every(function(value) {
        return correctValues.includes(value);
      });

    if (areEqual) {
      correctAnswers++; // Increment correctAnswers count
    }
  }

  if (currentQuestion < totalQuestions - 1) {
    currentQuestion++;
    nextQuestionShown = false;
    showQuestion();
  } else {
    calculateGrade();
  }

  if (currentQuestion === totalQuestions - 1) {
    document.getElementById('nextButton').textContent = 'Submit';
  }
}

function calculateGrade() {
  var percentage = (correctAnswers / totalQuestions) * 100;
  var grade = '';

  if (percentage >= 90) {
    grade = 'A';
  } else if (percentage >= 80) {
    grade = 'B';
  } else if (percentage >= 70) {
    grade = 'C';
  } else if (percentage >= 60) {
    grade = 'D';
  } else {
    grade = 'F';
  }

  document.getElementById('grade').innerHTML = 'Your grade: ' + grade + ' (' + percentage.toFixed(2) + '%)';
  document.querySelector('.result').style.display = 'block';

  // Show reset button
  document.getElementById('resetButton').style.display = 'block';
  // Hide previous button
  document.getElementById('previousButton').style.display = 'none';
  // Disable next button
  document.getElementById('nextButton').disabled = true;

  quizCompleted = true;
}

function resetQuiz() {
  currentQuestion = 0;
  correctAnswers = 0;
  selectedOptions = [];
  quizCompleted = false;
  nextQuestionShown = false;

  showQuestion();

  // Hide reset button
  document.getElementById('resetButton').style.display = 'none';
  // Show previous button
  document.getElementById('previousButton').style.display = 'block';
  // Enable next button
  document.getElementById('nextButton').disabled = false;
  
  // Reset feedback messages
  var feedbackElements = document.querySelectorAll('.feedback');
  feedbackElements.forEach(function(element) {
    element.textContent = '';
    element.className = 'feedback';
  });

  // Reset option button colors
  var optionButtons = document.querySelectorAll('.option-button');
  optionButtons.forEach(function(button) {
    button.style.backgroundColor = '';
  });

  // Reset grade result
  document.getElementById('grade').innerHTML = '';
  document.querySelector('.result').style.display = 'none';
}

document.getElementById('previousButton').addEventListener('click', previousQuestion);
document.getElementById('nextButton').addEventListener('click', nextQuestion);
document.getElementById('resetButton').addEventListener('click', resetQuiz);

showQuestion();
