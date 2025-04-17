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

    main.classList.add('main', 'main-chat');
    main.append(createUsersSection(), createChatSection());
    return main;
}

function createUsersSection(): HTMLElement {
    const usersSection = document.createElement('section');
    usersSection.className = 'section-users';

    const search = document.createElement('input');
    search.className = 'search-input';

    const usersList = document.createElement('ul');
    usersList.className = 'users';

    const userPlaceholder = document.createElement('li');
    userPlaceholder.className = 'user-item';
    userPlaceholder.textContent = 'SomeUser';

    usersList.append(userPlaceholder);
    usersSection.append(search, usersList);

    return usersSection;
}

function createChatSection(): HTMLElement {
    const chatSection = document.createElement('section');
    chatSection.className = 'section-chat';

    const messages = document.createElement('div');
    messages.className = 'chat-messages';

    const chatSendMessageContainer = document.createElement('div');
    chatSendMessageContainer.className = 'chat-message-container';
    const message = document.createElement('textarea');
    message.className = 'chat-input';
    const sendMessage = document.createElement('button');
    sendMessage.className = 'chat-send-button';
    sendMessage.textContent = 'Send';
    chatSendMessageContainer.append(message, sendMessage);
    chatSection.append(messages, chatSendMessageContainer);
    return chatSection;
}

function createFooter(): HTMLElement {
    const footer = document.createElement('footer');
    footer.className = 'footer';

    return footer;
}

export { renderChatPageContent };
