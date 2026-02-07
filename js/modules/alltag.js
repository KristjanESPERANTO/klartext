// Alltag Modul - "Dein Alltag ist politisch"

let questionsData = null;
let sdgsData = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let allThemes = {};
let collectedSDGs = new Set();

// Initialize module
document.addEventListener('DOMContentLoaded', async () => {
    await loadQuestions();
    await loadSDGs();
    setupEventListeners();
});

// Load questions from JSON
async function loadQuestions() {
    try {
        const response = await fetch('../data/alltag-questions.json');
        questionsData = await response.json();

        // Update UI with module info
        document.getElementById('moduleTitle').textContent = questionsData.titel;
        document.getElementById('moduleDescription').textContent = questionsData.beschreibung;
        document.getElementById('totalQuestions').textContent = questionsData.fragen.length;
    } catch (error) {
        console.error('Fehler beim Laden der Fragen:', error);
        alert('Fehler beim Laden der Fragen. Bitte lade die Seite neu.');
    }
}

// Load SDGs data
async function loadSDGs() {
    try {
        const response = await fetch('../data/sdgs.json');
        sdgsData = await response.json();
    } catch (error) {
        console.error('Fehler beim Laden der SDGs:', error);
    }
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('startModule').addEventListener('click', startModule);
    document.getElementById('nextBtn').addEventListener('click', nextQuestion);
    document.getElementById('prevBtn').addEventListener('click', prevQuestion);
    document.getElementById('restartBtn')?.addEventListener('click', restartModule);
    document.getElementById('shareBtn')?.addEventListener('click', shareResults);
}

// Start the module
function startModule() {
    showSection('questions');
    displayQuestion();
}

// Display current question
function displayQuestion() {
    const question = questionsData.fragen[currentQuestionIndex];

    // Update progress
    const progress = ((currentQuestionIndex + 1) / questionsData.fragen.length) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;

    // Update question text
    document.getElementById('questionText').textContent = question.frage;

    // Create option buttons
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    question.optionen.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.textContent = option.text;
        button.dataset.index = index;

        // Check if this option was previously selected
        if (userAnswers[currentQuestionIndex] === index) {
            button.classList.add('selected');
            document.getElementById('nextBtn').disabled = false;
        }

        button.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(button);
    });

    // Update navigation buttons
    document.getElementById('prevBtn').style.visibility = currentQuestionIndex > 0 ? 'visible' : 'hidden';
    document.getElementById('nextBtn').textContent =
        currentQuestionIndex === questionsData.fragen.length - 1 ? 'Ergebnis anzeigen →' : 'Weiter →';

    // Hide explanation initially
    document.getElementById('explanation').style.display = 'none';
}

// Select an option
function selectOption(index) {
    // Remove previous selection
    document.querySelectorAll('.option-button').forEach(btn => {
        btn.classList.remove('selected');
    });

    // Add selection to clicked button
    const buttons = document.querySelectorAll('.option-button');
    buttons[index].classList.add('selected');

    // Store answer
    userAnswers[currentQuestionIndex] = index;

    // Enable next button
    document.getElementById('nextBtn').disabled = false;

    // Show explanation
    showExplanation();

    // Collect themes from this answer
    const question = questionsData.fragen[currentQuestionIndex];
    const selectedOption = question.optionen[index];
    selectedOption.themen.forEach(theme => {
        allThemes[theme] = (allThemes[theme] || 0) + 1;
    });
}

// Show explanation for current question
function showExplanation() {
    const question = questionsData.fragen[currentQuestionIndex];
    const explanationBox = document.getElementById('explanation');

    document.getElementById('explanationTitle').textContent = question.erklaerung.titel;
    document.getElementById('explanationText').textContent = question.erklaerung.text;

    // Add SDG badges if available
    if (question.erklaerung.sdgs && question.erklaerung.sdgs.length > 0) {
        // Collect SDGs
        question.erklaerung.sdgs.forEach(sdgId => collectedSDGs.add(sdgId));

        // Create badges container if not exists
        let badgesContainer = explanationBox.querySelector('.sdg-badges');
        if (!badgesContainer) {
            badgesContainer = document.createElement('div');
            badgesContainer.className = 'sdg-badges';
            explanationBox.appendChild(badgesContainer);
        }

        badgesContainer.innerHTML = '<span class="sdg-label">UN-Nachhaltigkeitsziele:</span>';

        question.erklaerung.sdgs.forEach(sdgId => {
            const sdg = sdgsData.goals.find(g => g.id === sdgId);
            if (sdg) {
                const badge = document.createElement('span');
                badge.className = 'sdg-badge';
                badge.title = `SDG ${sdg.id}: ${sdg.titel}`;
                badge.innerHTML = `
                    <span class="sdg-badge-icon" style="background-color: ${sdg.color}">
                        ${sdg.id}
                    </span>
                    ${sdg.titel}
                `;
                badgesContainer.appendChild(badge);
            }
        });

        // Add info link
        const infoLink = document.createElement('a');
        infoLink.href = '../sdgs.html';
        infoLink.className = 'sdg-info-link';
        infoLink.textContent = 'Was sind die SDGs?';
        badgesContainer.appendChild(infoLink);
    }

    explanationBox.style.display = 'block';

    // Smooth scroll to explanation
    setTimeout(() => {
        explanationBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// Next question
function nextQuestion() {
    if (userAnswers[currentQuestionIndex] === undefined) {
        return;
    }

    if (currentQuestionIndex < questionsData.fragen.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        showResults();
    }
}

// Previous question
function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Show results
function showResults() {
    showSection('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Sort themes by frequency
    const sortedThemes = Object.entries(allThemes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6); // Top 6 themes

    // Display top themes
    const themesGrid = document.getElementById('topThemes');
    themesGrid.innerHTML = '';

    sortedThemes.forEach(([theme, count]) => {
        const card = document.createElement('div');
        card.className = 'theme-card';
        card.innerHTML = `
            <div class="theme-count">${count}</div>
            <div class="theme-name">${theme}</div>
        `;
        themesGrid.appendChild(card);
    });

    // Generate insight text
    const topTheme = sortedThemes[0][0];
    const insightText = document.getElementById('insightText');
    insightText.textContent = `Dein Alltag wird besonders stark von "${topTheme}" beeinflusst. ` +
        `Insgesamt haben wir ${Object.keys(allThemes).length} verschiedene politische Themenbereiche identifiziert, ` +
        `die mit deinen alltäglichen Entscheidungen verbunden sind. Politik ist nicht abstrakt – sie steckt in jedem Detail deines Lebens.`;

    // Display SDGs
    displaySDGResults();
}

// Display SDG results
function displaySDGResults() {
    const resultsContainer = document.querySelector('.results-insight');

    // Create SDG section
    const sdgSection = document.createElement('div');
    sdgSection.className = 'sdg-results';
    sdgSection.innerHTML = '<h3>🌍 UN-Nachhaltigkeitsziele in deinem Alltag</h3>';

    const sdgGrid = document.createElement('div');
    sdgGrid.className = 'sdg-grid';

    // Sort SDGs by ID
    const sortedSDGs = Array.from(collectedSDGs).sort((a, b) => a - b);

    sortedSDGs.forEach(sdgId => {
        const sdg = sdgsData.goals.find(g => g.id === sdgId);
        if (sdg) {
            const card = document.createElement('div');
            card.className = 'sdg-card';
            card.title = sdg.beschreibung;
            card.innerHTML = `
                <div class="sdg-card-number" style="background-color: ${sdg.color}">
                    ${sdg.id}
                </div>
                <div class="sdg-card-title">${sdg.titel}</div>
            `;
            sdgGrid.appendChild(card);
        }
    });

    sdgSection.appendChild(sdgGrid);

    // Add learn more link
    const learnMore = document.createElement('div');
    learnMore.className = 'sdg-learn-more';
    learnMore.innerHTML = '<a href="../sdgs.html">→ Mehr über die UN-Nachhaltigkeitsziele erfahren</a>';
    sdgSection.appendChild(learnMore);

    // Insert before results actions
    const resultsActions = document.querySelector('.results-actions');
    resultsActions.parentNode.insertBefore(sdgSection, resultsActions);
}

// Restart module
function restartModule() {
    currentQuestionIndex = 0;
    userAnswers = [];
    allThemes = {};
    collectedSDGs = new Set();
    showSection('intro');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Share results
function shareResults() {
    const text = `Ich habe mit KlarText entdeckt, wie politisch mein Alltag ist! Probier es selbst aus:`;
    const url = window.location.href.replace('/modules/alltag.html', '');

    if (navigator.share) {
        navigator.share({
            title: 'KlarText - Dein Alltag ist politisch',
            text: text,
            url: url
        }).catch(() => {
            // Fallback to clipboard
            copyToClipboard(url);
        });
    } else {
        copyToClipboard(url);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Link in Zwischenablage kopiert! 📋');
    }).catch(() => {
        alert('Link konnte nicht kopiert werden.');
    });
}

// Show section helper
function showSection(sectionId) {
    document.querySelectorAll('.module-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}
