// Fetches and parses all program files
export async function fetchAllPrograms() {
    try {
        // Fetch the list of program files
        const programFiles = [
            'youth-pass.html'
            // Add other program files here as needed
        ];

        const programs = [];
        
        for (const file of programFiles) {
            const response = await fetch(`programmata/${file}`);
            const html = await response.text();
            
            // Parse the HTML to extract the JSON data
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const script = doc.getElementById('program-data');
            
            if (script) {
                const program = JSON.parse(script.textContent);
                
                // Construct image path
                program.image = await getImagePath(program.image || 'default-program.jpg');
                
                programs.push(program);
            }
        }
        
        return programs;
    } catch (error) {
        console.error('Error loading programs:', error);
        return [];
    }
}

// Helper function to construct proper image path
async function getImagePath(filename) {
    // Default image folder path
    const basePath = 'images/programmata/';
    
    // Check if filename already contains path
    if (filename.includes('/') || filename.startsWith('http')) {
        return filename;
    }
    
    // Check if image exists in programmata folder
    const fullPath = basePath + filename;
    if (await imageExists(fullPath)) {
        return fullPath;
    }
    
    // Fallback to default image
    return basePath + 'default-program.jpg';
}

// Helper function to check if image exists
function imageExists(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}