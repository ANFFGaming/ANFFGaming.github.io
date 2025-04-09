document.addEventListener('DOMContentLoaded', () => {
    // 1. Capture the main content from the page (excluding header and footer)
    const mainContent = document.querySelector('main').innerHTML;

    // 2. Fetch header and footer simultaneously
    Promise.all([
        fetch('/includes/header.html').then(r => r.text()),
        fetch('/includes/footer.html').then(r => r.text())
    ]).then(([header, footer]) => {
        // 3. Get the body element
        const body = document.body;

        // 4. Create a container to wrap the header, main content, and footer
        const container = document.createElement('div');

        // 5. Insert header, main content, and footer into the container
        container.innerHTML = header + `<main>${mainContent}</main>` + footer;

        // 6. Clear the body content and append the new content
        body.innerHTML = '';  // Clear the body content, but keep the structure
        body.appendChild(container);  // Add the new container with header, main content, and footer
    }).catch(err => {
        console.error('Error fetching header or footer:', err);
    });
});
