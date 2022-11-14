const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const continueButton = document.getElementById("continue");
// Added newGame Button here
const newGameButton = document.getElementById("newGame");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
const wrapper = document.querySelector(".wrapper");

let cards;
let interval;
let firstCard = false;
let secondCard = false;

// Items array
const items = [
    {name:"Bob_Belcher", image:"./Images/Bob_Belcher.jpg"},
    {name:"Calvin_and_Hobbes", image:"./Images/Calvin_and_Hobbes.jpg"},
    {name:"Cheshire_Cat", image:"./Images/Cheshire_Cat.png"},
    {name:"Daria_Morgendorffer", image:"./Images/Daria_Morgendorffer.jpg"},
    {name:"Garfield", image:"./Images/Garfield.png"},
    {name:"Homer_Simpson", image:"./Images/Homer_Simpson.jpg"},
    {name:"Kim_Possible", image:"./Images/Kim_Possible.jpg"},
    {name:"Leela_Turanga", image:"./Images/Leela_Turanga.png"},
    {name:"Mighty_Mouse", image:"./Images/Mighty_Mouse.jpg"},
    {name:"Rick_Sanchez", image:"./Images/Rick_Sanchez.jpg"},
    {name:"Spongebob_Squarepants", image:"./Images/Spongebob_Squarepants.jpeg"},
    {name:"Wolverine", image:"./Images/Wolverine.jpg"}
];

// Initial Time
let seconds = 0,
    minutes = 0;

// Initial Moves
let movesCount = 0, 
    winCount = 0;

// Timer
const timeGenerator = () => {
    seconds += 1;
    if(seconds >= 60){
        minutes += 1;
        seconds = 0;
    }
    // Format time before displaying
    let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
    let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
    timeValue.innerHTML = `<span>Time: </span>${minutesValue}:${secondsValue}`;
};

// Calculating moves
const movesCounter = () => {
    movesCount += 1;
    moves.innerHTML = `<span>Moves: </span>${movesCount}`;
};

// Pick random objects from Items array
const generateRandom = (size = 4) => {
    // Create temporary array
    let tempArray = [...items];
    // Initialize cardValues array
    let cardValues = [];
    // Size should be double (4*4 matrix) since pairs of objects would exist
    size = (size * size) / 2;
    // Random object selection
    for(let i = 0; i < size; i++){
        const randomIndex = Math.floor(Math.random() * tempArray.length);
        cardValues.push(tempArray[randomIndex]);
    // Once selected, remove the object from tempArray
    tempArray.splice(randomIndex, 1);
    }
    return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
    gameContainer.innerHTML = "";
    cardValues = [...cardValues, ...cardValues];
    // Simple shuffle
    cardValues.sort(() => Math.random() - 0.5);
    for(let i = 0; i < size * size; i++){
        /*
        Create Cards
        before => front side (countains question mark)
        after => back side (contains actual image)
        data-card-values is a custom attribute which stores the names
        of the cards to match later
        */
        gameContainer.innerHTML += 
            `<div class="card-container" data-card-value="${cardValues[i].name}">
                <div class="card-before">?</div>
                <div class="card-after"><img src="${cardValues[i].image}" class="image"></div>
            </div>`;
    }

    // Grid
    gameContainer.style.gridTemplateColumns = `repeat(${size}, auto)`;

    // Cards
    cards = document.querySelectorAll(".card-container");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
        //If selected card is not matched yet, then only run (i.e. already matched card when clicked will be ignored)
        if(!card.classList.contains("matched")) {
            // Flip the clicked card
            card.classList.add("flipped");
            // If it is the firstCard (!firstCard since first is ignored)
            if(!firstCard) {
                // So current card will become firstCard
                firstCard = card;
                // Current card's value becomes firstCard
                firstCardValue = card.getAttribute("data-card-value");
            } else {
                // Increment moves since user selected second card
                movesCounter();
                // secondCard value
                secondCard = card;
                let secondCardValue = card.getAttribute("data-card-value");
                if(firstCardValue == secondCardValue){
                    // If both cards match, add matched class so these cards would be ignored next time
                    firstCard.classList.add("matched");
                    secondCard.classList.add("matched");
                    // Set firstCard to false since next card would be first now
                    firstCard = false;
                    // winCount increment as user found a correct match
                    winCount += 1;
                    // Check if winCount = half of cardValues
                    if(winCount == Math.floor(cardValues.length/2)) {
                        result.innerHTML = 
                            `<h2>You Won!</h2> 
                            <h4>Moves: ${movesCount}</h4>
                            <h4>Time: </h4>`
                        winGame();
                    }
                } else {
                    // If cards don't match, flip cards back to normal
                    let [tempFirst, tempSecond] = [firstCard, secondCard];
                    firstCard = false;
                    secondCard = false;
                    let delay = setTimeout(() => {
                        tempFirst.classList.remove("flipped");
                        tempSecond.classList.remove("flipped");
                    }, 1000);
                }
            }
        } 
    });
  });
};

// Start Game
startButton.addEventListener("click", () => {
    movesCount = 0;
    time = 0;
    // Controls button visibility
    controls.classList.add("hide");
    pauseButton.classList.remove("hide");
    startButton.classList.add("hide");
    newGameButton.classList.add("hide");
    wrapper.classList.remove("hide");
    // Start timer
    interval = setInterval(timeGenerator, 1000);
    // Initial moves
    moves.innerHTML = `<span>Moves: </span> ${movesCount}`;
    initializer();
});

newGameButton.addEventListener("click", () => {
    movesCount = 0;
    seconds = 0;
    minutes = 0;
    // Controls button visibility
    controls.classList.add("hide");
    pauseButton.classList.remove("hide");
    startButton.classList.add("hide");
    wrapper.classList.remove("hide");
    // Start timer
    interval = setInterval(timeGenerator, 1000);
    // Initial moves
    moves.innerHTML = `<span>Moves: </span> ${movesCount}`;
    initializer();
});


// Initialize values and calls functions
const initializer = () => {
    result.innerText = "";
    winCount = 0;
    let cardValues = generateRandom();
    console.log(cardValues);
    matrixGenerator(cardValues);
};

initializer();

// Pause Game
pauseButton.addEventListener("click", (pauseGame = () => {
    controls.classList.remove("hide");
    pauseButton.classList.add("hide");
    continueButton.classList.remove("hide");
    newGameButton.classList.remove("hide");
}));

// Continue Game (from Pause)
continueButton.addEventListener("click", () => {
    controls.classList.add("hide");
    pauseButton.classList.remove("hide");
    continueButton.classList.add("hide");
    newGameButton.classList.add("hide");
    clearInterval(interval);
});

// Un-hides New Game button upon finding all matches
function winGame() {
    controls.classList.remove("hide");
    pauseButton.classList.add("hide");
    newGameButton.classList.remove("hide");
    clearInterval(interval);
};