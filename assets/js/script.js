// hook into document's existing elements
let header = document.querySelector(".header");
let footer = document.querySelector(".footer");
let pageswitchContainer = document.querySelector(".pageswitch_container");
let timerContainer = document.querySelector(".timer_container");
let main = document.querySelector(".main_container");
let promptContainer = document.querySelector(".prompt_container");
let answerContainer = document.querySelector(".answer_container");
let menuButtonStyle = "font-size: 18pt; color: white; border-radius:20px; border: 1px solid white; padding: 1%; min-height:100px;min-width:150px;";
let answerButtonStyle = "font-size: 14pt; color: white; background-color: var(--dark3); border-radius:10px; border: 1px solid white; margin: 5px; padding: 2%;";
let viewSpacingStartPromptContainer = "font-size: 32pt;font-weight:900;display: flex;flex-direction: column;align-items: center;min-height: 15vh;";
let viewSpacingGameplayPromptContainer = "font-size: 32pt;font-weight:900;display: flex;flex-direction: column;align-items: center;justify-content: space-around;min-height: 15vh;";

// setup prototype datastructure quiz content
let quizContent = [
    {prompt: "Commonly used data types DO NOT include:", options: ["strings", "booleans", "alerts", "numbers"], correctOption: "alerts"},
    {prompt: "The condition in an if / else statement is enclosed within ____.", options: ["quotes", "curly braces", "parentheses", "square brackets"], correctOption: "parentheses"},
    {prompt: "Arrays in JavaScript can be used to store _____.", options: ["numbers and strings", "other arrays", "booleans", "any of these"], correctOption: "any of these"},
    {prompt: "A very useful tool used during development and debugging for printing content to the debugger is:", options: ["JavaScript", "terminal / bash", "for loops", "console.log"], correctOption: "console.log"}
  ];

timerContainer.innerText = "00";  
let questionCounter = 0;
let questionTotal = quizContent.length;
var timerInSeconds = 60;
var quizScore = 0;

// get local player storage data in order to append current player score
var playerData = JSON.parse(localStorage.getItem("playerData"));
if (playerData === null) {
  playerData = [];
}
// Initialize promptcontainer spacing 
promptContainer.setAttribute("style",viewSpacingStartPromptContainer);

// Initialize start button in DOM and set properties
let introContent = document.createElement("p");
introContent.setAttribute("style", "font-weight:200;font-size: 16pt; margin: 5px; padding: %;");
introContent.id = ("intro_content");
introContent.innerHTML = "Try to complete this quiz in <b>60 seconds</b>. Incorrect answers will subtract <b>10 seconds</b>. Good luck!";
promptContainer.appendChild(introContent);


// Initialize start button in DOM and set properties
let startButton = document.createElement("button");
startButton.setAttribute("style",menuButtonStyle);
startButton.className = ("menu_button");
startButton.textContent = "Start Game";
startButton.id = ("start_game");
answerContainer.appendChild(startButton);

startButton.addEventListener("click", function (event) {
  // adjust promptcontainer spacing for gameplay 
  document.querySelector('#start_game').setAttribute("style", "display: none;"),
  document.querySelector('#intro_content').remove();
  promptContainer.setAttribute("style",viewSpacingGameplayPromptContainer)
  playGame();
});

// start timer and display question one
function playGame() {
  // kickoff timer 
  setTime();
  // display question content
  displayQuestion();
}

function setTime() {
  // timer starts
  timerContainer.innerText = timerInSeconds;  
    // Sets interval in variable
    var timerInterval = setInterval(function() {
        timerInSeconds--;
        timerContainer.innerText = timerInSeconds;
      if(timerInSeconds <= 0) {
        // Stops execution of action at set interval
        clearInterval(timerInterval);
        // Calls function to change display on page
        endGame();
      }
    }, 1000);
  }

// on click, the timer starts currently
function displayQuestion() {
  // set the prompt container to the question stem
  console.log("question number is " + questionCounter);
  promptContainer.innerText = "";
  promptContainer.innerText = quizContent[questionCounter].prompt;
  // make a randomized order array for the available answer options
  let ansDispSeq = randomOrderPick();
  // get the answer array from the content file for HTML display
  let as = [quizContent[questionCounter].options[ansDispSeq[0]], quizContent[questionCounter].options[ansDispSeq[1]], quizContent[questionCounter].options[ansDispSeq[2]], quizContent[questionCounter].options[ansDispSeq[3]]];
  // loop through question's answer options and display them as selectable buttons
  for (i=0; i < as.length; i++) {
    let answerButton = document.createElement("button");
    answerButton.setAttribute("style", answerButtonStyle);
    answerButton.className = ("answer_item");
    answerButton.textContent = as[i];
    answerContainer.appendChild(answerButton);
  }
  inputFeedback();
}


function inputFeedback() {
  let ans = document.querySelectorAll('.answer_item');
  // add event listeners to all the answer options, isDisplaying correct if they're correct, else not correct
  for (i = 0; i < ans.length; i++) {
    ans[i].addEventListener("click", function (event) {
      if (event.target.innerText === quizContent[questionCounter].correctOption) {
        console.log("that's correct mang");
        questionCounter++;
        quizScore += 25;
        switchNextQuestion();
      }
      else if (event.target.innerText != quizContent[questionCounter].correctOption) {
        console.log("not correct mang :(");
        timerInSeconds = timerInSeconds - 10;
        questionCounter++;
        switchNextQuestion();
      }
    });
  }
}

function endGame() {
  quizScore = quizScore * timerInSeconds;
  
  if (timerInSeconds > 0) {
    // get player name prototype
    var userName = prompt("Thanks for playing!\n\nYour score was " + quizScore + "\n\nEnter your initials:");
  }
  else if (timerInSeconds <= 0) {
    // get player name prototype
    var userName = prompt("Time's up!\n\nYour score was " + quizScore + "\n\nEnter your initials:");
  }

  playerData.push({playerName: userName, playerScore: quizScore});
  storeScores();
  // redirects to the scoreboard page
  window.location.href = "./leaderboard.html";
}

function storeScores() {
  // store playerData item in local storage as strings 
  localStorage.setItem("playerData", JSON.stringify(playerData));
}

function switchNextQuestion() {
  let ans = document.querySelectorAll('.answer_item');
  ans.forEach(function(items) {
    items.remove();
  });
  if (questionCounter === questionTotal) {
    endGame();
  }
  else {
    displayQuestion();
  }
}
  

function randomOrderPick() {
  let randOrder = [];
  let startOrder = [0,1,2,3];
  for (i = 0; i < 4; i++) {
    randomNumber = Math.floor(Math.random()*startOrder.length);
    // console.log("iteration" + i + "randomnumber =\n" + randomNumber);
    // console.log(randomNumber);
    randOrder.push(startOrder[randomNumber]);
    // console.log("iteration" + i + "randomOrder =\n"); 
    // console.log(randOrder); 
    startOrder.splice(randomNumber, 1);
    // console.log("iteration" + i + "startOrder =\n" + startOrder); 
    // console.log(startOrder); 
  }
  randOrder = randOrder.join("");
  return randOrder;
}