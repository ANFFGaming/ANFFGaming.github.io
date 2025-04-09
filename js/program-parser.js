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
                
                // Set default image if none provided or if image fails to load
                program.image = await validateImagePath(program.image || 'default-program.jpg');
                
                programs.push(program);
            }
        }
        
        return programs;
    } catch (error) {
        console.error('Error loading programs:', error);
        return [];
    }
}

// Helper function to validate image path
async function validateImagePath(imagePath) {
    // Check if it's already a full path
    if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
        return imagePath;
    }
    
    // Check for image in programmata images folder
    const programmataPath = `images/programmata/${imagePath}`;
    if (await imageExists(programmataPath)) {
        return programmataPath;
    }
    
    // Check in general images folder
    const imagesPath = `images/${imagePath}`;
    if (await imageExists(imagesPath)) {
        return imagesPath;
    }
    
    // Fallback to default image
    return 'images/default-program.jpg';
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