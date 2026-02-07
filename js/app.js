// PWA Installation & Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('Service Worker registriert'))
            .catch(error => console.log('Service Worker Fehler:', error));
    });
}

// Dark Mode Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    updateThemeIcon();
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    const currentTheme = document.documentElement.getAttribute('data-theme');
    const isDark = currentTheme === 'dark' ||
                   (!currentTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);

    themeToggle.textContent = isDark ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label', isDark ? 'Zu hellem Modus wechseln' : 'Zu dunklem Modus wechseln');
}

// App Logic
document.addEventListener('DOMContentLoaded', () => {
    initTheme();

    const startButton = document.getElementById('startButton');
    const modulesSection = document.getElementById('modulesSection');
    const moduleCards = document.querySelectorAll('.module-card');
    const themeToggle = document.getElementById('themeToggle');

    // Theme Toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Start Button Handler
    if (startButton) {
        startButton.addEventListener('click', () => {
            modulesSection.style.display = 'block';
            modulesSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Module Cards Handler
    moduleCards.forEach(card => {
        card.addEventListener('click', () => {
            const module = card.dataset.module;
            handleModuleClick(module);
        });
    });
});

function handleModuleClick(moduleName) {
    // Navigation zu den einzelnen Modulen
    const moduleUrls = {
        'alltag': 'modules/alltag.html',
        'werte': null,
        'populismus': null,
        'szenarien': null,
        'wissen': null
    };

    if (moduleUrls[moduleName]) {
        window.location.href = moduleUrls[moduleName];
    } else {
        alert(`Das Modul "${moduleName}" wird bald verfügbar sein! 🚀`);
    }
}

// PWA Install Prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Optional: Install-Button anzeigen
    showInstallButton();
});

function showInstallButton() {
    // Optional: Einen "App installieren" Button anzeigen
    const installButton = document.createElement('button');
    installButton.textContent = '📱 App installieren';
    installButton.className = 'install-button';
    installButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 24px;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
    `;

    installButton.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response: ${outcome}`);
            deferredPrompt = null;
            installButton.remove();
        }
    });

    document.body.appendChild(installButton);
}
