function renderChatPageContent(): void {
    const container = document.querySelector('.wrapper');
    if (container) {
        container.innerHTML = '';
        container.append(createHeader(), createMain(), createFooter());
    }
}

function createHeader(): HTMLElement {
    const header = document.createElement('header');
    header.className = 'header';

    const appName = document.createElement('p');
    appName.className = 'app-name';
    appName.textContent = 'Fun Chat';

    const menu = document.createElement('ul');
    menu.className = 'header-menu';

    const userName = document.createElement('li');
    userName.className = 'header-user-name';
    userName.textContent = 'User Name Placeholder';

    const logout = document.createElement('li');
    logout.className = 'logout-button';
    logout.textContent = 'Logout';

    menu.append(userName, logout);
    header.append(appName, menu);

    return header;
}

function createMain(): HTMLElement {
    const main = document.createElement('main');
    main.className = 'main';

    return main;
}

function createFooter(): HTMLElement {
    const footer = document.createElement('footer');
    footer.className = 'footer';

    return footer;
}

export { renderChatPageContent };
