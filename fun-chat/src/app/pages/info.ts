function renderInfoContent(): void {
    const container = document.querySelector('.wrapper');
    if (container) {
        container.innerHTML = '';

        const main = document.createElement('main');
        main.classList.add('main', 'main-info');
        const infoSection = document.createElement('section');
        infoSection.classList.add('info-section');
        const infoApplicationTitle = document.createElement('h2');
        infoApplicationTitle.classList.add('application-info-title');
        infoApplicationTitle.textContent = 'Fun Chat';
        const infoApplicationInfo = document.createElement('p');
        infoApplicationInfo.classList.add('application-info');
        infoApplicationInfo.textContent =
            'What could be better than chatting with your friends using a chat app?';
        const infoApplicationInfoDetails = document.createElement('p');
        infoApplicationInfoDetails.classList.add('application-info-details');
        infoApplicationInfoDetails.textContent =
            'Application has been developed in scope of RSSchool JS/FE 2024Q4 to gain skills with the WebSocket connection protocol.';
        const infoAuthor = document.createElement('a');
        infoAuthor.classList.add('application-info-author');
        infoAuthor.textContent = 'Author Viyaleta Batsura';
        infoAuthor.href = 'https://github.com/violettab21';
        const backButton = document.createElement('button');
        backButton.classList.add('info-back');
        backButton.textContent = 'Back';
        backButton.addEventListener('click', () => history.back());
        infoSection.append(
            infoApplicationTitle,
            infoApplicationInfo,
            infoApplicationInfoDetails,
            infoAuthor,
            backButton
        );
        main.append(infoSection);
        container.append(main);
    }
}

export { renderInfoContent };
