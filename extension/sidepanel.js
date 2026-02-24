document.getElementById('refreshBtn').addEventListener('click', () => {
    const frame = document.getElementById('appFrame');
    // Force reload iframe content
    const currentSrc = frame.src;
    frame.src = '';
    setTimeout(() => {
        frame.src = currentSrc;
    }, 50);
});
