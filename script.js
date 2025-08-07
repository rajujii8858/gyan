let gridSize = 4;  // Default Normal (4x4)
let moves = 0, timer = 0, interval = null;
let tiles = [];
let currentImg = '';

const container = document.getElementById('puzzle-container');
const moveSound = document.getElementById('moveSound');
const winSound = document.getElementById('winSound');
const solveBtn = document.getElementById('solveBtn'); // हल दिखाने का बटन

// Sound URLs mapping per image (यहाँ अपनी इमेज और साउंड के लिंक भरें)
const soundMap = {
  'https://images.squarespace-cdn.com/content/v1/5caaad10e5f7d161a45a641b/1585772040760-7IRK0I6J66DJHNMU3G05/Hanuman.jpg': {
    move: 'S.MP3',
    win: 'R.MP3'
  },
  'https://www.tallengestore.com/cdn/shop/products/Hanuman_And_Sriram_3fe96b74-566d-4548-8f48-423d7adcb30b.jpg?v=1569997122.JPG': {
    move: 'S.MP3',
    win: 'R.MP3'
  },
  'https://sakhashree.com/wp-content/uploads/2023/04/significance-of-hanuman-29.jpg': {
    move: 'S.MP3',
    win: 'R.MP3'
  },
  'IMAGE4_LINK': {
    move: 'S.MP3',
    win: 'R.MP3'
  },
  'IMAGE5_LINK': {
    move: 'MOVE_SOUND_5_LINK',
    win: 'WIN_SOUND_5_LINK'
  },
  'IMAGE6_LINK': {
    move: 'MOVE_SOUND_6_LINK',
    win: 'WIN_SOUND_6_LINK'
  },
  'IMAGE7_LINK': {
    move: 'MOVE_SOUND_7_LINK',
    win: 'WIN_SOUND_7_LINK'
  },
  'IMAGE8_LINK': {
    move: 'MOVE_SOUND_8_LINK',
    win: 'WIN_SOUND_8_LINK'
  },
  'IMAGE9_LINK': {
    move: 'MOVE_SOUND_9_LINK',
    win: 'WIN_SOUND_9_LINK'
  },
  'IMAGE10_LINK': {
    move: 'MOVE_SOUND_10_LINK',
    win: 'WIN_SOUND_10_LINK'
  },
};

const DEFAULT_MOVE_SOUND = 'DEFAULT_MOVE_SOUND_LINK'; // डिफॉल्ट मूव साउंड
const DEFAULT_WIN_SOUND = 'DEFAULT_WIN_SOUND_LINK';   // डिफॉल्ट विन साउंड

// इमेज के अनुसार साउंड सेट करें
function updateSoundsForImage(imgLink) {
  if (soundMap[imgLink]) {
    moveSound.src = soundMap[imgLink].move;
    winSound.src = soundMap[imgLink].win;
  } else {
    moveSound.src = DEFAULT_MOVE_SOUND;
    winSound.src = DEFAULT_WIN_SOUND;
  }
}

// मोड चुने पर कॉल करें
function setMode() {
  const modeSelect = document.getElementById('modeSelect');
  gridSize = parseInt(modeSelect.value, 10);
  startGame();
}

// इमेज बदले पर कॉल करें
function changeImage() {
  const imgSelect = document.getElementById('imgSelect');
  currentImg = imgSelect.value;
  updateSoundsForImage(currentImg);
  startGame();
}

// गेम शुरू करने वाली मुख्य फंक्शन
function startGame() {
  const imgsel = document.getElementById('imgSelect');
  currentImg = imgsel.value;

  if (!currentImg || currentImg.trim() === '') {
    alert('कृपया एक इमेज चुनें!');
    return;
  }

  updateSoundsForImage(currentImg);

  container.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

  moves = 0;
  timer = 0;
  document.getElementById('moves').innerText = 'चालें: 0';
  document.getElementById('timer').innerText = 'समय: 0s';

  clearInterval(interval);
  interval = setInterval(() => {
    timer++;
    document.getElementById('timer').innerText = `समय: ${timer}s`;
  }, 1000);

  const n = gridSize * gridSize;
  tiles = [];
  for (let i = 0; i < n; i++) tiles.push(i);

  do {
    tiles = shuffleArray([...tiles]);
  } while (!isSolvable(tiles));

  drawPuzzle();
}

// पज़ल बनाना और दिखाना
function drawPuzzle() {
  container.innerHTML = '';
  const tileSize = gridSize === 3 ? 90 : gridSize === 4 ? 68 : 54; // tile size adapte मोड के हिसाब से

  container.style.width = `${tileSize * gridSize + (gridSize - 1)}px`;
  container.style.height = `${tileSize * gridSize + (gridSize - 1)}px`;

  tiles.forEach((t, i) => {
    let x = t % gridSize;
    let y = Math.floor(t / gridSize);

    let d = document.createElement('div');
    d.className = 'tile' + (t === tiles.length - 1 ? ' hide' : '');
    d.style.backgroundImage = `url('${currentImg}')`;
    d.style.backgroundPosition = `-${x * tileSize}px -${y * tileSize}px`;
    d.style.width = `${tileSize}px`;
    d.style.height = `${tileSize}px`;
    d.style.backgroundSize = `${tileSize * gridSize}px ${tileSize * gridSize}px`;
    d.addEventListener('click', () => moveTile(i));
    container.appendChild(d);
  });
}

// टाइल मूव करने की फंक्शन
function moveTile(idx) {
  let blankIdx = tiles.indexOf(tiles.length - 1);
  let x1 = idx % gridSize,
    y1 = Math.floor(idx / gridSize);
  let x2 = blankIdx % gridSize,
    y2 = Math.floor(blankIdx / gridSize);
  if (Math.abs(x1 - x2) + Math.abs(y1 - y2) !== 1) return;

  [tiles[idx], tiles[blankIdx]] = [tiles[blankIdx], tiles[idx]];
  moves++;
  document.getElementById('moves').innerText = `चालें: ${moves}`;

  if (moveSound) {
    moveSound.currentTime = 0;
    moveSound.play();
  }

  drawPuzzle();

  if (isSolved()) finishGame();
}

// गेम खत्म होने पर फंक्शन
function finishGame() {
  clearInterval(interval);
  setTimeout(() => {
    if (winSound) {
      winSound.currentTime = 0;
      winSound.play();
    }
    setTimeout(
      () =>
        alert(
          `शाबाश!\nआपने ${moves} चालों और ${timer} सेकंड में Puzzle हल किया!`
        ),
      300
    );
  }, 200);
}

// रीसेट गेम
function resetGame() {
  startGame();
}

// हल दिखाने वाली फंक्शन (solution दिखाए)
function showSolution() {
  const n = gridSize * gridSize;
  tiles = [];
  for (let i = 0; i < n; i++) tiles.push(i);
  drawPuzzle();
}

// हल दिखाओ बटन के लिए long press event handling
let solveTimeout;

solveBtn.addEventListener('mousedown', startShowingSolution);
solveBtn.addEventListener('touchstart', startShowingSolution);

solveBtn.addEventListener('mouseup', stopShowingSolution);
solveBtn.addEventListener('mouseleave', stopShowingSolution);
solveBtn.addEventListener('touchend', stopShowingSolution);
solveBtn.addEventListener('touchcancel', stopShowingSolution);

function startShowingSolution() {
  solveTimeout = setTimeout(() => {
    showSolution();
  }, 800); // 800ms बाद हल दिखाओ
}

function stopShowingSolution() {
  clearTimeout(solveTimeout);
  resetGame(); // बटन छोड़ते ही रीसेट कर दो
}

// पज़ल सॉल्व है या नहीं चेक
function isSolved() {
  return tiles.every((t, i) => t === i);
}

// Fisher-Yates shuffle
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// पज़ल solvable है या नहीं यह चेक करें
function isSolvable(arr) {
  let inv = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (
        arr[i] !== arr.length - 1 &&
        arr[j] !== arr.length - 1 &&
        arr[i] > arr[j]
      )
        inv++;
    }
  }
  let size = gridSize;
  let blankRow = Math.floor(arr.indexOf(size * size - 1) / size);
  if (size % 2 === 1) return inv % 2 === 0;
  else return (inv + size - blankRow) % 2 === 0;
}

// पेज load होते ही डिफॉल्ट सेटिंग के साथ गेम शुरू हो जाए
window.onload = () => {
  document.getElementById('modeSelect').value = '4'; // Normal मोड डिफॉल्ट
  document.getElementById('imgSelect').selectedIndex = 0;
  changeImage(); // इमेज सेट करें + गेम शुरू करें
};
