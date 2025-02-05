document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add version info to footer
    const footer = document.querySelector('.footer');
    if (footer) {
        const version = document.createElement('small');
        version.textContent = ' • Last updated: ' + new Date().toISOString().split('T')[0];
        footer.appendChild(version);
    }
});
