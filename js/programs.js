import { fetchAllPrograms } from './program-parser.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Load programs from individual files
    const programs = await fetchAllPrograms();
    
    // DOM elements
    const programsContainer = document.getElementById('programs-container');
    const searchInput = document.getElementById('program-search');
    const ageFilter = document.getElementById('age-filter');
    const categoryFilter = document.getElementById('category-filter');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const noResults = document.getElementById('no-results');

    // Display all programs initially
    displayPrograms(programs);

    // Filter programs based on search and filters
    function filterPrograms() {
        const searchTerm = searchInput.value.toLowerCase();
        const ageRange = ageFilter.value;
        const category = categoryFilter.value;

        const filtered = programs.filter(program => {
            // Search term check
            const matchesSearch = program.title.toLowerCase().includes(searchTerm) || 
                               program.description.toLowerCase().includes(searchTerm);
            
            // Age filter check
            let matchesAge = true;
            if (ageRange) {
                const [min, max] = ageRange.split('-').map(Number);
                matchesAge = program.ageMin <= max && program.ageMax >= min;
            }
            
            // Category filter check
            let matchesCategory = true;
            if (category) {
                matchesCategory = program.categories.includes(category);
            }
            
            return matchesSearch && matchesAge && matchesCategory;
        });

        displayPrograms(filtered);
    }

    // Display programs in the grid
    function displayPrograms(programsToDisplay) {
        programsContainer.innerHTML = '';
        
        if (programsToDisplay.length === 0) {
            noResults.style.display = 'block';
            return;
        }
        
        noResults.style.display = 'none';
        
        programsToDisplay.forEach(program => {
            const programCard = document.createElement('div');
            programCard.className = 'program-card';
            
            // Funding text
            let fundingText;
            if (program.fundFixed) {
                fundingText = `Χρηματοδότηση: ${program.fundFixed}€`;
            } else {
                fundingText = `Χρηματοδότηση: ${program.fundMin}€ - ${program.fundMax}€`;
            }
            
            // Categories tags
            const categoriesHTML = program.categories.map(cat => 
                `<span class="category-tag">${getCategoryName(cat)}</span>`
            ).join('');
            
            programCard.innerHTML = `
                <div class="program-image-container">
                    <img src="${program.image}" 
                         alt="${program.title}" 
                         class="program-image"
                         onerror="this.onerror=null;this.src='images/programmata/default-program.jpg'">
                </div>
                <div class="program-content">
                    <h3 class="program-title">${program.title}</h3>
                    <p class="program-description">${program.description}</p>
                    <div class="program-meta">
                        <span class="meta-item">
                            <i class="fas fa-user"></i>
                            Ηλικία: ${program.ageMin}-${program.ageMax}
                        </span>
                    </div>
                    <div class="program-categories">
                        ${categoriesHTML}
                    </div>
                    <div class="program-funding">${fundingText}</div>
                    <a href="programmata/${program.id}.html" class="program-link">Δείτε περισσότερα</a>
                </div>
            `;
            
            programsContainer.appendChild(programCard);
        });
    }

    // Helper function to get category display name
    function getCategoryName(category) {
        const categories = {
            'education': 'Εκπαίδευση',
            'business': 'Επιχειρηματικότητα',
            'employment': 'Εργασία',
            'research': 'Έρευνα',
            'arts': 'Τέχνες',
            'university': 'Πανεπιστήμιο',
            'startup': 'Startup',
            'training': 'Εκπαίδευση',
            'culture': 'Πολιτισμός',
            'science': 'Επιστήμη',
            'technology': 'Τεχνολογία',
            'innovation': 'Καινοτομία'
        };
        return categories[category] || category;
    }

    // Event listeners
    searchInput.addEventListener('input', filterPrograms);
    applyFiltersBtn.addEventListener('click', filterPrograms);
});