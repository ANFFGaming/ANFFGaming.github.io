document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    if (document.querySelector('.programs-grid')) {
        console.log('Programs page detected - loading programs...');
        loadPrograms();
    } else {
        console.log('Not on programs page');
    }
});

async function loadPrograms() {
    console.log('Starting program loading process');
    
    try {
        console.log('Attempting to discover program files...');
        const programFiles = await getProgramFiles();
        console.log('Discovered files:', programFiles);
        
        const programsContainer = document.querySelector('.programs-grid');
        if (!programsContainer) {
            console.error('Programs container not found!');
            return;
        }
        
        programsContainer.innerHTML = '';
        
        if (programFiles.length === 0) {
            console.warn('No program files found');
            showErrorMessage('No programs found. Please check back later.');
            return;
        }

        console.log('Loading individual programs...');
        const programLoaders = programFiles.map(async (file) => {
            console.log(`Loading ${file}...`);
            try {
                const programData = await loadProgramData(file);
                console.log(`Successfully loaded ${file}`, programData);
                return { file, data: programData };
            } catch (error) {
                console.error(`Error loading ${file}:`, error.message);
                return null;
            }
        });

        const programs = (await Promise.all(programLoaders)).filter(p => p !== null);
        console.log('Valid programs loaded:', programs.length);
        
        if (programs.length === 0) {
            showErrorMessage('No valid programs could be loaded.');
            return;
        }

        console.log('Rendering program cards...');
        programs.forEach(({ file, data }) => {
            const programCard = createProgramCard(data, file);
            programsContainer.appendChild(programCard);
        });

    } catch (error) {
        console.error('Critical error loading programs:', error);
        showErrorMessage('Failed to load programs. Please try again later.');
    }
}

async function getProgramFiles() {
    // First try to get directory listing
    try {
        console.log('Attempting to fetch directory listing...');
        const response = await fetch('programs/');
        
        if (response.ok) {
            console.log('Directory listing available');
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const links = Array.from(doc.querySelectorAll('a[href$=".html"]'))
                .map(link => link.getAttribute('href'))
                .filter(name => !name.startsWith('index.'));
            
            console.log('Found files in directory:', links);
            return links;
        }
    } catch (e) {
        console.log('Directory listing not available:', e.message);
    }

    // Fallback to checking known files
    console.log('Falling back to checking known files');
    const fallbackFiles = [
        'youth-pass.html',
        'education-grant.html',
        'housing-support.html',
        'entrepreneurship-fund.html'
    ];
    
    const existenceChecks = await Promise.all(
        fallbackFiles.map(async file => {
            try {
                const response = await fetch(`programs/${file}`);
                console.log(`Checking ${file}:`, response.status);
                return response.ok ? file : null;
            } catch (e) {
                console.log(`Error checking ${file}:`, e.message);
                return null;
            }
        })
    );
    
    const availableFiles = existenceChecks.filter(file => file !== null);
    console.log('Available files:', availableFiles);
    return availableFiles;
}

async function loadProgramData(filename) {
    console.log(`Loading data from ${filename}...`);
    const response = await fetch(`programs/${filename}`);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const scriptTag = doc.querySelector('script[type="application/json"]');
    
    if (!scriptTag) {
        throw new Error('No JSON script tag found');
    }
    
    try {
        const data = JSON.parse(scriptTag.textContent);
        if (!data.title) {
            throw new Error('Invalid program data: missing title');
        }
        return data;
    } catch (e) {
        throw new Error(`Invalid JSON: ${e.message}`);
    }
}

function createProgramCard(programData, filename) {
    console.log(`Creating card for ${filename}`);
    const card = document.createElement('div');
    card.className = 'program-card';
    
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
    console.error('Displaying error:', message);
    const container = document.querySelector('.programs-grid') || document.body;
    container.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
        </div>
    `;
}

// Add error styling if not already in your CSS
const style = document.createElement('style');
style.textContent = `
    .error-message {
        padding: 20px;
        background: #ffebee;
        color: #c62828;
        border-radius: 4px;
        text-align: center;
        grid-column: 1/-1;
    }
`;
document.head.appendChild(style);