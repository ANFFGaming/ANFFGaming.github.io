document.addEventListener('DOMContentLoaded', () => {
    // 1. Capture the main content from index.html
    const mainContent = document.body.innerHTML;
    
    // 2. Fetch header and footer simultaneously
    Promise.all([
        fetch('includes/header.html').then(r => r.text()),
        fetch('includes/footer.html').then(r => r.text())
    ]).then(([header, footer]) => {
        // 3. Rebuild the document
        document.open();
        document.write(
            header + 
            `<main>${mainContent}</main>` + 
            footer
        );
        document.close();
    });

    // Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}
});