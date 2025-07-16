document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const loadingGif = document.querySelector('.loading-gif');

    const handleLoading = () => {
        setTimeout(() => {
            loadingGif.src = 'assets/images/Logo No Background.png';
            setTimeout(() => {
                mainContent.classList.add('fade-in');
                loadingScreen.classList.add('hidden');
                setTimeout(() => loadingScreen.remove(), 800);
            }, 1000);
        }, 5300);
        setTimeout(() => {
            mainContent.classList.add('fade-in');
            loadingScreen.classList.add('hidden');
            setTimeout(() => loadingScreen.remove(), 800);
        }, 8000);
    };

    loadingGif.complete ? handleLoading() : loadingGif.addEventListener('load', handleLoading);
});