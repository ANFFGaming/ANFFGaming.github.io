import { fetchAllPrograms } from './program-parser.js';

// Helper function to get category display name (moved to top level)
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

document.addEventListener('DOMContentLoaded', async () => {
    // Load programs from individual files
    const programs = await fetchAllPrograms();
    
    // DOM elements
    const programsContainer = document.getElementById('programs-container');
    const searchInput = document.getElementById('program-search');
    const ageFilter = document.getElementById('age-filter');
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const noResults = document.getElementById('no-results');

    // Read URL parameters and set initial values
    function readUrlParams() {
        const params = new URLSearchParams(window.location.search);
        if (params.has('search')) searchInput.value = params.get('search');
        if (params.has('age')) ageFilter.value = params.get('age');
        if (params.has('category')) categoryFilter.value = params.get('category');
        if (params.has('sort')) sortFilter.value = params.get('sort');
    }

    // Update URL with current filters
    function updateUrlParams() {
        const params = new URLSearchParams();
        if (searchInput.value) params.set('search', searchInput.value);
        if (ageFilter.value) params.set('age', ageFilter.value);
        if (categoryFilter.value) params.set('category', categoryFilter.value);
        if (sortFilter.value !== 'default') params.set('sort', sortFilter.value);
        
        const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
        window.history.pushState({}, '', newUrl);
    }

    // Sort programs based on selected option
    function sortPrograms(programsToSort) {
        const sortValue = sortFilter.value;
        
        return [...programsToSort].sort((a, b) => {
            switch (sortValue) {
                case 'title-asc':
                    return a.title.localeCompare(b.title);
                case 'title-desc':
                    return b.title.localeCompare(a.title);
                case 'age-asc':
                    return a.ageMin - b.ageMin;
                case 'age-desc':
                    return b.ageMin - a.ageMin;
                case 'funding-asc':
                    return (a.fundFixed || a.fundMin) - (b.fundFixed || b.fundMin);
                case 'funding-desc':
                    return (b.fundFixed || b.fundMax) - (a.fundFixed || a.fundMax);
                default:
                    return 0;
            }
        });
    }

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

        const sorted = sortPrograms(filtered);
        displayPrograms(sorted);
        updateUrlParams();
    }

    // Reset all filters
    function resetFilters() {
        searchInput.value = '';
        ageFilter.value = '';
        categoryFilter.value = '';
        sortFilter.value = 'default';
        filterPrograms();
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
            
            // Categories tags - now as clickable anchors
            const categoriesHTML = program.categories.map(cat => 
                `<a href="#" class="category-tag" data-category="${cat}">${getCategoryName(cat)}</a>`
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

        // Add click handlers to all category tags
        document.querySelectorAll('.category-tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.preventDefault();
                const category = tag.dataset.category;
                categoryFilter.value = category;
                filterPrograms();
            });
        });
    }

    // Initialize
    readUrlParams();
    filterPrograms();

    // Event listeners
    searchInput.addEventListener('input', filterPrograms);
    applyFiltersBtn.addEventListener('click', filterPrograms);
    resetFiltersBtn.addEventListener('click', resetFilters);
    sortFilter.addEventListener('change', filterPrograms);

    // Add debounce to search input for better performance
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(filterPrograms, 300);
    });
});