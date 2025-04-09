document.addEventListener('DOMContentLoaded', function() {
    // Load programs data and initialize the page
    loadPrograms();
    
    // Set up event listeners
    setupEventListeners();
});

document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.programs-grid')) {
        // This is the program listing page
        loadPrograms();
        setupEventListeners();
    }
    
    if (document.querySelector('.program-page')) {
        // This is an individual program page
        setupProgramPage();
    }
});

// Load all program data for the listing page
async function loadPrograms() {
    try {
        // In a real implementation, you might fetch this from an API
        // or generate it during build time for static sites
        const programLinks = [
            { url: 'programs/youth-education-grant.html', category: 'education' },
            { url: 'programs/entrepreneur-fund.html', category: 'business' },
            { url: 'programs/youth-housing-support.html', category: 'housing' }
        ];
        
        const programs = [];
        
        // Fetch each program's metadata
        for (const link of programLinks) {
            const response = await fetch(link.url);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const programData = JSON.parse(doc.getElementById('program-data').textContent);
            
            programs.push({
                ...programData,
                url: link.url,
                categories: [link.category, ...(programData.categories || [])]
            });
        }
        
        window.allPrograms = programs;
        displayPrograms(programs);
        initializeCategories(programs);
    } catch (error) {
        console.error('Error loading programs:', error);
        displayError();
    }
}

// For individual program pages
function setupProgramPage() {
    const programData = JSON.parse(document.getElementById('program-data').textContent);
    
    // Update the page title
    document.title = `${programData.title} | Youth Funding`;
    
    // You could use the data to dynamically update parts of the page
    // For example, set the application link
    const applyBtn = document.querySelector('.application-section .cta-btn');
    if (applyBtn && programData.applicationLink) {
        applyBtn.href = programData.applicationLink;
    }
    
    // Add structured data for SEO
    addStructuredData(programData);
}

function addStructuredData(programData) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "GovernmentService",
        "name": programData.title,
        "description": programData.shortDescription,
        "serviceType": "Financial Assistance",
        "category": programData.categories.join(", "),
        "provider": {
            "@type": "GovernmentOrganization",
            "name": "Youth Funding Programs"
        },
        "audience": {
            "@type": "PeopleAudience",
            "suggestedMinAge": programData.ageRange.split('-')[0],
            "suggestedMaxAge": programData.ageRange.split('-')[1]
        },
        "availableChannel": {
            "@type": "ServiceChannel",
            "availableLanguage": "English",
            "processingTime": "P30D",
            "serviceUrl": window.location.href
        }
    };
    
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
}

function displayPrograms(programs) {
    const programsGrid = document.querySelector('.programs-grid');
    
    // Clear existing programs
    programsGrid.innerHTML = '';
    
    if (programs.length === 0) {
        programsGrid.innerHTML = '<p class="no-programs">No programs match your criteria.</p>';
        return;
    }
    
    // Create and append program cards
    programs.forEach(program => {
        const programCard = createProgramCard(program);
        programsGrid.appendChild(programCard);
    });
}

function createProgramCard(program) {
    const card = document.createElement('div');
    card.className = 'program-card';
    
    // Format dates
    const startDate = new Date(program.startDate).toLocaleDateString();
    const endDate = new Date(program.endDate).toLocaleDateString();
    
    // Create card HTML
    card.innerHTML = `
        <div class="card-header" style="background-color: ${getCategoryColor(program.categories[0])}">
            <h3 class="program-title">${program.title}</h3>
        </div>
        <div class="card-body">
            <p class="program-description">${program.description}</p>
            <div class="program-details">
                <span>Age: ${program.ageRange}</span>
                <span>Funding: ${program.funds}</span>
            </div>
            <div class="program-dates">
                <span>Starts: ${startDate}</span>
                <span>Ends: ${endDate}</span>
            </div>
            <div class="program-tags">
                ${program.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <button class="apply-btn" data-program-id="${program.id}">Learn More</button>
        </div>
    `;
    
    return card;
}

function getCategoryColor(category) {
    // Assign colors based on category
    const colors = {
        'education': '#3498db',
        'business': '#2ecc71',
        'housing': '#9b59b6',
        'financial aid': '#e67e22',
        'employment': '#1abc9c',
        'social services': '#e74c3c'
    };
    
    return colors[category] || '#3498db'; // Default color
}

function initializeCategories(programs) {
    const categoriesContainer = document.querySelector('.categories');
    
    // Get all unique categories
    const allCategories = new Set();
    programs.forEach(program => {
        program.categories.forEach(category => {
            allCategories.add(category);
        });
    });
    
    // Create category filters
    categoriesContainer.innerHTML = '';
    
    // Add "All" option
    const allButton = document.createElement('span');
    allButton.className = 'category-tag active';
    allButton.textContent = 'All';
    allButton.addEventListener('click', () => filterPrograms('all'));
    categoriesContainer.appendChild(allButton);
    
    // Add category buttons
    allCategories.forEach(category => {
        const button = document.createElement('span');
        button.className = 'category-tag';
        button.textContent = category;
        button.addEventListener('click', () => filterPrograms(category));
        categoriesContainer.appendChild(button);
    });
}

function filterPrograms(category) {
    // Update active category button
    document.querySelectorAll('.category-tag').forEach(button => {
        button.classList.remove('active');
    });
    
    event.target.classList.add('active');
    
    // Filter programs
    if (category === 'all') {
        displayPrograms(window.allPrograms);
    } else {
        const filteredPrograms = window.allPrograms.filter(program => 
            program.categories.includes(category)
        );
        displayPrograms(filteredPrograms);
    }
}

function setupEventListeners() {
    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm.length > 2) {
            const filtered = window.allPrograms.filter(program => 
                program.title.toLowerCase().includes(searchTerm) ||
                program.description.toLowerCase().includes(searchTerm) ||
                program.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
            displayPrograms(filtered);
        } else if (searchTerm.length === 0) {
            displayPrograms(window.allPrograms);
        }
    });
    
    // Program modal (would need HTML structure)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('apply-btn')) {
            const programId = parseInt(e.target.dataset.programId);
            const program = window.allPrograms.find(p => p.id === programId);
            showProgramModal(program);
        }
    });
}

function showProgramModal(program) {
    // Format dates
    const startDate = new Date(program.startDate).toLocaleDateString();
    const endDate = new Date(program.endDate).toLocaleDateString();
    
    // Create modal HTML
    const modalHTML = `
        <div class="modal-overlay">
            <div class="modal">
                <button class="close-modal">&times;</button>
                <h2>${program.title}</h2>
                <div class="modal-content">
                    <p><strong>Description:</strong> ${program.description}</p>
                    <p><strong>Details:</strong> ${program.content}</p>
                    <div class="modal-details">
                        <p><strong>Age Range:</strong> ${program.ageRange}</p>
                        <p><strong>Funding Amount:</strong> ${program.funds}</p>
                        <p><strong>Duration:</strong> ${startDate} to ${endDate}</p>
                        <p><strong>Categories:</strong> ${program.categories.join(', ')}</p>
                    </div>
                    <button class="cta-btn">Apply Now</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listeners for modal
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    document.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });
}

function closeModal() {
    document.querySelector('.modal-overlay').remove();
}

function displayError() {
    const programsGrid = document.querySelector('.programs-grid');
    programsGrid.innerHTML = `
        <div class="error-message">
            <p>We're having trouble loading the programs right now. Please try again later.</p>
            <button class="cta-btn" onclick="loadPrograms()">Retry</button>
        </div>
    `;
}