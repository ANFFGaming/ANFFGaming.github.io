document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.programs-page')) {
        loadPrograms();
    }
});

async function loadPrograms() {
    try {
        // Get all HTML files in programs directory
        const programFiles = await getProgramFiles();
        const programsContainer = document.querySelector('.programs-grid');
        programsContainer.innerHTML = '';
        
        if (programFiles.length === 0) {
            showErrorMessage('No programs found');
            return;
        }

        // Load each program and extract JSON data
        const programLoaders = programFiles.map(async (file) => {
            try {
                const programData = await loadProgramData(file);
                return { file, data: programData };
            } catch (error) {
                console.error(`Error loading ${file}:`, error);
                return null;
            }
        });

        // Wait for all programs to load
        const programs = (await Promise.all(programLoaders)).filter(p => p !== null);
        
        if (programs.length === 0) {
            showErrorMessage('No valid programs found');
            return;
        }

        // Render all valid programs
        programs.forEach(({ file, data }) => {
            console.log(`Program: ${file}`, data);
            const programCard = createProgramCard(data, file);
            programsContainer.appendChild(programCard);
        });

    } catch (error) {
        console.error('Error loading programs:', error);
        showErrorMessage('Failed to load programs');
    }
}

// Try to auto-discover program files
async function getProgramFiles() {
    // Try to get directory listing (works if server allows it)
    try {
        const response = await fetch('programs/');
        if (response.ok) {
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            return Array.from(doc.querySelectorAll('a[href$=".html"]'))
                .map(link => link.getAttribute('href'))
                .filter(name => !name.startsWith('index.'));
        }
    } catch (e) {
        console.log('Directory listing not available');
    }

    // Fallback: Try to fetch common program files
    const fallbackFiles = [
        'youth-pass.html',
        'education-grant.html',
        'housing-support.html',
        'entrepreneurship-fund.html'
    ];
    
    // Verify which files actually exist
    const existenceChecks = await Promise.all(
        fallbackFiles.map(async file => {
            try {
                const response = await fetch(`programs/${file}`);
                return response.ok ? file : null;
            } catch {
                return null;
            }
        })
    );
    
    return existenceChecks.filter(file => file !== null);
}

// Load program HTML and extract JSON data
async function loadProgramData(filename) {
    const response = await fetch(`programs/${filename}`);
    if (!response.ok) throw new Error('File not found');
    
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const scriptTag = doc.querySelector('script[type="application/json"]');
    
    if (!scriptTag) throw new Error('No JSON data found');
    
    try {
        return JSON.parse(scriptTag.textContent);
    } catch (e) {
        throw new Error('Invalid JSON format');
    }
}

function createProgramCard(programData, filename) {
    const card = document.createElement('div');
    card.className = 'program-card';
    
    // Set default values if not provided in JSON
    const title = programData.title || filename.replace('.html', '').replace(/-/g, ' ');
    const description = programData.description || 'No description available';
    const ageRange = programData.ageRange || 'N/A';
    const funding = programData.funding || 'Varies';
    const color = programData.color || '#3498db';
    
    card.innerHTML = `
        <div class="card-header" style="background-color: ${color}">
            <h3 class="program-title">${title}</h3>
        </div>
        <div class="card-body">
            <p class="program-description">${description}</p>
            <div class="program-details">
                <span>Age: ${ageRange}</span>
                <span>Funding: ${funding}</span>
            </div>
            <a href="programs/${filename}" class="apply-btn">Learn More</a>
        </div>
    `;
    
    return card;
}

function showErrorMessage(message) {
    document.querySelector('.programs-grid').innerHTML = `
        <div class="error-message">
            <p>${message}</p>
        </div>
    `;
}