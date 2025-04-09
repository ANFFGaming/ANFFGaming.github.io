document.addEventListener('DOMContentLoaded', () => {
    // 1. Capture the main content inside <main> element
    const mainContent = document.querySelector('main').innerHTML;

    // 2. Fetch the header and footer HTML simultaneously
    Promise.all([
        fetch('/includes/header.html').then(r => r.text()),
        fetch('/includes/footer.html').then(r => r.text())
    ])
    .then(([header, footer]) => {
        // 3. Insert the header into the header element
        document.querySelector('header').innerHTML = header;

        // 4. Insert the footer into the footer element
        document.querySelector('footer').innerHTML = footer;

        // 5. Insert the main content into the <main> element
        document.querySelector('main').innerHTML = mainContent;

        // Ensure that the body now contains the header, main content, and footer
        console.log("Loader successfully added the header, main content, and footer.");
    })
    .catch(err => {
        console.error("Error fetching header or footer:", err);
    });
});
