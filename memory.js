// get Name Variables
let getName = document.querySelector(".get-name");
let overLayer = document.querySelector(".over-layer");
let myInput = document.querySelector(".get-name input");
let needTime = getName.querySelector("[name='needTime']");
let ok = document.querySelector(".get-name .ok");
let close = document.querySelector(".get-name .close");

// game
let name = document.querySelector(".hello span");
let wrongNum = document.querySelector(".wrong span");
let timer = document.querySelector(".game .timer .count");
let blocksContainer = document.querySelector(".blocks-container");

// score And congrat
let score = document.querySelector(".score");
let currentScore = score.querySelector(".current");
let totalScore = score.querySelector(".total");
let over = document.querySelector(".game .over");
let congrat = document.querySelector(".congrat");

// played
let played = document.querySelector(".played");
let player = document.querySelector(".played .player");

myInput.focus();

// take yoy name and time when click ok
ok.onclick = () => {
  myInput.focus();
  if (myInput.value.trim() !== "") {
    needTime.focus();
  }
  if (needTime.value > 0) {
    myInput.focus();
    myInput.previousElementSibling.textContent = "Please Write Your Name";
  }

  if (myInput.value.trim() !== "" && needTime.value > 0) {
    name.textContent = myInput.value;
    timer.textContent = needTime.value;
    getName.style.display = "none";
    overLayer.style.display = "none";
    show(block);
  }
  if (myInput.value.trim() == "") {
    myInput.previousElementSibling.textContent = "Please Write Your Name";
  }

  if (needTime.value < 0) {
    needTime.previousElementSibling.textContent =
      "Please Write Positive Number";
  }
};

// on press enter as ok.onclick
document.onkeydown = (e) => {
  if (e.key === "Enter") {
    ok.click();
  }
};

// if click close تعامل
close.onclick = () => {
  name.textContent = "Unknown";
  timer.textContent = 30;
  getName.style.display = "none";
  overLayer.style.display = "none";
  show(block);
};

// window.localStorage.clear();
let playersData = window.localStorage.getItem("tasksStored")
  ? JSON.parse(window.localStorage.getItem("tasksStored"))
  : [];
if (window.localStorage.getItem("playersData")) {
  JSON.parse(window.localStorage.getItem("playersData")).forEach((e) => {
    create(e);
  });
}

// my Game Texts == Update here if you need more
let myTextGameArr = [
  "img/avatar-01.png",
  "img/avatar-02.png",
  "img/avatar-03.png",
  "img/avatar-04.png",
  "img/avatar-05.png",
  "img/avatar-06.png",
  "img/team-01.jpg",
  "img/team-02.jpg",
  //   "img/team-03.jpg",
  //   "img/team-04.jpg",
  //   "img/team-07.jpg",
  //   "img/team-08.jpg",
];

// total score num
totalScore.textContent = myTextGameArr.length;
myTextGameArr = myTextGameArr.concat(myTextGameArr); // another copy
let len = myTextGameArr.length;

// creating blocks
for (i = 0; i < len; i++) {
  let block = document.createElement("li");
  block.classList.add("block");

  let what = document.createElement("span");
  let img = document.createElement("img");
  what.classList.add("what");
  what.appendChild(document.createTextNode("?"));
  let randomIndex = Math.random() * myTextGameArr.length;
  img.setAttribute("src", myTextGameArr[Math.floor(randomIndex)]);

  // don't repeat same text ==> delet it
  myTextGameArr.splice(randomIndex, 1);

  block.append(what, img);
  blocksContainer.append(block);
}

let block = document.querySelectorAll(".block");

// for showing the texts for a while afetr clicking ok
function show(ele) {
  ele.forEach((e) => {
    e.style.transform = "rotateY(180deg)";
    e.style.pointerEvents = "none";
    setTimeout(() => {
      // hide
      e.style.transform = "none";
      e.style.pointerEvents = "all";
    }, 3000);
  });

  // create show end start timer
  setTimeout(() => {
    count();
  }, 3000);
}

// timer
function count() {
  let count = setInterval(() => {
    timer.textContent = parseInt(timer.textContent) - 1;
    // afetr time end check
    if (timer.textContent == "0") {
      clearInterval(count);
      // fail
      if (currentScore.textContent != totalScore.textContent) {
        over.style.display = "block";
        end(block);
      } else {
        // success
        congrat.style.display = "block";
        end(block);
      }
    }
    // if end game before timer end
    if (currentScore.textContent == totalScore.textContent) {
      congrat.style.display = "block";
      end(block);
      clearInterval(count);
    }
  }, 1000);
}

function end(ele) {
  // for end game prevent click
  ele.forEach((e) => {
    e.style.pointerEvents = "none";
  });

  // put player in played
  create(data({}));
}

// create playersData Object
function data(e) {
  (e.name = name.textContent),
    (e.endScore = currentScore.textContent),
    (e.totalScore = totalScore.textContent),
    (e.endWrong = wrongNum.textContent),
    (e.timeTaken = (+needTime.value || 30) - +timer.textContent);
  return e;
}

// played box
function create(e) {
  playerClone = player.cloneNode(true);
  playerClone.querySelector(".name").textContent = e.name;
  playerClone.querySelector(".end-score span").textContent = e.endScore;
  playerClone.querySelector(".end-score .total").textContent = e.totalScore;
  playerClone.querySelector(".end-wrong span").textContent = e.endWrong;
  playerClone.querySelector(".time-taken span").textContent = `${e.timeTaken}`;

  playerClone.style.display = "flex";
  played.append(playerClone);
  played.style.display = "block";

  playersData.push(e);
  window.localStorage.setItem("playersData", JSON.stringify(playersData));
}

// for click only fon Two
let time = 0;
// check for waiting  the rotate if texts different
let check = true;

block.forEach((e) => {
  e.onclick = (ele) => {
    if (check) {
      time++;
      if (time <= 2) {
        // ele.target.parentElement.style.transform = "rotateY(180deg)";
        e.style.transform = "rotateY(180deg)";
        // for select the clicked = (you can too add class clicked on it)
        time === 1 ? (one = e) : (two = e);
      }

      // checking
      if (time === 2 && one != two) {
        // different texts
        if (
          one.querySelector("img").getAttribute("src") !==
          two.querySelector("img").getAttribute("src")
        ) {
          // for don't doing the click event unless setTimeout ended
          check = false;
          wrongNum.innerHTML = +wrongNum.innerHTML + 1;
          document.querySelector(".fail").play();

          setTimeout(() => {
            // return to default => no rotate
            one.style.transform = "none";
            two.style.transform = "none";
            // return time and check
            time = 0;
            check = true;
          }, 1000);
        } else {
          // remove pointer from text
          document.querySelector(".success").play();
          one.querySelector("img").style.cursor = "auto";
          two.querySelector("img").style.cursor = "auto";

          // same text => prevent more click on them updating the click event above
          // also don't change the rotating done for them
          one.onclick = (e) => {
            e.preventDefault();
          };
          two.onclick = (e) => {
            e.preventDefault();
          };
          time = 0;
          currentScore.textContent = +currentScore.textContent + 1;
        }
      } else {
        // for don't increase time if click on same element
        time = 1;
      }
    }
  };
});
