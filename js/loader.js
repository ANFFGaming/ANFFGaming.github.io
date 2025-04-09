// Fetch and insert the header (which includes everything from DOCTYPE to opening <main>)
fetch('includes/header.html')
  .then(response => response.text())
  .then(headerHtml => {
    document.open();
    document.write(headerHtml);
    document.close();
    
    // Now fetch and insert the footer (from closing </main> to </html>)
    fetch('includes/footer.html')
      .then(response => response.text())
      .then(footerHtml => {
        // The main content can be defined here or loaded from another file
        const mainContent = `
          <main>
            <h1>Welcome to My Website</h1>
            <p>This is your main content.</p>
          </main>
        `;
        
        // Insert the main content and footer
        document.body.insertAdjacentHTML('beforeend', mainContent + footerHtml);
      });
  });