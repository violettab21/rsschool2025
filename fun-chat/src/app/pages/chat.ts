import image from '../../assets/rss-logo.svg';
import type { ChatService } from '../services/chat-service';
import type { UserService } from '../services/user-service';
import type { Message, UserServer } from '../interfaces';
import type { Router } from '../components/router';
import { cancelEnterTextarea, getDate, getStatus } from '../helpers';

import {
    addCloseHandlersForContextMenu,
    deleteOptionHandler,
    editOptionHandler,
    infoButtonHandler,
    logoutHandler,
    messageRightClickHandler,
    readMessagesHandler,
    scrollChatToSeparator,
    searchUsersHandler,
    selectChatHandler,
    sendMessageHandler,
} from './chat-handlers';

function renderChatPageContent(
    userService: UserService,
    chatService: ChatService,
    router: Router
): void {
    const container = document.querySelector('.wrapper');
    if (container) {
        container.innerHTML = '';
        container.append(
            createHeader(userService, router),
            createMain(userService, chatService),
            createFooter()
        );
    }
}

function createHeader(userService: UserService, router: Router): HTMLElement {
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
    const infoButton = document.createElement('li');
    infoButton.className = 'chat-info-button';
    infoButton.textContent = 'Info';
    const infoHandler = infoButtonHandler(router);
    infoButton.addEventListener('click', infoHandler);
    const logout = document.createElement('li');
    logout.className = 'logout-button';
    logout.textContent = 'Logout';
    const logoutButtonHandler = logoutHandler(userService);
    logout.addEventListener('click', logoutButtonHandler);

    menu.append(userName, infoButton, logout);
    header.append(appName, menu);

    return header;
}

function createMain(
    userService: UserService,
    chatService: ChatService
): HTMLElement {
    const main = document.createElement('main');

    main.classList.add('main', 'main-chat');
    const chatContainer = document.createElement('div');
    chatContainer.className = 'chat-container';
    chatContainer.append(
        createUsersSection(userService, chatService),
        createChatSection(chatService)
    );
    main.append(chatContainer);
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
    search.placeholder = 'Search';
    const searchHandler = searchUsersHandler(search, userService);
    search.addEventListener('input', searchHandler);

    const usersList = document.createElement('ul');
    usersList.className = 'users';
    const selectUserHandler = selectChatHandler(chatService, userService);
    usersList.addEventListener('click', selectUserHandler);

    userService.getAllActiveUsers();
    userService.getAllInactiveUsers();

    usersSection.append(search, usersList);

    return usersSection;
}

function createChatSection(chatService: ChatService): HTMLElement {
    const chatSection = document.createElement('section');
    chatSection.className = 'section-chat';

    const chatHeader = createChatSectionHeader();

    const messages = createChatSectionMessages(chatService);

    const chatSendMessageContainer =
        createChatSectionSendMessageBlock(chatService);
    chatSection.append(chatHeader, messages, chatSendMessageContainer);
    return chatSection;
}

function drawUser(user: UserServer): void {
    const usersList = document.querySelector('.users');
    const item = document.createElement('li');
    item.textContent = user.login;
    item.className = 'user-chat';
    item.dataset.name = user.login;
    const status = document.createElement('span');
    status.className = 'user-status';
    if (user.isLogined) status.classList.add('user-status-active');
    else status.classList.add('user-status-inactive');
    item.prepend(status);
    if (usersList) {
        usersList.append(item);
    }
}

function createChatSectionHeader(): HTMLElement {
    const chatHeader = document.createElement('div');
    chatHeader.className = 'chat-header';

    const userName = document.createElement('p');
    userName.className = 'selected-chat-user-name';

    const status = document.createElement('p');
    status.className = 'selected-user-status';

    chatHeader.append(userName, status);
    return chatHeader;
}

function createChatSectionMessages(chatService: ChatService): HTMLElement {
    const messages = document.createElement('div');
    messages.className = 'chat-messages';

    const infoMessage = document.createElement('p');
    infoMessage.className = 'no-user-selected-message';
    infoMessage.textContent = 'Select User to start chat';
    messages?.append(infoMessage);

    const readHandler = readMessagesHandler(chatService);
    messages.addEventListener('click', readHandler);
    return messages;
}

function createChatSectionSendMessageBlock(
    chatService: ChatService
): HTMLElement {
    const chatSendMessageContainer = document.createElement('div');
    chatSendMessageContainer.className = 'chat-message-container';
    const message = document.createElement('textarea');
    message.placeholder = 'Type your message here...';
    message.className = 'chat-input';
    message.disabled = true;
    message.addEventListener('keydown', cancelEnterTextarea);
    const sendMessageButton = document.createElement('button');
    sendMessageButton.className = 'chat-send-button';
    sendMessageButton.textContent = 'Send';
    sendMessageButton.disabled = true;
    const handler = sendMessageHandler(chatService, message);
    sendMessageButton.addEventListener('click', handler);
    document.addEventListener('keydown', handler);
    chatSendMessageContainer.append(message, sendMessageButton);
    return chatSendMessageContainer;
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

    const gitHubInfo = document.createElement('li');
    gitHubInfo.className = 'author-github';

    const gitHubLink = document.createElement('a');
    gitHubLink.className = 'author-github-link';
    gitHubLink.href = 'https://github.com/violettab21';
    gitHubLink.textContent = 'Violetta Batsura';
    gitHubInfo.append(gitHubLink);
    const copyright = document.createElement('li');
    copyright.className = 'copyright';
    copyright.textContent = `Fun Chat, 2025`;
    listFooterItems.append(schoolInfo, gitHubInfo, copyright);
    footer.append(listFooterItems);
    return footer;
}

function drawUsers(
    users: { login: string; isLogined: boolean }[],
    chatService: ChatService
): void {
    const usersElements: HTMLElement[] = [];
    users.forEach((user) => {
        const item = document.createElement('li');
        item.dataset.name = user.login;
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
        users.forEach((user) => {
            chatService.getHistoryMessage(user.login);
        });
    }
}
function addMessagesCount(messageCount: number, userName: string): void {
    const users = document.querySelector('.users');
    if (users) {
        const usersElements = [...users.children];
        const userToUpdate = usersElements.find((element) => {
            if (element instanceof HTMLElement)
                return element.dataset.name === userName;
        });
        if (userToUpdate) {
            const existingMessageElement = userToUpdate.querySelector(
                '.user-message-count'
            );
            if (existingMessageElement)
                existingMessageElement.textContent = messageCount.toString();
            else {
                const messageCountElement = document.createElement('span');
                messageCountElement.className = 'user-message-count';

                messageCountElement.textContent = messageCount.toString();
                userToUpdate.append(messageCountElement);
            }
        }
    }
}

function increaseMessageCount(userName: string): void {
    const users = document.querySelector('.users');
    if (users) {
        const usersElements = [...users.children];
        const userToUpdate = usersElements.find((element) => {
            if (element instanceof HTMLElement)
                return element.dataset.name === userName;
        });
        if (userToUpdate) {
            const existingMessageElement = userToUpdate.querySelector(
                '.user-message-count'
            );
            if (existingMessageElement) {
                const currentMessageCount = Number(
                    existingMessageElement.textContent
                );
                existingMessageElement.textContent = (
                    currentMessageCount + 1
                ).toString();
            } else {
                const messageCountElement = document.createElement('span');
                messageCountElement.className = 'user-message-count';

                messageCountElement.textContent = '1';
                userToUpdate.append(messageCountElement);
            }
        }
    }
}

function removeMessageCount(userName: string): void {
    const users = document.querySelector('.users');
    if (users) {
        const usersElements = [...users.children];
        const userToUpdate = usersElements.find((element) => {
            if (element instanceof HTMLElement)
                return element.dataset.name === userName;
        });
        if (userToUpdate) {
            const existingMessageElement = userToUpdate.querySelector(
                '.user-message-count'
            );
            if (existingMessageElement) {
                existingMessageElement.remove();
            }
        }
    }
}

function drawMessage(
    message: Message,
    currentUser: string,
    chatService: ChatService
): HTMLElement {
    removeChatInfoMessage();
    const messageContainer = document.createElement('div');
    messageContainer.className = 'message-container';
    messageContainer.dataset.id = message.id;
    const messageHeader = createMessageHeader(message, currentUser);

    const messageTextContainer = document.createElement('div');
    messageTextContainer.className = 'message-container';
    const messageText = document.createElement('p');
    messageText.className = 'message-text';
    messageText.textContent = message.text;
    messageTextContainer.append(messageText);

    const messageFooter = document.createElement('div');
    messageFooter.className = 'message-footer';
    const messageStatus = document.createElement('p');
    messageStatus.className = 'message-status';
    const messageEditState = document.createElement('p');
    messageEditState.className = 'message-edit-state';
    messageEditState.textContent = message.status.isEdited ? 'edited' : '';
    messageFooter.append(messageEditState, messageStatus);
    if (message.from === currentUser) {
        messageContainer.classList.add('chat-current-user-message');
        messageStatus.textContent = getStatus(message.status);
    }
    const contextMenuHandler = messageRightClickHandler(
        message,
        currentUser,
        chatService
    );
    messageContainer.addEventListener('contextmenu', contextMenuHandler);
    messageContainer.append(messageHeader, messageTextContainer, messageFooter);
    return messageContainer;
}

function createMessageHeader(
    message: Message,
    currentUser: string
): HTMLElement {
    const messageHeader = document.createElement('div');
    messageHeader.className = 'message-header';

    const senderName = document.createElement('p');
    senderName.className = 'message-sender-name';
    const messageFrom = message.from;

    const date = document.createElement('p');
    date.className = 'message-date';
    date.textContent = getDate(message.datetime);
    senderName.textContent =
        messageFrom === currentUser
            ? 'You'
            : (senderName.textContent = messageFrom);

    messageHeader.append(senderName, date);
    return messageHeader;
}

function removeChatInfoMessage(): void {
    const infoMessage = document.querySelector('.chat-empty-message');
    if (infoMessage) infoMessage.remove();
}

function drawMessageHistory(
    messages: Message[],
    currentUser: string,
    chatService: ChatService
): void {
    let isSeparatorUsed = false;
    const chatElement = document.querySelector('.chat-messages');
    if (messages.length > 0) {
        const listOfMessageElements: HTMLElement[] = [];
        messages.forEach((message) => {
            if (
                (message.from === chatService.activeChatWith.login &&
                    message.to === currentUser) ||
                (message.from === currentUser &&
                    message.to === chatService.activeChatWith.login)
            ) {
                if (
                    message.status.isReaded === false &&
                    isSeparatorUsed === false &&
                    message.to === currentUser
                ) {
                    listOfMessageElements.push(drawNewMessageLine());
                    isSeparatorUsed = true;
                }

                listOfMessageElements.push(
                    drawMessage(message, currentUser, chatService)
                );
            }
        });
        chatElement?.append(...listOfMessageElements);
        if (isSeparatorUsed) scrollChatToSeparator();
    } else {
        showEmptyChatMessage();
    }
}
function showEmptyChatMessage(): void {
    const existingMessages = document.querySelector('.chat-messages');
    if (existingMessages) {
        const existingMessagesElements = [...existingMessages.children];
        if (existingMessagesElements.length === 0) {
            const message = document.createElement('p');
            message.className = 'chat-empty-message';
            message.textContent = 'Write your first message';
            existingMessages?.append(message);
        }
    }
}

function drawNewMessageLine(): HTMLElement {
    const lineContainer = document.createElement('div');
    lineContainer.className = 'new-message-separator';
    const line = document.createElement('div');
    line.className = 'new-message-separator-line';
    const text = document.createElement('p');
    text.className = 'new-message-separator-text';
    text.textContent = 'New Messages';
    lineContainer.append(line, text);
    return lineContainer;
}

function removeNewMessageLine(): void {
    const chat = document.querySelector('.chat-messages');
    if (chat) {
        const line = document.querySelector('.new-message-separator');
        if (line) {
            line.remove();
        }
    }
}

function showContextMenu(
    x: number,
    y: number,
    messageid: string,
    chatService: ChatService,
    messageText: string
): void {
    closeContextMenu();
    const menuContainer = document.createElement('div');
    menuContainer.dataset.messageId = messageid;
    menuContainer.className = 'chat-context-menu';
    const menuList = document.createElement('ul');
    menuList.className = 'chat-context-menu-list';
    const editOption = document.createElement('li');
    editOption.className = 'edit-message-option';
    editOption.textContent = 'Edit';
    const editHandler = editOptionHandler(
        messageid,
        messageText,
        chatService,
        menuContainer
    );
    editOption.addEventListener('click', editHandler);
    const deleteOption = document.createElement('li');
    deleteOption.className = 'delete-message-option';
    deleteOption.textContent = 'Delete';
    const deleteHandler = deleteOptionHandler(
        chatService,
        messageid,
        menuContainer
    );
    deleteOption.addEventListener('click', deleteHandler);
    menuList.append(editOption, deleteOption);
    menuContainer.append(menuList);
    document.querySelector('.chat-messages')?.append(menuContainer);
    menuContainer.style.top = y + 'px';
    menuContainer.style.left = x + 'px';
    addCloseHandlersForContextMenu(menuContainer);
}

function closeContextMenu(): void {
    document.querySelector('.chat-context-menu')?.remove();
}

export {
    renderChatPageContent,
    drawUsers,
    drawMessage,
    drawMessageHistory,
    addMessagesCount,
    increaseMessageCount,
    removeMessageCount,
    removeNewMessageLine,
    showContextMenu,
    drawUser,
};
