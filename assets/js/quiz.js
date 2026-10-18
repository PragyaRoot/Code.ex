(function() {
  var score = 0;
  var scoreDisplay = document.getElementById('score-display');
  var resetBtn = document.getElementById('reset-quiz');

  function updateScore() {
    if (scoreDisplay) scoreDisplay.textContent = score;
  }

  function cleanString(str) {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('quiz-btn')) {
      var btn = e.target;
      var parent = btn.closest('.quiz-item');
      if (parent.classList.contains('solved')) return;
      
      var answer = parent.getAttribute('data-answer');
      var val = btn.getAttribute('data-val');
      var feedback = parent.querySelector('.mcq-feedback');
      
      parent.classList.add('solved');
      
      if (val === answer) {
        btn.classList.add('correct');
        feedback.textContent = 'Correct!';
        feedback.className = 'mcq-feedback show correct';
        score++;
      } else {
        btn.classList.add('wrong');
        var correctBtn = parent.querySelector('.quiz-btn[data-val="' + answer + '"]');
        correctBtn.classList.add('correct');
        var correctText = correctBtn.textContent;
        feedback.textContent = 'Incorrect. The correct answer is ' + correctText;
        feedback.className = 'mcq-feedback show wrong';
      }
      updateScore();
    }

    if (e.target.classList.contains('check-btn')) {
      var btn = e.target;
      var parent = btn.closest('.fill-item');
      var input = parent.querySelector('.fill-input');
      var feedback = parent.querySelector('.fill-feedback');
      var answerRaw = parent.getAttribute('data-answer');
      
      var userClean = cleanString(input.value);
      var answerClean = cleanString(answerRaw);
      
      if (userClean === answerClean) {
        input.classList.remove('wrong');
        input.classList.add('correct');
        feedback.classList.remove('wrong');
        feedback.classList.add('correct');
        feedback.textContent = 'Correct!';
        feedback.classList.add('show');
        btn.style.display = 'none';
        parent.classList.add('solved');
        score++;
        updateScore();
      } else {
        input.classList.add('wrong');
        feedback.classList.remove('correct');
        feedback.classList.add('wrong');
        feedback.textContent = 'Incorrect. The correct answer is: ' + answerRaw;
        feedback.classList.add('show');
      }
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.classList.contains('fill-input')) {
      var parent = e.target.closest('.fill-item');
      var checkBtn = parent.querySelector('.check-btn');
      if (checkBtn && checkBtn.style.display !== 'none') {
        checkBtn.click();
      }
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      score = 0;
      updateScore();
      
      document.querySelectorAll('.quiz-item').forEach(function(item) {
        item.classList.remove('solved');
      });
      
      document.querySelectorAll('.quiz-btn').forEach(function(btn) {
        btn.classList.remove('correct', 'wrong');
      });
      
      document.querySelectorAll('.mcq-feedback').forEach(function(f) {
        f.className = 'mcq-feedback';
        f.textContent = '';
      });
      
      document.querySelectorAll('.fill-item').forEach(function(item) {
        var input = item.querySelector('.fill-input');
        var feedback = item.querySelector('.fill-feedback');
        var checkBtn = item.querySelector('.check-btn');
        
        input.value = '';
        input.classList.remove('correct', 'wrong');
        
        feedback.className = 'fill-feedback';
        feedback.textContent = '';
        
        checkBtn.style.display = 'inline-block';
      });
    });
  }
})();
