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
    document.querySelectorAll('.moveCounter')[1].value = moves;
  }
  if(document.querySelectorAll('.correctCards').length === 16) {
    document.querySelector('main').style.display = 'none';
    document.querySelector('#winnerContent').style.display = 'block';
  }
  let emptyStars = document.querySelectorAll('.fa-star-o');
  // if there are three empty stars, user has lost.
  if (emptyStars.length === 3) {
    document.querySelector('main').style.display = 'none';
    document.querySelector('#loserContent').style.display = 'block';
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
    loseLife();
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

function loseLife() {
  // This function will first check if there are half stars, if so, they
  // will be empty. If no helf stars then full stars become half stars.
  let halfStar = document.querySelectorAll('.fa-star-half-o');
  if (halfStar.length > 0) {
    halfStar[0].className = 'fa fa-star-o';
  }
  else {
    let allFullStars = document.querySelectorAll('.fa-star');
    allFullStars[allFullStars.length - 1].className = 'fa fa-star-half-o';
  }
}

function resetLives() {
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
  // Resets the two move counters.
  resetGame();
  // Reseting the display.
  document.querySelector('main').style.display = 'block';
  document.querySelector('#winnerContent').style.display = 'none';
  document.querySelector('#loserContent').style.display =  'none';
}

function resetGame(e) {
  // Should reset all changable parts of the game. ie flip all cards and
  // reposition them. Then reset move counters.
  document.querySelectorAll('.moveCounter')[0].value = 0;
  document.querySelectorAll('.moveCounter')[1].value = 0;
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
  resetLives();
  // Lives reset
  setGame();
  runGame();
}

function runGame() {
  // Mainly just adds event listeners, called every game reset or intialization.
  let game = document.querySelector('#gameContainer');
  let playButtons = document.querySelectorAll('button');
  let reset = document.querySelector('#resetButton');
  game.addEventListener('click', gameClick);
  playButtons[0].addEventListener('click', playAgain);
  playButtons[1].addEventListener('click', playAgain);
  reset.addEventListener('click', resetGame);
}

setGame();
runGame();
