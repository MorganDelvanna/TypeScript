(() => {
    const rotator = document.querySelector('.news-rotator');
    if (!rotator) return;

    const items = Array.from(rotator.querySelectorAll('.news-item'));
    let firstVisible = 0;

    const showNextPair = () => {
        items.forEach((item, index) => {
            item.classList.toggle('is-visible', index === firstVisible || index === firstVisible + 1);
        });
        firstVisible = (firstVisible + 2) % items.length;
    };

    if (items.length > 2) {
        showNextPair();
        window.setInterval(showNextPair, 5000);
    } else {
        items.forEach((item) => item.classList.add('is-visible'));
    }
})();