import type { Connection } from '../connection/connection';
import type {
    MessagePayloadServer,
    User,
    MessagesPayloadServer,
    MessagePayloadServerStatus,
    Message,
} from '../interfaces';
import type { GeneralMessage } from '../interfaces';
import {
    isGeneralMessage,
    isMessagePayloadServer,
    isMessagesPayloadServer,
    isMessagePayloadServerStatus,
} from '../utilities';
import type { Router } from '../components/router';
import {
    addMessagesCount,
    drawMessage,
    drawMessageHistory,
    increaseMessageCount,
    removeMessageCount,
} from '../pages/chat';
import { getStatus } from '../helpers';
import type { UserService } from './user-service';
import { ResponseTypesChat } from '../../types';
import {
    removeMessageFromChat,
    scrollChatToBottom,
    updateMessageInChat,
} from '../pages/chat-handlers';
export class ChatService {
    public connection: Connection;
    public activeChatWith: Partial<User>;
    public activeChatMessages: Message[];
    public router: Router;
    public userService: UserService;
    constructor(
        connection: Connection,
        router: Router,
        userService: UserService
    ) {
        this.connection = connection;
        this.router = router;
        this.activeChatWith = {};
        this.activeChatMessages = [];
        this.userService = userService;
        this.processChatMessages();
    }
    public processChatMessages(): void {
        this.connection.addHandlerPerEvent(
            'message',
            (event: MessageEvent | Event) => {
                if (event instanceof MessageEvent) {
                    const receivedData: unknown = event.data;
                    let data: unknown;
                    if (typeof receivedData === 'string')
                        data = JSON.parse(receivedData);
                    if (isGeneralMessage(data)) {
                        this.sendMessageHandler(data);
                        this.messageHistoryHandler(data);
                        deliveryMessageHandler(data);
                        this.readMessageHandler(data);
                        this.deleteMessageHandler(data);
                        this.editMessageHandler(data);
                    }
                }
            }
        );
    }
    public sendMessageHandler(data: GeneralMessage): void {
        if (
            data.type === ResponseTypesChat.MSG_SEND &&
            isMessagePayloadServer(data.payload) &&
            this.userService.currentUser.login
        ) {
            this.handleMessageSend(
                data.payload,
                this.userService.currentUser.login
            );
        }
    }
    public messageHistoryHandler(data: GeneralMessage): void {
        if (
            data.type === ResponseTypesChat.MSG_FROM_USER &&
            isMessagesPayloadServer(data.payload) &&
            this.userService.currentUser.login
        ) {
            this.handleHistory(
                data.payload,
                this.userService.currentUser.login
            );
        }
    }

    public readMessageHandler(data: GeneralMessage): void {
        if (
            data.type === ResponseTypesChat.MSG_READ &&
            isMessagePayloadServerStatus(data.payload)
        ) {
            this.updateMessages(data.payload);
        }
    }
    public deleteMessageHandler(data: GeneralMessage): void {
        if (
            data.type === ResponseTypesChat.MSG_DELETE &&
            isMessagePayloadServerStatus(data.payload)
        ) {
            this.handleMessageDelete(data.payload);
        }
    }
    public editMessageHandler(data: GeneralMessage): void {
        if (
            data.type === ResponseTypesChat.MSG_EDIT &&
            isMessagePayloadServerStatus(data.payload)
        ) {
            this.handleMessageEdit(data.payload);
        }
    }
    public sendChatMessage(userRequest: GeneralMessage): void {
        if (this.connection.connection) {
            this.connection.connection.send(JSON.stringify(userRequest));
        }
    }
    public getHistoryMessage(selectedUser: string): void {
        const id = crypto.randomUUID();
        const request = {
            id: id,
            type: ResponseTypesChat.MSG_FROM_USER,
            payload: {
                user: {
                    login: selectedUser,
                },
            },
        };
        if (this.connection.connection) {
            this.connection.connection.send(JSON.stringify(request));
        }
    }
    public handleMessageSend(
        message: MessagePayloadServer,
        userName: string
    ): void {
        if (
            (message.message.from === this.activeChatWith.login &&
                message.message.to === userName) ||
            (message.message.from === userName &&
                message.message.to === this.activeChatWith.login)
        ) {
            document
                .querySelector('.chat-messages')
                ?.append(drawMessage(message.message, userName, this));
            const lineSeparator = document.querySelector(
                '.new-message-separator'
            );
            if (!lineSeparator) scrollChatToBottom();
            this.activeChatMessages.push(message.message);
        } else {
            if (message.message.to === userName) {
                increaseMessageCount(message.message.from);
            }
        }
    }
    public handleHistory(
        messagesPayload: MessagesPayloadServer,
        currentUser: string
    ): void {
        const messages = messagesPayload.messages;
        if (this.activeChatWith.login) {
            this.activeChatMessages = [];
            messages.forEach((message) =>
                this.activeChatMessages.push(message)
            );
            drawMessageHistory(messages, currentUser, this);
        }

        const notReadMessages = messages.filter((message) => {
            return (
                message.to === currentUser && message.status.isReaded === false
            );
        });
        if (notReadMessages.length > 0) {
            addMessagesCount(notReadMessages.length, notReadMessages[0].from);
            console.log(notReadMessages[0].from, notReadMessages.length);
        } else if (notReadMessages.length === 0) {
            const readMessages = messages.find((message) => {
                return (
                    message.to === currentUser &&
                    message.status.isReaded === true
                );
            });
            if (readMessages) removeMessageCount(readMessages.from);
        }
    }
    public getNotReadMessagesActiveChat(): Message[] {
        const notReadMessages = this.activeChatMessages.filter((message) => {
            return (
                message.from === this.activeChatWith.login &&
                message.status.isReaded === false
            );
        });
        return notReadMessages;
    }
    public sendReadNotification(message: Message): void {
        const id = crypto.randomUUID();
        const request = {
            id: id,
            type: ResponseTypesChat.MSG_READ,
            payload: {
                message: {
                    id: message.id,
                },
            },
        };
        if (this.connection.connection) {
            this.connection.connection.send(JSON.stringify(request));
        }
    }
    public updateMessages(messagePayload: MessagePayloadServerStatus): void {
        this.activeChatMessages.forEach((message) => {
            if (message.id === messagePayload.message.id) {
                message.status.isReaded =
                    messagePayload.message.status.isReaded;
            }
        });

        const chat = document.querySelector('.chat-messages');
        if (chat) {
            const chatMessagesElements = [...chat.children];
            const messageToUpdate = chatMessagesElements.find((element) => {
                if (element instanceof HTMLElement) {
                    return (
                        element.dataset.id === messagePayload.message.id &&
                        element.classList.contains('chat-current-user-message')
                    );
                }
            });
            if (messageToUpdate) {
                const status = messageToUpdate.querySelector('.message-status');
                if (status)
                    status.textContent = getStatus(
                        messagePayload.message.status
                    );
            }
        }
    }
    public sendMessageDeleteNotification(messageId: string): void {
        const id = crypto.randomUUID();
        const request = {
            id: id,
            type: ResponseTypesChat.MSG_DELETE,
            payload: {
                message: {
                    id: messageId,
                },
            },
        };
        if (this.connection.connection) {
            this.connection.connection.send(JSON.stringify(request));
        }
    }
    public sendMessageUpdateNotification(
        messageId: string,
        text: string
    ): void {
        const id = crypto.randomUUID();
        const request = {
            id: id,
            type: ResponseTypesChat.MSG_EDIT,
            payload: {
                message: {
                    id: messageId,
                    text: text,
                },
            },
        };
        if (this.connection.connection) {
            this.connection.connection.send(JSON.stringify(request));
        }
    }
    public handleMessageDelete(
        messagePayload: MessagePayloadServerStatus
    ): void {
        const messageToDeleteIndex = this.activeChatMessages.findIndex(
            (message) => message.id === messagePayload.message.id
        );
        this.activeChatMessages.splice(messageToDeleteIndex, 1);

        removeMessageFromChat(messagePayload.message.id);
        const users = this.router.userService.users.filter(
            (element) =>
                element.login !== this.router.userService.currentUser.login
        );
        users.forEach((user) => {
            if (user.login !== this.activeChatWith.login)
                this.getHistoryMessage(user.login);
        });
    }
    public handleMessageEdit(messagePayload: MessagePayloadServerStatus): void {
        const messageText = messagePayload.message.text;
        if (messageText) {
            this.activeChatMessages.forEach((message) => {
                if (message.id === messagePayload.message.id) {
                    message.status.isEdited =
                        messagePayload.message.status.isEdited;
                    message.text = messageText;
                }
            });

            updateMessageInChat(messagePayload.message);
        }
    }
    public sendMessageRequest(text: string): void {
        const id = crypto.randomUUID();
        const messageToSend = text;
        const to = this.activeChatWith.login;
        if (to) {
            const userRequest = {
                id: id,
                type: ResponseTypesChat.MSG_SEND,
                payload: {
                    message: {
                        to: to,
                        text: messageToSend,
                    },
                },
            };
            this.sendChatMessage(userRequest);
        }
    }
}
function deliveryMessageHandler(data: GeneralMessage): void {
    if (
        data.type === ResponseTypesChat.MSG_DELIVER &&
        isMessagePayloadServerStatus(data.payload)
    ) {
        handleDeliverStatusMessage(data.payload);
    }
}
function handleDeliverStatusMessage(
    messagePayload: MessagePayloadServerStatus
): void {
    const message = messagePayload.message;
    const chat = document.querySelector('.chat-messages');
    if (chat) {
        const chatMessagesElements = [...chat.children];
        const messageToUpdate = chatMessagesElements.find((element) => {
            if (element instanceof HTMLElement) {
                return element.dataset.id === message.id;
            }
        });
        if (messageToUpdate) {
            const status = messageToUpdate.querySelector('.message-status');
            if (status) status.textContent = getStatus(message.status);
        }
    }
}
