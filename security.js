var currentQuestion = 0;
var totalQuestions = 8;
var correctAnswers = 0;
var selectedOptions = [];
var quizCompleted = false;
var nextQuestionShown = false;

var questions = [
  {
    questionText: ' Question 1: In preparation for the possibility of an attack',
    type: 'multi', // Type 'multi' indicates multi-choice question
    options: ['Implament a strong passowrd pollicy', 'turn off all servers', 'provide training about common attacks', 'set up firewalls'],
    correctAnswers: ['Implament a strong passowrd pollicy', 'provide training about common attacks']
  },
  {
    questionText: 'Question 2:  Abnormal inbound web traffic is detected. What actions should you take to investigate and mitigate potential threats?',
    type: 'multi', // Type 'single' indicates single-choice question
    options: ['Check the Sophos firewall logs for any anomalies in incoming traffic.', 'Review network performance metrics to ensure normal web traffic patterns.', 'Analyze outgoing traffic to identify the source of abnormal inbound traffic.', 'Block the suspicious IP addresses or ranges identified in the logs.','Check the weather forecast for possible explanations for increased traffic.'],
    correctAnswers: ['Check the Sophos firewall logs for any anomalies in incoming traffic.','Block the suspicious IP addresses or ranges identified in the logs.']
  },
  
  {
    questionText: 'Question 3: Your network is under attack from the outside. What actions should you take to respond and mitigate the attack? ',
    type: 'multi', // Type 'single' indicates single-choice question
    options: ['Ignore the alert as it might be a false positive.', 'Activate incident response procedures immediately.', 'Isolate the affected systems from the network to prevent further spread.', 'Shut down the entire network to stop the attack.'],
    correctAnswers: ['Activate incident response procedures immediately.','Isolate the affected systems from the network to prevent further spread.']
  },
  {
    questionText: 'Question 4: What is the recommended action when abnormal inbound web traffic is detected on your network?',
    type: 'single', // Type 'single' indicates single-choice question
    options: ['Ignore the alert as it might be a false positive.', 'Activate incident response procedures immediately.', 'Run an antivirus/anti-malware scan on all systems to identify and remove potential threats.', 'Contact your ISP to report the abnormal traffic.'],
    correctAnswer: 'Activate incident response procedures immediately.'
  },
  {
    questionText: 'Question 5: Your network is experiencing a Denial of Service (DOS) attack. What actions should you take to mitigate the effects of the attack?',
    type: 'single', // Type 'single' indicates single-choice question
    options: ['', '', '', ''],
    correctAnswer: ''
  },
  {
    questionText: 'Question 6: ',
    type: 'multi', // Type 'single' indicates single-choice question
    options: ['Notify your upstream provider and consider utilizing their DOS protection services if available.', 'Monitor incoming traffic patterns using Wireshark to identify the source and type of attack.', 'Implement rate limiting rules in Sophos firewall to reduce the impact of the attack.', 'Temporarily shut down the affected systems to prevent further spread of the attack.'],
    correctAnswers: ['Notify your upstream provider and consider utilizing their DOS protection services if available.','Implement rate limiting rules in Sophos firewall to reduce the impact of the attack.']
  },
  {
    questionText: 'Question 7: Evidence suggests that an attacker has gained entry to your network. What should be your immediate response?',
    type: 'single', // Type 'single' indicates single-choice question
    options: ['Conduct a thorough investigation of Windows Event logs for signs of unauthorized access or privilege escalation.', 'Initiate the incident response plan and assemble the incident response team.', 'Use Wireshark to perform packet analysis and identify the point of entry.', 'Change all passwords for potentially compromised accounts, including privileged ones.'],
    correctAnswer: 'Initiate the incident response plan and assemble the incident response team.'
  },
  {
    questionText: 'Question 8: The attack on your network has ended. What should be your next step to improve security measures',
    type: 'single', // Type 'single' indicates single-choice question
    options: ['Conduct security awareness training for employees based on lessons learned from the incident.', 'Restore services and systems that were affected during the attack.', 'Update and patch any vulnerabilities that were exploited during the attack.', 'Assess the effectiveness of the response and make necessary improvements to the incident response plan'],
    correctAnswer: 'Conduct security awareness training for employees based on lessons learned from the incident.'
  },
  
];

function showQuestion() {
  var questionBox = document.querySelector('.question-box');
  var question = questionBox.querySelector('.question');
  var feedback = questionBox.querySelector('.feedback');

  var currentQuestionObj = questions[currentQuestion];
  var currentQuestionText = currentQuestionObj.questionText;
  var questionTypeText = currentQuestionObj.type === 'single' ? 'Single Choice' : 'Multi Choice';

  document.getElementById('questionText').textContent = currentQuestionText;
  document.getElementById('questionTypeText').textContent = questionTypeText;

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
