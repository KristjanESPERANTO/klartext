// Load and display SDGs
document.addEventListener('DOMContentLoaded', async () => {
    await loadAndDisplaySDGs();
});

async function loadAndDisplaySDGs() {
    try {
        const response = await fetch('data/sdgs.json');
        const data = await response.json();

        const grid = document.getElementById('sdgsGrid');

        data.goals.forEach(sdg => {
            const card = document.createElement('div');
            card.className = 'sdg-card-full';
            card.innerHTML = `
                <div class="sdg-card-header">
                    <div class="sdg-number-large" style="background-color: ${sdg.color}">
                        ${sdg.id}
                    </div>
                    <div class="sdg-title-large">${sdg.titel}</div>
                </div>
                <div class="sdg-description">${sdg.beschreibung}</div>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Fehler beim Laden der SDGs:', error);
    }
}
