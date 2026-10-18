(function () {
  var STORAGE_KEY = 'pragyaroot-quiz-' + window.location.pathname;
  var score = 0;
  var scoreDisplay = document.getElementById('score-display');
  var resetBtn = document.getElementById('reset-quiz');

  function updateScore() {
    if (scoreDisplay) scoreDisplay.textContent = score;
  }

  function saveState() {
    var state = {
      score: score,
      solvedItems: []
    };

    document.querySelectorAll('.quiz-item.solved').forEach(function (item) {
      var index = Array.from(document.querySelectorAll('.quiz-item')).indexOf(item);
      var btn = item.querySelector('.quiz-btn.correct');
      var input = item.querySelector('.fill-input.correct');
      state.solvedItems.push({
        index: index,
        selectedVal: btn ? btn.getAttribute('data-val') : null,
        inputValue: input ? input.value : null
      });
    });

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function loadState() {
    var saved;
    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (e) {}
    if (!saved) return;

    score = saved.score;
    updateScore();

    var allItems = document.querySelectorAll('.quiz-item');

    saved.solvedItems.forEach(function (itemData) {
      var item = allItems[itemData.index];
      if (!item) return;

      item.classList.add('solved');

      if (item.classList.contains('fill-item')) {
        var input = item.querySelector('.fill-input');
        var feedback = item.querySelector('.fill-feedback');
        var checkBtn = item.querySelector('.check-btn');
        input.value = itemData.inputValue || '';
        input.classList.add('correct');
        feedback.textContent = 'Correct!';
        feedback.className = 'fill-feedback show correct';
        checkBtn.style.display = 'none';
      } else {
        var answer = item.getAttribute('data-answer');
        var feedback = item.querySelector('.mcq-feedback');
        var correctBtn = item.querySelector('.quiz-btn[data-val="' + answer + '"]');
        if (correctBtn) {
          correctBtn.classList.add('correct');
          feedback.textContent = 'Correct!';
          feedback.className = 'mcq-feedback show correct';
        }
      }
    });
  }

  document.addEventListener('click', function (e) {
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
        feedback.textContent = 'Incorrect. The correct answer is ' + correctBtn.textContent;
        feedback.className = 'mcq-feedback show wrong';
      }
      updateScore();
      saveState();
    }

    if (e.target.classList.contains('check-btn')) {
      var btn = e.target;
      var parent = btn.closest('.fill-item');
      var input = parent.querySelector('.fill-input');
      var feedback = parent.querySelector('.fill-feedback');
      var answerRaw = parent.getAttribute('data-answer');

      function cleanString(str) {
        return str.toLowerCase().replace(/[^a-z0-9]/g, '');
      }

      if (cleanString(input.value) === cleanString(answerRaw)) {
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
        saveState();
      } else {
        input.classList.add('wrong');
        feedback.classList.remove('correct');
        feedback.classList.add('wrong');
        feedback.textContent = 'Incorrect. The correct answer is: ' + answerRaw;
        feedback.classList.add('show');
      }
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.classList.contains('fill-input')) {
      var parent = e.target.closest('.fill-item');
      var checkBtn = parent.querySelector('.check-btn');
      if (checkBtn && checkBtn.style.display !== 'none') {
        checkBtn.click();
      }
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      score = 0;
      updateScore();

      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}

      document.querySelectorAll('.quiz-item').forEach(function (item) {
        item.classList.remove('solved');
      });

      document.querySelectorAll('.quiz-btn').forEach(function (btn) {
        btn.classList.remove('correct', 'wrong');
      });

      document.querySelectorAll('.mcq-feedback').forEach(function (f) {
        f.className = 'mcq-feedback';
        f.textContent = '';
      });

      document.querySelectorAll('.fill-item').forEach(function (item) {
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

  loadState();
})();
