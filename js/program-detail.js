document.addEventListener('DOMContentLoaded', () => {
    // Get program data from JSON script
    const script = document.getElementById('program-data');
    if (!script) return;
    
    const program = JSON.parse(script.textContent);
    
    // Create main container
    const main = document.createElement('main');
    main.className = 'program-detail';
    
    // Create back button
    const backButton = document.createElement('a');
    backButton.href = '../programs.html';
    backButton.className = 'back-button';
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Πίσω στα Προγράμματα';
    
    // Create container
    const container = document.createElement('div');
    container.className = 'container';
    
    // Create article
    const article = document.createElement('article');
    
    // Create header with title
    const header = document.createElement('header');
    const title = document.createElement('h1');
    title.textContent = program.title;
    header.appendChild(title);
    
    // Create meta information
    const meta = document.createElement('div');
    meta.className = 'program-meta';
    
    // Age range
    const age = document.createElement('span');
    age.innerHTML = `<i class="fas fa-user"></i> Ηλικία: ${program.ageMin}-${program.ageMax}`;
    
    // Funding
    let fundingText;
    if (program.fundFixed) {
        fundingText = `Χρηματοδότηση: ${program.fundFixed}€`;
    } else {
        fundingText = `Χρηματοδότηση: ${program.fundMin}€ - ${program.fundMax}€`;
    }
    const funding = document.createElement('span');
    funding.innerHTML = `<i class="fas fa-euro-sign"></i> ${fundingText}`;
    
    // Categories
    const categories = document.createElement('span');
    const categoryNames = program.categories.map(cat => getCategoryName(cat)).join(', ');
    categories.innerHTML = `<i class="fas fa-tags"></i> Κατηγορίες: ${categoryNames}`;
    
    meta.append(age, funding, categories);
    
    // Create program image
    const imageContainer = document.createElement('div');
    imageContainer.className = 'program-image-container';
    const image = document.createElement('img');
    image.src = `../images/programmata/${program.image}`;
    image.alt = program.title;
    image.className = 'program-image';
    image.onerror = function() {
        this.src = '../images/programmata/default-program.jpg';
    };
    imageContainer.appendChild(image);
    
    // Create content sections
    const content = document.createElement('div');
    content.className = 'program-content';
    
    if (program.content && program.content.sections) {
        program.content.sections.forEach(section => {
            const sectionTitle = document.createElement('h2');
            sectionTitle.textContent = section.title;
            
            const sectionContent = document.createElement('div');
            sectionContent.className = 'section-content';
            sectionContent.innerHTML = section.content;
            
            content.append(sectionTitle, sectionContent);
        });
    }
    
    // Create apply button
    if (program.details && program.details.link) {
        const applyButton = document.createElement('a');
        applyButton.href = program.details.link;
        applyButton.className = 'btn btn-primary';
        applyButton.textContent = 'Υποβολή Αίτησης';
        applyButton.target = '_blank';
        content.appendChild(applyButton);
    }
    
    // Assemble the article
    article.append(header, meta, imageContainer, content);
    container.append(backButton, article);
    main.appendChild(container);
    
    // Add to document
    document.body.appendChild(main);
    
    // Helper function to get category display name
    function getCategoryName(category) {
        const categories = {
            'education': 'Εκπαίδευση',
            'business': 'Επιχειρηματικότητα',
            'employment': 'Εργασία',
            'research': 'Έρευνα',
            'arts': 'Τέχνες',
            'training': 'Κατάρτιση'
        };
        return categories[category] || category;
    }
});