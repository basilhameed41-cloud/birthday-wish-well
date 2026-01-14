// Game Data
const gameData = {
    currentQuestion: 0,
    score: 0,
    userAnswers: [],
    musicPlaying: false,
    giftOpened: false
};

// Questions Data
const questions = [
    {
        question: "What's your idea of a perfect birthday celebration?",
        options: [
            { text: "Quiet dinner with close friends", value: 3, hint: "Intimate & meaningful" },
            { text: "Big party with everyone", value: 1, hint: "Loud & fun" },
            { text: "Adventure or travel", value: 2, hint: "Exciting & new" },
            { text: "Relaxing day with self-care", value: 3, hint: "Peaceful & cozy" }
        ]
    },
    {
        question: "Which birthday gift would make you smile the most?",
        options: [
            { text: "Something handmade/personalized", value: 3, hint: "Thoughtful touch" },
            { text: "A good book or music", value: 2, hint: "Creative soul" },
            { text: "Surprise experience/tickets", value: 2, hint: "Memory maker" },
            { text: "Chocolates or sweet treats", value: 1, hint: "Sweet tooth!" }
        ]
    },
    {
        question: "How do you feel about birthdays?",
        options: [
            { text: "Love them! Celebrate all month!", value: 1, hint: "Life of the party" },
            { text: "Nice occasion to meet loved ones", value: 3, hint: "Social connector" },
            { text: "Reflective time for new beginnings", value: 2, hint: "Deep thinker" },
            { text: "Just another day, but cake is good!", value: 1, hint: "Practical realist" }
        ]
    }
];

// Result messages based on score
const resultMessages = [
    { min: 0, max: 3, message: "You're the life of the party! 🎉 Your energy is contagious!" },
    { min: 4, max: 6, message: "You appreciate meaningful connections and beautiful moments. ✨" },
    { min: 7, max: 9, message: "You have a thoughtful soul who values depth and authenticity. 💖" }
];

// Gift messages
const giftMessages = [
    "🎁 Gift 1: The gift of good conversations and getting to know an amazing person!",
    "🎁 Gift 2: A virtual bouquet of appreciation for your wonderful existence! 🌸",
    "🎁 Gift 3: A promise that this year will bring you beautiful new beginnings!"
];

// Final message
const finalMessage = `Even though we're just getting to know each other,<br>
I already know you deserve the happiest birthday!<br>
Here's to new beginnings, beautiful conversations,<br>
and a year filled with joy, laughter, and amazing memories.<br><br>
<strong>Happy Birthday! 🎂🎈</strong><br><br>
<span style="color: #ff4081;">May your special day be as wonderful as you are!</span>`;

// Initialize game
function initGame() {
    gameData.currentQuestion = 0;
    gameData.score = 0;
    gameData.userAnswers = [];
    gameData.giftOpened = false;
    
    updateProgress();
    loadQuestion();
    updateScore();
}

// Start game
function startGame() {
    document.getElementById('intro').classList.remove('active');
    document.getElementById('game').classList.add('active');
    initGame();
}

// Update progress bar
function updateProgress() {
    const progress = ((gameData.currentQuestion + 1) / questions.length) * 100;
    document.getElementById('progress').style.width = `${progress}%`;
    document.getElementById('q-num').textContent = gameData.currentQuestion + 1;
}

// Load question
function loadQuestion() {
    const q = questions[gameData.currentQuestion];
    document.getElementById('question-text').textContent = q.question;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    q.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        if (gameData.userAnswers[gameData.currentQuestion] === index) {
            optionElement.classList.add('selected');
        }
        
        optionElement.innerHTML = `
            <span class="option-text">${option.text}</span>
            <span class="option-hint">${option.hint}</span>
        `;
        
        optionElement.onclick = () => selectOption(index);
        optionsContainer.appendChild(optionElement);
    });
    
    // Update navigation buttons
    document.getElementById('prev-btn').style.display = gameData.currentQuestion > 0 ? 'flex' : 'none';
    document.getElementById('next-btn').textContent = gameData.currentQuestion === questions.length - 1 ? 'See Results!' : 'Next';
}

// Select option
function selectOption(index) {
    const options = document.querySelectorAll('.option');
    options.forEach(opt => opt.classList.remove('selected'));
    options[index].classList.add('selected');
    
    gameData.userAnswers[gameData.currentQuestion] = index;
    
    // Auto-advance on mobile for better UX
    if (window.innerWidth <= 768) {
        setTimeout(() => nextQuestion(), 500);
    }
}

// Next question
function nextQuestion() {
    if (gameData.userAnswers[gameData.currentQuestion] === undefined) {
        alert("Please select an answer before continuing!");
        return;
    }
    
    // Calculate score for current question
    const selectedOption = questions[gameData.currentQuestion].options[gameData.userAnswers[gameData.currentQuestion]];
    gameData.score += selectedOption.value;
    
    if (gameData.currentQuestion < questions.length - 1) {
        gameData.currentQuestion++;
        updateProgress();
        loadQuestion();
        updateScore();
    } else {
        showResults();
    }
}

// Previous question
function prevQuestion() {
    if (gameData.currentQuestion > 0) {
        gameData.currentQuestion--;
        updateProgress();
        loadQuestion();
        updateScore();
    }
}

// Update score display
function updateScore() {
    document.getElementById('score').textContent = gameData.score;
}

// Show results
function showResults() {
    document.getElementById('game').classList.remove('active');
    document.getElementById('results').classList.add('active');
    
    document.getElementById('final-score').textContent = gameData.score;
    
    // Show appropriate result message
    let resultMsg = resultMessages[0].message;
    for (const msg of resultMessages) {
        if (gameData.score >= msg.min && gameData.score <= msg.max) {
            resultMsg = msg.message;
            break;
        }
    }
    
    document.getElementById('result-message').textContent = resultMsg;
    
    // Add confetti
    createConfetti();
    
    // Play music if not already playing
    if (!gameData.musicPlaying) {
        toggleMusic();
    }
}

// Create confetti effect
function createConfetti() {
    const confettiContainer = document.querySelector('.confetti');
    confettiContainer.innerHTML = '';
    
    const emojis = ['🎉', '🎊', '🎂', '🎈', '🥳', '✨', '💖', '🌸'];
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        confetti.style.position = 'absolute';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.fontSize = `${Math.random() * 20 + 20}px`;
        confetti.style.opacity = Math.random() * 0.5 + 0.5;
        confetti.style.animation = `confettiFall ${Math.random() * 2 + 2}s linear ${Math.random() * 1}s infinite`;
        
        confettiContainer.appendChild(confetti);
    }
}

// Open gift
function openGift() {
    if (gameData.giftOpened) return;
    
    const giftBox = document.querySelector('.gift-box');
    const giftMessage = document.getElementById('gift-message');
    const finalMsg = document.getElementById('final-message');
    
    giftBox.classList.add('open');
    gameData.giftOpened = true;
    
    // Show gift messages one by one
    let delay = 800;
    giftMessages.forEach((msg, index) => {
        setTimeout(() => {
            const p = document.createElement('p');
            p.textContent = msg;
            p.style.animation = 'fadeIn 0.8s ease';
            giftMessage.appendChild(p);
        }, delay * (index + 1));
    });
    
    // Show final message
    setTimeout(() => {
        giftMessage.classList.add('show');
        finalMsg.innerHTML = finalMessage;
        finalMsg.style.display = 'block';
    }, delay * (giftMessages.length + 1));
}

// Restart game
function restartGame() {
    document.getElementById('results').classList.remove('active');
    document.getElementById('intro').classList.add('active');
    
    // Reset gift message
    document.getElementById('gift-message').innerHTML = '';
    document.getElementById('gift-message').classList.remove('show');
    document.getElementById('final-message').innerHTML = '';
    document.getElementById('final-message').style.display = 'none';
    
    // Reset gift box
    const giftBox = document.querySelector('.gift-box');
    giftBox.classList.remove('open');
}

// Share score
function shareScore() {
    const shareText = `I scored ${gameData.score}/9 on the Birthday Discovery Game! 🎂 Play here: [Your Website URL]`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Birthday Discovery Game',
            text: shareText,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(shareText);
        alert('Score copied to clipboard! Share it with friends! 🎉');
    }
}

// Music control
function toggleMusic() {
    const music = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');
    const musicText = document.getElementById('music-text');
    
    if (gameData.musicPlaying) {
        music.pause();
        musicBtn.innerHTML = '<i class="fas fa-music"></i> <span id="music-text">Play Music</span>';
        gameData.musicPlaying = false;
    } else {
        music.play().catch(e => console.log("Autoplay prevented:", e));
        musicBtn.innerHTML = '<i class="fas fa-volume-up"></i> <span id="music-text">Pause Music</span>';
        gameData.musicPlaying = true;
    }
}

// Floating hearts
function createHearts() {
    const container = document.querySelector('.floating-hearts');
    const hearts = ['❤️', '💖', '💕', '💗', '💓'];
    
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.position = 'absolute';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.top = `${Math.random() * 100}%`;
        heart.style.fontSize = `${Math.random() * 20 + 15}px`;
        heart.style.opacity = Math.random() * 0.3 + 0.1;
        heart.style.animation = `float ${Math.random() * 10 + 10}s infinite linear ${Math.random() * 5}s`;
        
        container.appendChild(heart);
    }
}

// Initialize on load
window.onload = function() {
    createHearts();
    
    // Auto-play music on user interaction
    document.addEventListener('click', function initMusic() {
        const music = document.getElementById('bg-music');
        music.volume = 0.3;
        document.removeEventListener('click', initMusic);
    });
};