//target all elements to save to constants
const page1btn = document.querySelector("#page1btn");
const page2btn = document.querySelector("#page2btn");
const page3btn = document.querySelector("#page3btn");
const page1btn2 = document.querySelector("#page1btn2");
const page2btn2 = document.querySelector("#page2btn2");
const page3btn2 = document.querySelector("#page3btn2");
const mainmenu = document.querySelector("nav");
const mainmenu2 = document.querySelector("#inpagenav");
const bigimage = document.querySelector("#mainimage");
const docheader = document.querySelector("header");
const maincontent = document.querySelector("main");
let minigame = document.querySelector("#memorygame")
let allpages = document.querySelectorAll(".page");
let cards = document.querySelectorAll(".memorycard");

//ok its not actually the mambo audio i just got lazy to change the variable name
let mambo = new Audio("audio/squeak.mp3");
let squishy = document.querySelectorAll(".squishable");
let score = 0;
let scoreelement = document.getElementById("score");
let submit = document.querySelector("#submitbutton");
let comment = document.getElementById("comment");
let qrcode = document.querySelector("#qrcontainer");
let qrbutton = document.querySelector("#qrbutton");

// for rwd purposes. clientwidth gets the viewport width. i think. thats what stack overflow said
// either way it works fine for rwd :thumbsup:
let vw = document.documentElement.clientWidth;

//memory game stuff
let hasflippedcard = false;
let firstcard, secondcard;
let lockboard = false;
//switched to let in the middle because i figured why not. let is more general use anyways
//like might as well yknow

function hideall() { //function to hide all pages
    // for each page in pages hide page . and hide the minigame too
    for (let onepage of allpages)
    { 
        onepage.style.display = "none"; 
    }
    minigame.style.display = "none";
}

function hidemenu() {
    //the vw thing is viewport width. using this for rwd so my image doesn't mess itself up 
    //on different widths
    if (parseInt(vw) > 800)
    {
        docheader.style.marginLeft = "32vw";
    }
    else
    {
        docheader.style.marginLeft = "10vw";
    }

    docheader.style.marginTop = "2vh";
    mainmenu.style.display = "none";
    bigimage.style.width = "300px";
    mainmenu2.style.display = "flex";
    maincontent.style.display = "block";
}

function showmenu() {

    if (parseInt(vw) > 800)
    {
        docheader.style.marginLeft = "50vw";
        docheader.style.marginTop = "10vh";
    }
    else
    {
        docheader.style.marginLeft = "10vw";
        docheader.style.marginTop = "15vh";
    }

    mainmenu.style.display = "block";
    bigimage.style.width = "70%";
    mainmenu2.style.display = "none";
    maincontent.style.display = "none";
}

function show(pgno)
{ //function to show selected page no
    hideall();
    //select the page based on the parameter passed in
    let onepage = document.querySelector("#page" + pgno);
    onepage.style.display = "block"; //show the page
    if (parseInt(pgno) == 3)
    {
        minigame.style.display = "block";
    }
}

// flips the card when clicked and then checks various stuff that i probably should have put in functions but did not #lmao
function flipcard()
{
    //lockboard is for an edge case where if you click too fast and click 
    //more cards before the first two unflip then the first two just wont unflip
    //the second condition is for if the same card is clicked both times, since 
    //it should also be an invalid case since its literally the same card
    //in both cases we just return to stop the rest of the function from executing
    if (lockboard == true || this === firstcard)
    {
        return;
    }

    //adds the flip class to the card that is flipped
    //this is related to animating the flip motion in css
    this.classList.add('flip');

    //if hasflippedcard is false that means this is the first card of the pair
    //and then we set hasflippedcard to true for the second card
    //thats how the differentiation between the first and second card works and how
    //the code knows when to do what
    if (hasflippedcard == false)
    {
        hasflippedcard = true;
        //assigns the clicked card to the firstcard variable
        firstcard = this;
    }
    else
    {
        //next card will be the first card of the next pair, so we set hasflippedcard back to false
        hasflippedcard = false;
        // assigns this card to the secondcard variable
        secondcard = this;

        //increments the number of pairs flipped total, whether matching or not
        score++;
        scoreelement.innerHTML = "Pairs flipped: " + score;

        //this is why i was using data
        //if the first card's data is equal to the second card's data this means it match
        if (firstcard.dataset.card === secondcard.dataset.card)
        {
            //after this you shouldnt be able to click the cards anymore so remove event listener
            firstcard.removeEventListener('click', flipcard);
            secondcard.removeEventListener('click', flipcard);
        }
        else
        {
            // if it no match, lock the board and prevent any other cards from being clicked
            //until the first two unflip
            lockboard = true; 

            //1.5 second wait until the cards unflip themselves
            setTimeout(function() {
                //remove flip class to unflip them
                firstcard.classList.remove('flip');
                secondcard.classList.remove('flip');
                
                hasflippedcard = false;
                lockboard = false;
                //set both variables back to null for the next pair
                firstcard = null;
                secondcard = null;
            }, 1500);
        }
    }
}

//form data thing
//when this function is called it reads the value of the choice
//and then puts stuff in the comment based on the thing
function readvalue()
{
    let choice = document.querySelector("select");
    //if value is nothing then just return
    //literal nothing btw
    //like the value="nothing"
    if (choice.value == "nothing")
    {
        return;
    }
    else if (choice.value == "yes")
    {
        comment.innerHTML = "Yay!!!";
    }
    else if (choice.value == "no")
    {
        comment.innerHTML = "noooo :(";
    }
    else
    {
        comment.innerHTML = "surely thats not your final answer?";
    }
}

//executes function immediately after definition to shuffle the cards for the game
(function shuffle()
{
    for (let card of cards)
    {
        let randompos = Math.floor(Math.random() * 12);
        card.style.order = randompos;
    }
})();

/*Listen for clicks on the buttons, assign anonymous
eventhandler functions to call show function*/
page1btn.addEventListener("click", function () {
    show(1);
    hidemenu();
});
page1btn2.addEventListener("click", function () {
    show(1);
    hidemenu();
});

page2btn.addEventListener("click", function () {
    show(2);
    hidemenu();
});
page2btn2.addEventListener("click", function () {
    show(2);
    hidemenu();
});

page3btn.addEventListener("click", function () {
    show(3);
    hidemenu();
});
page3btn2.addEventListener("click", function () {
    show(3);
    hidemenu();
});

//this basically just makes it so clicking on the main image you can go back
//to the main menu
bigimage.addEventListener("click", function() {
    showmenu();
    hideall();
});

//for each squishable thingy in the html add an event listener for both click and animationend
//this is because the classlist is being used here for animations again
//when squished is added the thingy is squished as an animation
//then removing it allows the thing to be squished again once the animation is over
//since its just a brief and not looping animation
for (let squish of squishy)
{
    squish.addEventListener("click", function() {
        mambo.play();
        squish.classList.add("squished");
    });
    squish.addEventListener("animationend", function() {
        squish.classList.remove("squished");
    })
}

//for each card add eventlistener for when card is clicked to flip it
for (let card of cards)
{
    card.addEventListener('click', flipcard);
}

//button that when clicked reads the value in the select
submit.addEventListener("click", readvalue);

//when qrcode is clicked hide qrcode and show button
qrcode.addEventListener("click", function () {
    qrcode.style.display = "none";
    qrbutton.style.display = "block";
});

//when button clicked hide qr code
qrbutton.addEventListener("click", function () {
    qrbutton.style.display = "none";
    qrcode.style.display = "block";
});

hideall();