const word = document.getElementById("word");
const text = document.getElementById("text");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const endgameEl = document.getElementById("end-game-container");
const settingsBtn = document.getElementById("settings-btn");
const settings = document.getElementById("settings");
const settingsForm = document.getElementById("settings-form");
const difficultySelect = document.getElementById("difficulty");
const topicContainer = document.getElementById("topic-container");
const topic = document.getElementById("topic");
const topicBtn = document.getElementById("topic-btn");

//List of words for game
$(document).ready(function() {
  // Focus on text on start
  topic.focus();

  //Init difficulty
  let difficulty =
    localStorage.getItem("difficulty") !== null
      ? localStorage.getItem("difficulty")
      : "medium";

  //Set difficulty Select Value
  difficultySelect.value =
    localStorage.getItem("difficulty") !== null
      ? localStorage.getItem("difficulty")
      : "medium";

  $(topicBtn).on("click", function() {
    if (topic.value === "") {
      topic.focus();
    } else {
      //don't show topic box
      topicContainer.style.display = "none";
      text.focus();
      const Url = `https://api.datamuse.com/words?topics=${topic.value}`;
      $.ajax({
        url: Url,
        method: "GET"
      }).then(function(response) {
        const wordsArr = [];
        for (var i = 0; i < response.length; i++) {
          eachWord = String(response[i].word);
          wordsArr.push(eachWord);
        }
        //Init countDown
        const timeInterval = setInterval(updateTime, 1000);
        //Init Word
        let randomWord;

        //Init score
        let score = 0;

        //Init time
        let time = 10;

        //Generate random word from array
        function getRandomWord() {
          return wordsArr[Math.floor(Math.random() * wordsArr.length)];
        }

        //Add word to DOM
        function addWordToDOM() {
          randomWord = getRandomWord();
          word.innerHTML = randomWord;
        }

        //Update score
        function updateScore() {
          score++;
          scoreEl.innerHTML = score;
        }
        //Update time
        function updateTime() {
          time--;
          timeEl.innerHTML = time + "s";

          if (time === 0) {
            clearInterval(timeInterval);
            //endGame
            gameOver();
          }
        }

        //Game over, show end screen
        function gameOver() {
          endgameEl.innerHTML = `
    <h1>Time ran out</h1>
    <p>Your final score is ${score}</p>
    <button onclick="location.reload()">Reload</button>
    `;

          endgameEl.style.display = "flex";
        }

        addWordToDOM();

        //Event Listeners

        //Typing a word
        text.addEventListener("input", e => {
          const insertedText = e.target.value;
          if (insertedText === randomWord) {
            addWordToDOM();
            updateScore();

            //Clear
            e.target.value = "";

            if (difficulty === "easy") {
              time += 4;
            } else if (difficulty === "medium") {
              time += 3;
            } else {
              time += 2;
            }

            updateTime();
          }
        });

        //Submit btn click
        topicBtn.addEventListener("click", startTime);
      });
    }
  });
  //Settings btn click
  settingsBtn.addEventListener("click", () =>
    settings.classList.toggle("hide")
  );

  //Settings select
  settingsForm.addEventListener("change", e => {
    difficulty = e.target.value;
    localStorage.setItem("difficulty", difficulty);
  });
});
