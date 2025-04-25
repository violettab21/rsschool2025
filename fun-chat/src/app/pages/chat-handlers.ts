import type { Router } from '../components/router';
import type { ChatService } from '../services/chat-service';
import type { UserService } from '../services/user-service';
import { showContextMenu } from './chat';
import { prepareUserLogoutRequest } from '../services/user-service';
import { removeMessageCount } from './chat';
import { removeNewMessageLine } from './chat';
import type { Message, Status, UserServer } from '../interfaces';
function sendMessageHandler(
    chatService: ChatService,
    messageText: HTMLTextAreaElement
): (event: Event) => void {
    return (event: Event | KeyboardEvent) => {
        const button = document.querySelector('.chat-send-button');
        if (
            (event instanceof Event &&
                event.target instanceof HTMLElement &&
                event.target.textContent === 'Send') ||
            (event instanceof KeyboardEvent &&
                button &&
                event.key === 'Enter' &&
                button.textContent === 'Send')
        )
            sendMessage(messageText, chatService);
        if (chatService.activeChatWith.login) {
            removeMessageCount(chatService.activeChatWith.login);
        }
    };
}

function sendMessage(
    input: HTMLTextAreaElement,
    chatService: ChatService
): void {
    if (input.value === '') return;
    chatService.sendMessageRequest(input.value);
    input.value = '';
    chatService
        .getNotReadMessagesActiveChat()
        .forEach((message) => chatService.sendReadNotification(message));
    removeNewMessageLine();
}

function readMessagesHandler(chatService: ChatService): () => void {
    return () => {
        chatService
            .getNotReadMessagesActiveChat()
            .forEach((message) => chatService.sendReadNotification(message));
        removeNewMessageLine();
        if (chatService.activeChatWith.login) {
            removeMessageCount(chatService.activeChatWith.login);
        }
    };
}

function searchUsersHandler(
    search: HTMLInputElement,
    userService: UserService
): () => void {
    return () => {
        userService.searchUsers(search.value);
    };
}

function selectChatHandler(
    chatService: ChatService,
    userService: UserService
): (event: Event) => void {
    return (event: Event) => {
        const clickedItem = event.target;
        if (clickedItem instanceof Element) {
            const clickedUser = clickedItem.closest('.user-chat');
            if (clickedUser && clickedUser instanceof HTMLElement) {
                const userName = clickedUser.dataset.name;
                if (userName) {
                    setChatForSelectedUser(userName, chatService, userService);
                }
            }
        }
    };
}

function infoButtonHandler(router: Router): () => void {
    return () => {
        router.openPage('info');
    };
}

function logoutHandler(userService: UserService): () => void {
    return () => {
        const userRequest = prepareUserLogoutRequest(userService);
        userService.sendUserMessage(userRequest);
    };
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
        enableSendMessage();
        chatService.activeChatWith = selectedUser;
        chatService.getHistoryMessage(selectedUser.login);
        const chatHeader = document.querySelector('.chat-header');

        if (chatHeader) {
            const selectedUserElements = [...chatHeader.children];

            selectedUserElements[0].textContent = userName;
        }
        updateUserStatusHeader(selectedUser);
    }
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

function updateUserStatusUsersList(user: UserServer): void {
    const usersList = document.querySelector('.users');
    if (usersList) {
        const usersElements = [...usersList.children];
        const userElement = usersElements.find(
            (element) => element.textContent === user.login
        );
        if (userElement) {
            const status = userElement.querySelector('.user-status');
            if (status) {
                if (user.isLogined) {
                    status.classList.remove('user-status-inactive');
                    status.classList.add('user-status-active');
                } else {
                    status.classList.add('user-status-inactive');
                    status.classList.remove('user-status-active');
                }
            }
        }
    }
}

function messageRightClickHandler(
    message: Message,
    currentUser: string,
    chatService: ChatService
): (event: MouseEvent) => void {
    return (event: MouseEvent) => {
        if (message.from === currentUser) {
            event.preventDefault();
            showContextMenu(
                event.clientX,
                event.clientY,
                message.id,
                chatService,
                message.text
            );
        }
    };
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

function editOptionHandler(
    messageid: string,
    messageText: string,
    chatService: ChatService,
    menuContainer: HTMLElement
): () => void {
    return () => {
        putMessageTextToInput(messageid, messageText, chatService);
        menuContainer.remove();
    };
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
        const saveHandler = saveChangesHandler(messageID, input, chatService);
        saveButton.addEventListener('click', saveHandler);
    }
}

function saveChangesHandler(
    messageID: string,
    input: HTMLTextAreaElement,
    chatService: ChatService
): (event: Event) => void {
    return (event: Event) => {
        chatService.sendMessageUpdateNotification(messageID, input.value);
        input.value = '';
        if (event.target instanceof HTMLElement) event.target.remove();
    };
}

function deleteOptionHandler(
    chatService: ChatService,
    messageId: string,
    menuContainer: HTMLElement
): () => void {
    return () => {
        chatService.sendMessageDeleteNotification(messageId);
        menuContainer.remove();
    };
}

function closeContextMenuOnMouseMoveHandler(
    menuContainer: HTMLElement
): (event: MouseEvent) => void {
    return (event: MouseEvent) => {
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
    };
}

function closeContextMenuOnClick(
    menuContainer: HTMLElement
): (event: Event) => void {
    return (event: Event) => {
        if (
            event.target instanceof Element &&
            !event.target.closest('.chat-context-menu')
        )
            menuContainer.remove();
    };
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

function addCloseHandlersForContextMenu(menuContainer: HTMLElement): void {
    const closeHandler = closeContextMenuOnMouseMoveHandler(menuContainer);
    menuContainer.addEventListener('mouseout', closeHandler);
    const closeHandlerOnClick = closeContextMenuOnClick(menuContainer);
    document.addEventListener('click', closeHandlerOnClick);
}
export {
    sendMessageHandler,
    readMessagesHandler,
    searchUsersHandler,
    selectChatHandler,
    infoButtonHandler,
    logoutHandler,
    updateUserStatusHeader,
    messageRightClickHandler,
    scrollChatToBottom,
    scrollChatToSeparator,
    editOptionHandler,
    putMessageTextToInput,
    deleteOptionHandler,
    closeContextMenuOnMouseMoveHandler,
    closeContextMenuOnClick,
    removeMessageFromChat,
    updateMessageInChat,
    addCloseHandlersForContextMenu,
    updateUserStatusUsersList,
};
