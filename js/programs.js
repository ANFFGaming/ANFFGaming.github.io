document.addEventListener('DOMContentLoaded', () => {
    // Sample programs data
    const programs = [
        {
            id: 1,
            title: "Πρόγραμμα Εκπαίδευσης Νέων",
            description: "Χρηματοδότηση για σπουδές σε ελληνικά και ξένα πανεπιστήμια σε όλους τους τομείς σπουδών.",
            ageMin: 18,
            ageMax: 25,
            fundMin: 1000,
            fundMax: 5000,
            categories: ["education", "university"],
            image: "images/program-education.jpg"
        },
        {
            id: 2,
            title: "Επιχειρηματικότητα Νέων",
            description: "Χρηματοδότηση για νέες επιχειρηματικές ιδέες με δυνατότητα επέκτασης.",
            ageMin: 20,
            ageMax: 35,
            fundMin: 5000,
            fundMax: 20000,
            categories: ["business", "startup"],
            image: "images/program-business.jpg"
        },
        {
            id: 3,
            title: "Επαγγελματική Εκπαίδευση",
            description: "Προγράμματα επαγγελματικής κατάρτισης με εγγύηση εργασίας.",
            ageMin: 18,
            ageMax: 30,
            fundFixed: 3000,
            categories: ["employment", "training"],
            image: "images/program-employment.jpg"
        },
        {
            id: 4,
            title: "Καλλιτεχνικές Δημιουργίες",
            description: "Υποστήριξη νέων καλλιτεχνών σε όλους τους τομείς των τεχνών.",
            ageMin: 18,
            ageMax: 35,
            fundMin: 2000,
            fundMax: 10000,
            categories: ["arts", "culture"],
            image: "images/program-arts.jpg"
        },
        {
            id: 5,
            title: "Επιστημονική Έρευνα",
            description: "Υποτροφίες για νέους ερευνητές σε επιστημονικούς τομείς.",
            ageMin: 22,
            ageMax: 35,
            fundFixed: 8000,
            categories: ["research", "science"],
            image: "images/program-research.jpg"
        },
        {
            id: 6,
            title: "Τεχνολογικές Καινοτομίες",
            description: "Χρηματοδότηση για έργα τεχνολογικής καινοτομίας.",
            ageMin: 18,
            ageMax: 30,
            fundMin: 3000,
            fundMax: 15000,
            categories: ["technology", "innovation"],
            image: "images/program-tech.jpg"
        }
    ];

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
                <div class="program-image" style="background-image: url('${program.image}')"></div>
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
                    <a href="program-details.html?id=${program.id}" class="program-link">Δείτε περισσότερα</a>
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