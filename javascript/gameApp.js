function createOrderList(orderList) {
  // A recusive function that will fill the a list with random numbers.
  if(orderList.length === 16) {
    return orderList;
  }
  const OrderNumber = Math.floor(Math.random() * 16) + 1;
  if(orderList.includes(OrderNumber)) {
    return createOrderList(orderList);
  }
  else {
    orderList.push(OrderNumber);
    return createOrderList(orderList);
  }
}

function setGame() {
  // A function that will run when the game is reset or when the page reloads.
  // Primarily 'places' all cards in their locations by giving them an order #
  // governed by CSS flexbox.
  let orderList = [];
  orderList = createOrderList(orderList);

  const gameCardList = document.querySelectorAll('.gameCard');
  for (let i = 0; i < gameCardList.length; i++) {
    gameCardList[i].style.order = orderList[i].toString();
  }
  // Mainly just adds event listeners, called every game reset or intialization.
  let game = document.querySelector('#gameContainer');
  let playButtonStartGame = document.querySelectorAll('button')[0];
  let playButtonEndGame = document.querySelectorAll('button')[2];
  let reset = document.querySelector('#resetButton');
  game.addEventListener('click', gameClick);
  playButtonStartGame.addEventListener('click', runGame)
  playButtonEndGame.addEventListener('click', playAgain);
  reset.addEventListener('click', resetGame);
}

function gameClick(e) {
  // A function that will be called anytime a user clicks on cards.
  // Keeps track of the number of cards that have been selected.
  // And will trigger the end of the game.
  if(e.target.className === "gameCard") {
    e.target.classList.toggle('cardReveal');
  }
  let selectedCards = document.querySelectorAll('.cardReveal');
  let numOfSelectedCards = selectedCards.length;
  if(numOfSelectedCards === 2) {
    checkCards(selectedCards);
    let moves = document.querySelector('.moveCounter').value;
    moves++;
    document.querySelectorAll('.moveCounter')[0].value = moves;
    // document.querySelectorAll('.moveCounter')[1].value = moves;
    let starLossMoves = [13, 15, 19, 21, 24, 26];
    if (starLossMoves.includes(moves)) {
      loseLife();
    }
  }
  if(document.querySelectorAll('.correctCards').length === 16) {
    document.querySelector('main').style.display = 'none';
    document.querySelector('#modalTrigger').click();
    document.querySelector('main').style.display = 'none';
    document.querySelector('.starCounter').value = starCount();
    document.querySelector('#timer').value = minutes + ":" + doubleDSeconds + "" + singleDSeconds;
  }

}

function checkCards(selectedCards) {
  // A function that checkes whether two selected cards match.
  // If so, then they become correct cards; if not they become wrong Cards and flip back.
  let card1 = selectedCards[0].children[0].className;
  let card2 = selectedCards[1].children[0].className;
  if(card1 === card2) {
    selectedCards[0].classList.toggle('correctCards');
    selectedCards[1].classList.toggle('correctCards');
    selectedCards[0].classList.toggle('cardReveal');
    selectedCards[1].classList.toggle('cardReveal');
  }
  else {
    selectedCards[0].classList.toggle('wrongCards');
    selectedCards[1].classList.toggle('wrongCards');
    setTimeout( function() {
      selectedCards[0].classList.toggle('wrongCards');
      selectedCards[1].classList.toggle('wrongCards');
      selectedCards[0].classList.toggle('cardReveal');
      selectedCards[1].classList.toggle('cardReveal');
    }, 600);
  }
}

function starCount() {
  // Primarily used at end of game for displaying star numbers
  let stars = 0;
  let allFullStars = document.querySelectorAll('.fa-star');
  let allHalfStars = document.querySelectorAll('.fa-star-half-o');
  for (let star of allFullStars) {
    stars = stars + 2;
  }
  for (let star of allHalfStars) {
    stars = stars + 1;
  }
  return stars;
}

function loseLife() {
  // This function will first check if there are half stars, if so, they
  // will be empty. If no helf stars then full stars become half stars.
  let halfStar = document.querySelectorAll('.fa-star-half-o');
  if (halfStar.length > 0) {
    halfStar[0].className = 'fa fa-star-o';
    halfStar[0].classList.toggle('lostALife');
    setTimeout(function() {
      halfStar[0].classList.toggle('lostALife');
    }, 400);
  }
  else {
    let allFullStars = document.querySelectorAll('.fa-star');
    allFullStars[allFullStars.length - 1].className = 'fa fa-star-half-o';
    allFullStars[allFullStars.length - 1].classList.toggle('lostALife');
    setTimeout(function() {
      allFullStars[allFullStars.length - 1].classList.toggle('lostALife');
    }, 400);
  }
}

function resetLives() {
  // This function will reset the number of full stars.
  let allEmptyStars = document.querySelectorAll('.fa-star-o');
  let allHalfStars = document.querySelectorAll('.fa-star-half-o');
  for (let star of allEmptyStars) {
    star.className = 'fa fa-star';
  }
  for (let star of allHalfStars) {
    star.className = 'fa fa-star';
  }
}

function playAgain() {
  // Reset Game data
  resetGame();
  // Reseting the display.
  document.querySelector('main').style.display = 'block';
}

function resetGame() {
  // Should reset all changable parts of the game. ie flip all cards and
  // reposition them. Then reset move counters.
  document.querySelectorAll('.moveCounter')[0].value = 0;
  // document.querySelectorAll('.moveCounter')[1].value = 0;
  document.querySelector('.starCounter').value = 0;
  // These couple of lines trigger the rotating reset button animation.
  document.querySelector('#resetButton').classList.toggle('resetButtonPress');
  setTimeout(function() {
    document.querySelector('#resetButton').classList.toggle('resetButtonPress');
  }, 400);
  let allCorrectCards = document.querySelectorAll('.correctCards');
  let allFlippedCards = document.querySelectorAll('.cardReveal');
  for (let card of allFlippedCards) {
    card.classList.toggle('cardReveal');
  }
  for (let card of allCorrectCards) {
    card.classList.toggle('correctCards');
  }
  let allCards = document.querySelectorAll('.gameCard');
  for (let card of allCards) {
    card.style.display = 'none';
  }
  document.querySelector('#gameStartScreen').style.display = 'block';
  resetTimer()
  // Timer reset
  resetLives();
  // Lives reset
  setGame();
}


let singleDSeconds = 0;
let doubleDSeconds = 0;
let minutes = 0;
let gameRunning;

function timer() {
  // Timer display.
  if(gameRunning) {
    document.querySelector('.timer').value = minutes + ":" + doubleDSeconds + "" + singleDSeconds;
    setTimeout(addTime, 1000)
  }
}

function addTime() {
  // This function insures that the correct time will be displays.
  if(gameRunning){
    if (singleDSeconds >= 9) {
      singleDSeconds = 0;
      doubleDSeconds++;
      if(doubleDSeconds >= 6) {
        doubleDSeconds = 0;
        minutes++;
      }
    }
    else {
      singleDSeconds++;
    }
    timer();
  }
}


function resetTimer() {
  // resets all data related to the timer.
  document.querySelector('.timer').value = "0:00";
  singleDSeconds = 0;
  doubleDSeconds = 0;
  minutes = 0;
  gameRunning = false;
}

function runGame() {
  // Stars the timer; Displays all cards and removes starting game message.
  document.querySelector('#gameStartScreen').style.display = 'none';
  let allCards = document.querySelectorAll('.gameCard');
  for (let card of allCards) {
    card.style.display = 'block';
  }
  gameRunning = true;
  timer();
}

setGame();
