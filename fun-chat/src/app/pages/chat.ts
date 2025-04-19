import image from '../../assets/rss-logo.svg';
import type { GeneralMessage } from '../interfaces';
import type { ChatService } from '../services/chat-service';
import type { UserService } from '../services/user-service';
import type { Message } from '../interfaces';

function renderChatPageContent(
    userService: UserService,
    chatService: ChatService
): void {
    const container = document.querySelector('.wrapper');
    if (container) {
        container.innerHTML = '';
        container.append(
            createHeader(userService),
            createMain(userService, chatService),
            createFooter()
        );
    }
}

function createHeader(userService: UserService): HTMLElement {
    const header = document.createElement('header');
    header.className = 'header';

    const appName = document.createElement('p');
    appName.className = 'app-name';
    appName.textContent = 'Fun Chat';

    const menu = document.createElement('ul');
    menu.className = 'header-menu';

    const userName = document.createElement('li');
    userName.className = 'header-user-name';
    const currentUserName = userService.currentUser.login;
    if (currentUserName) userName.textContent = currentUserName;

    const logout = document.createElement('li');
    logout.className = 'logout-button';
    logout.textContent = 'Logout';
    logout.addEventListener('click', () => {
        const userRequest = prepareUserLogoutRequest(userService);
        userService.sendUserMessage(userRequest);
    });

    menu.append(userName, logout);
    header.append(appName, menu);

    return header;
}

function createMain(
    userService: UserService,
    chatService: ChatService
): HTMLElement {
    const main = document.createElement('main');

    main.classList.add('main', 'main-chat');
    main.append(
        createUsersSection(userService, chatService),
        createChatSection(chatService)
    );
    return main;
}

function createUsersSection(
    userService: UserService,
    chatService: ChatService
): HTMLElement {
    const usersSection = document.createElement('section');
    usersSection.className = 'section-users';

    const search = document.createElement('input');
    search.className = 'search-input';
    search.addEventListener('input', () => {
        userService.searchUsers(search.value);
    });

    const usersList = document.createElement('ul');
    usersList.className = 'users';
    usersList.addEventListener('click', (event) => {
        const clickedItem = event.target;
        if (clickedItem instanceof Element) {
            const clickedUser = clickedItem.closest('.user-chat');
            if (clickedUser) {
                const userName = clickedUser.textContent;
                if (userName) {
                    setChatForSelectedUser(userName, chatService, userService);
                }
            }
        }
    });

    userService.getAllActiveUsers();
    userService.getAllInactiveUsers();

    usersSection.append(search, usersList);

    return usersSection;
}

function createChatSection(chatService: ChatService): HTMLElement {
    const chatSection = document.createElement('section');
    chatSection.className = 'section-chat';

    const chatHeader = document.createElement('div');
    chatHeader.className = 'chat-header';

    const userName = document.createElement('p');
    userName.className = 'selected-chat-user-name';
    const status = document.createElement('p');
    status.className = 'selected-user-status';

    chatHeader.append(userName, status);

    const messages = document.createElement('div');
    messages.className = 'chat-messages';

    const chatSendMessageContainer = document.createElement('div');
    chatSendMessageContainer.className = 'chat-message-container';
    const message = document.createElement('textarea');
    message.className = 'chat-input';
    const sendMessage = document.createElement('button');
    sendMessage.className = 'chat-send-button';
    sendMessage.textContent = 'Send';
    sendMessage.addEventListener('click', () => {
        const id = crypto.randomUUID();
        const messageToSend = message.value;

        const to = chatService.activeChatWith.login;
        if (to) {
            const userRequest = {
                id: id,
                type: 'MSG_SEND',
                payload: {
                    message: {
                        to: to,
                        text: messageToSend,
                    },
                },
            };
            chatService.sendChatMessage(userRequest);
        }
    });

    chatSendMessageContainer.append(message, sendMessage);
    chatSection.append(chatHeader, messages, chatSendMessageContainer);
    return chatSection;
}

function createFooter(): HTMLElement {
    const footer = document.createElement('footer');
    footer.className = 'footer';

    const listFooterItems = document.createElement('ul');
    listFooterItems.className = 'footer-content';

    const schoolInfo = document.createElement('li');
    schoolInfo.className = 'school-info';
    schoolInfo.textContent = 'RSS School';
    const schoolIcon = document.createElement('img');
    schoolIcon.className = 'school-icon';
    schoolIcon.src = image;
    schoolInfo.append(schoolIcon);

    const authorName = document.createElement('li');
    authorName.className = 'author-name';
    authorName.textContent = 'Violetta Batsura';

    const gitHubInfo = document.createElement('li');
    gitHubInfo.className = 'author-github';

    const gitHubLink = document.createElement('a');
    gitHubLink.className = 'author-github-link';
    gitHubLink.href = 'https://github.com/violettab21';
    gitHubLink.textContent = 'Github Link';
    gitHubInfo.append(gitHubLink);
    const copyright = document.createElement('p');
    copyright.className = 'copyright';
    copyright.textContent = `Copyright Fun Chat, 2025`;
    listFooterItems.append(schoolInfo, authorName, gitHubInfo);
    footer.append(listFooterItems, copyright);
    return footer;
}

function prepareUserLogoutRequest(userService: UserService): GeneralMessage {
    const currentUserName = userService.currentUser.login;
    const currentUserPassword = userService.currentUser.password;
    let loginValue = '';
    let passwordValue = '';
    if (currentUserName && currentUserPassword) {
        loginValue = currentUserName;
        passwordValue = currentUserPassword;
    }

    const id = crypto.randomUUID();
    const userRequest: GeneralMessage = {
        id: id,
        type: 'USER_LOGOUT',
        payload: {
            user: {
                login: loginValue,
                password: passwordValue,
            },
        },
    };

    return userRequest;
}

function drawUsers(users: { login: string; isLogined: boolean }[]): void {
    const usersElements: HTMLElement[] = [];
    users.forEach((user) => {
        const item = document.createElement('li');
        item.className = 'user-chat';
        item.textContent = user.login;
        const status = document.createElement('span');
        status.className = 'user-status';
        if (user.isLogined) status.classList.add('user-status-active');
        else status.classList.add('user-status-inactive');
        item.prepend(status);
        usersElements.push(item);
    });

    const usersList = document.querySelector('.users');
    if (usersList) {
        usersList.innerHTML = '';
        usersList.append(...usersElements);
    }
}

function setChatForSelectedUser(
    userName: string,
    chatService: ChatService,
    userService: UserService
): void {
    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages) chatMessages.innerHTML = '';
    const selectedUser = userService.users.find(
        (user) => user.login === userName
    );
    if (selectedUser) {
        chatService.activeChatWith = selectedUser;
        chatService.getHistoryMessage(selectedUser.login);

        const chatHeader = document.querySelector('.chat-header');

        if (chatHeader) {
            const selectedUserElements = [...chatHeader.children];

            selectedUserElements[0].textContent = userName;
            if (selectedUser.isLogined) {
                selectedUserElements[1].textContent = 'online';
                selectedUserElements[1].classList.add(
                    'selected-user-status-active'
                );
            } else {
                selectedUserElements[1].textContent = 'offline';
                selectedUserElements[1].classList.add(
                    'selected-user-status-inactive'
                );
            }
        }
    }
}

function drawMessage(message: Message, currentUser: string): HTMLElement {
    const messageContainer = document.createElement('div');
    messageContainer.className = 'message-container';

    const messageHeader = document.createElement('div');
    messageHeader.className = 'message-header';

    const senderName = document.createElement('p');
    senderName.className = 'message-sender-name';
    const messageFrom = message.from;

    if (messageFrom) {
        if (messageFrom === currentUser) {
            senderName.textContent = 'You';
            messageContainer.classList.add('chat-current-user-message');
        } else senderName.textContent = messageFrom;
    }

    const date = document.createElement('p');
    date.className = 'message-date';
    date.textContent = getDate(message.datetime);

    messageHeader.append(senderName, date);

    const messageTestContainer = document.createElement('div');
    messageTestContainer.className = 'message-container';

    const messageText = document.createElement('p');
    messageText.className = 'message-text';
    messageText.textContent = message.text;

    messageTestContainer.append(messageText);

    const messageFooter = document.createElement('div');
    messageFooter.className = 'message-footer';

    const messageStatus = document.createElement('p');
    messageStatus.className = 'message-status';

    const messageEditState = document.createElement('p');
    messageEditState.className = 'message-edit-state';
    messageFooter.append(messageStatus, messageEditState);

    messageContainer.append(messageHeader, messageTestContainer, messageFooter);
    return messageContainer;
}

function getDate(milliseconds: number): string {
    return new Intl.DateTimeFormat('default', {
        timeStyle: 'short',
        dateStyle: 'short',
    }).format(milliseconds);
}

export { renderChatPageContent, drawUsers, drawMessage };
