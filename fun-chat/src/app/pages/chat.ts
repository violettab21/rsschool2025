import image from '../../assets/rss-logo.svg';
import type { GeneralMessage, Status } from '../interfaces';
import type { ChatService } from '../services/chat-service';
import type { UserService } from '../services/user-service';
import type { Message } from '../interfaces';
import type { Router } from '../components/router';

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

    console.log('currentUserName' + userService.currentUser.login);
    if (currentUserName) userName.textContent = currentUserName;
    const infoButton = document.createElement('li');
    infoButton.className = 'chat-info-button';
    infoButton.textContent = 'Info';
    infoButton.addEventListener('click', () => {
        router.openPage('info');
    });
    const logout = document.createElement('li');
    logout.className = 'logout-button';
    logout.textContent = 'Logout';
    logout.addEventListener('click', () => {
        const userRequest = prepareUserLogoutRequest(userService);
        userService.sendUserMessage(userRequest);
    });

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
    search.addEventListener('input', () => {
        userService.searchUsers(search.value);
    });

    const usersList = document.createElement('ul');
    usersList.className = 'users';
    usersList.addEventListener('click', (event) => {
        console.log('hello');
        const clickedItem = event.target;
        if (clickedItem instanceof Element) {
            const clickedUser = clickedItem.closest('.user-chat');
            if (clickedUser && clickedUser instanceof HTMLElement) {
                console.log('hello1');
                const userName = clickedUser.dataset.name;
                if (userName) {
                    console.log('hello2');
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
    const infoMessage = document.createElement('p');
    infoMessage.className = 'no-user-selected-message';
    infoMessage.textContent = 'Select User to start chat';
    messages?.append(infoMessage);

    messages.addEventListener('click', () => {
        console.log('cick');
        const selectedUser = chatService.activeChatWith;
        console.log(`active chat wuth ${selectedUser.login}`);
        console.log(chatService.getNotReadMessagesActiveChat());
        console.log(chatService.activeChatMessages);
        chatService
            .getNotReadMessagesActiveChat()
            .forEach((message) => chatService.sendReadNotification(message));
        removeNewMessageLine();
        if (chatService.activeChatWith.login) {
            removeMessageCount(chatService.activeChatWith.login);
        }
    });

    const chatSendMessageContainer = document.createElement('div');
    chatSendMessageContainer.className = 'chat-message-container';
    const message = document.createElement('textarea');
    message.className = 'chat-input';
    message.disabled = true;
    message.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    });
    const sendMessage = document.createElement('button');
    sendMessage.className = 'chat-send-button';
    sendMessage.textContent = 'Send';
    sendMessage.disabled = true;
    sendMessage.addEventListener('click', () => {
        if (sendMessage.textContent === 'Send')
            sendMessageHandler(message, chatService);
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && sendMessage.textContent === 'Send') {
            sendMessageHandler(message, chatService);
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

function decreaseMessageCount(userName: string): void {
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
                if (currentMessageCount === 1) existingMessageElement.remove();
                else
                    existingMessageElement.textContent = (
                        currentMessageCount - 1
                    ).toString();
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
    console.log(userName);
    if (selectedUser) {
        enableSendMessage();
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
                selectedUserElements[1].classList.remove(
                    'selected-user-status-inactive'
                );
            } else {
                selectedUserElements[1].textContent = 'offline';
                selectedUserElements[1].classList.add(
                    'selected-user-status-inactive'
                );
                selectedUserElements[1].classList.remove(
                    'selected-user-status-active'
                );
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

    const messageHeader = document.createElement('div');
    messageHeader.className = 'message-header';

    const senderName = document.createElement('p');
    senderName.className = 'message-sender-name';
    const messageFrom = message.from;

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
    messageEditState.textContent = message.status.isEdited ? 'edited' : '';
    messageFooter.append(messageEditState, messageStatus);
    if (messageFrom) {
        if (messageFrom === currentUser) {
            senderName.textContent = 'You';
            messageContainer.classList.add('chat-current-user-message');
            messageStatus.textContent = getStatus(message.status);
        } else senderName.textContent = messageFrom;
    }
    messageContainer.addEventListener('contextmenu', (event) => {
        if (messageFrom === currentUser) {
            event.preventDefault();
            showContextMenu(
                event.clientX,
                event.clientY,
                message.id,
                chatService,
                message.text
            );
        }
    });
    messageContainer.append(messageHeader, messageTestContainer, messageFooter);
    return messageContainer;
}
function removeChatInfoMessage(): void {
    const infoMessage = document.querySelector('.chat-empty-message');
    if (infoMessage) infoMessage.remove();
}
function scrollChatToBottom(): void {
    const chat = document.querySelector('.chat-messages');
    if (chat) chat.scrollTop = chat.scrollHeight;
}

function scrollChatToSeparator(): void {
    const chat = document.querySelector('.chat-messages');
    const separator = document.querySelector('.new-message-separator');
    if (chat && separator) separator.scrollIntoView(true);
}

function getDate(milliseconds: number): string {
    return new Intl.DateTimeFormat('default', {
        timeStyle: 'short',
        dateStyle: 'short',
    }).format(milliseconds);
}

function sendMessageHandler(
    input: HTMLTextAreaElement,
    chatService: ChatService
): void {
    console.log(input.value);
    if (input.value === '') return;
    const id = crypto.randomUUID();
    const messageToSend = input.value;

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
    input.value = '';
    chatService
        .getNotReadMessagesActiveChat()
        .forEach((message) => chatService.sendReadNotification(message));
    removeNewMessageLine();
}
function getStatus(statusObject: {
    isDelivered?: boolean;
    isReaded?: boolean;
    isEdited?: boolean;
}): string {
    let status: string = '';
    if (statusObject?.isReaded) {
        status = 'read';
    } else if (statusObject?.isDelivered) {
        status = 'delivered';
    } else status = 'sent';
    return status;
}

function updateUserStatusHeader(user: {
    login: string;
    isLogined: boolean;
}): void {
    const chatHeader = document.querySelector('.chat-header');
    if (chatHeader) {
        const chatHeaderElements = [...chatHeader.children];
        if (chatHeaderElements[0].textContent === user.login) {
            if (user.isLogined) {
                chatHeaderElements[1].textContent = 'online';
                chatHeaderElements[1].classList.add(
                    'selected-user-status-active'
                );
                chatHeaderElements[1].classList.remove(
                    'selected-user-status-inactive'
                );
            } else {
                chatHeaderElements[1].textContent = 'offline';
                chatHeaderElements[1].classList.add(
                    'selected-user-status-inactive'
                );
                chatHeaderElements[1].classList.remove(
                    'selected-user-status-active'
                );
            }
        }
    }
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
        const existingMessages = document.querySelector('.chat-messages');
        if (existingMessages) {
            const existingMessagesElements = [...existingMessages.children];
            if (existingMessagesElements.length === 0) {
                const message = document.createElement('p');
                message.className = 'chat-empty-message';
                message.textContent = 'Write your first message';
                chatElement?.append(message);
            }
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
function enableSendMessage(): void {
    const sendMessageElements = document.querySelector(
        '.chat-message-container'
    );
    if (sendMessageElements) {
        [...sendMessageElements.children].forEach((element) => {
            if (
                element instanceof HTMLTextAreaElement ||
                element instanceof HTMLButtonElement
            )
                element.disabled = false;
        });
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
    editOption.addEventListener('click', () => {
        putMessageTextToInput(messageid, messageText, chatService);

        menuContainer.remove();
    });
    const deleteOption = document.createElement('li');
    deleteOption.className = 'delete-message-option';
    deleteOption.textContent = 'Delete';
    deleteOption.addEventListener('click', () => {
        chatService.sendMessageDeleteNotification(messageid);
        menuContainer.remove();
    });
    menuList.append(editOption, deleteOption);
    menuContainer.append(menuList);
    document.querySelector('.chat-messages')?.append(menuContainer);
    menuContainer.style.top = y + 'px';
    menuContainer.style.left = x + 'px';
    menuContainer.addEventListener('mouseout', (event) => {
        if (
            event.relatedTarget instanceof Element &&
            event.target instanceof Element
        ) {
            if (event.relatedTarget.closest('.chat-context-menu')) return;
            if (
                !event.relatedTarget.closest('.chat-context-menu') &&
                event.target.closest('.chat-context-menu')
            )
                menuContainer.remove();
        }
    });
    document.addEventListener('click', (event) => {
        if (
            event.target instanceof Element &&
            !event.target.closest('.chat-context-menu')
        )
            menuContainer.remove();
    });
}
function closeContextMenu(): void {
    document.querySelector('.chat-context-menu')?.remove();
}

function removeMessageFromChat(messageId: string): void {
    const chat = document.querySelector('.chat-messages');
    if (chat) {
        const chatMessagesElements = [...chat.children];
        const messageToDelete = chatMessagesElements.find((element) => {
            if (element instanceof HTMLElement) {
                return element.dataset.id === messageId;
            }
        });
        if (messageToDelete) {
            messageToDelete.remove();
        }
    }
}
function updateMessageInChat(message: {
    id: string;
    text?: string;
    status: Status;
}): void {
    const chat = document.querySelector('.chat-messages');
    if (chat) {
        const chatMessagesElements = [...chat.children];
        const messageToUpdate = chatMessagesElements.find((element) => {
            if (element instanceof HTMLElement) {
                return element.dataset.id === message.id;
            }
        });
        if (messageToUpdate) {
            const messageText = messageToUpdate.querySelector('.message-text');
            if (messageText && message.text)
                messageText.textContent = message.text;
            const messageState = messageToUpdate.querySelector(
                '.message-edit-state'
            );
            if (messageState && message.status.isEdited)
                messageState.textContent = 'edited';
        }
    }
}

function putMessageTextToInput(
    messageID: string,
    messageText: string,
    chatService: ChatService
): void {
    const input = document.querySelector('.chat-input');
    const saveButton = document.createElement('button');
    document.querySelector('.save-update')?.remove();
    saveButton.className = 'save-update';
    saveButton.textContent = 'Save';
    document.querySelector('.chat-message-container')?.append(saveButton);
    if (input && input instanceof HTMLTextAreaElement) {
        input.value = messageText;
        saveButton.addEventListener('click', () => {
            chatService.sendMessageUpdateNotification(messageID, input.value);
            input.value = '';
            saveButton.remove();
        });
    }
}
export {
    renderChatPageContent,
    drawUsers,
    drawMessage,
    scrollChatToBottom,
    getStatus,
    updateUserStatusHeader,
    drawMessageHistory,
    removeMessageFromChat,
    updateMessageInChat,
    addMessagesCount,
    increaseMessageCount,
    decreaseMessageCount,
    removeMessageCount,
};
