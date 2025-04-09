// Fetches and parses all program files
export async function fetchAllPrograms() {
    try {
        // Fetch the list of program files (in a real app, this would be an API call)
        // For static sites, we'll assume a known list of programs
        const programFiles = [
            'youth-pass.html'
        ];

        const programs = [];
        
        for (const file of programFiles) {
            const response = await fetch(`programs/${file}`);
            const html = await response.text();
            
            // Parse the HTML to extract the JSON data
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const script = doc.getElementById('program-data');
            
            if (script) {
                const program = JSON.parse(script.textContent);
                programs.push(program);
            }
        }
        
        return programs;
    } catch (error) {
        console.error('Error loading programs:', error);
        return [];
    }
}