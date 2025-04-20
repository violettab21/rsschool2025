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
    isErrorPayload,
    isMessagesPayloadServer,
    isMessagePayloadServerStatus,
} from '../utilities';
import type { Router } from '../components/router';
import { createErrorMessage } from '../components/modal';
import {
    drawMessage,
    drawMessageHistory,
    getStatus,
    scrollChatToBottom,
} from '../pages/chat';
import type { UserService } from './user-service';
export class ChatService {
    public connection: Connection;
    public activeChatWith: Partial<User>;
    public activeChatMessages: Message[];
    public users: { login: string; isLogined: boolean }[];
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
        this.users = [];

        this.userService = userService;
        this.processChatMessages();
    }
    public processChatMessages(): void {
        this.connection.addHandlerPerEvent('message', (event: MessageEvent) => {
            const receivedData: unknown = event.data;
            let data: unknown;
            if (typeof receivedData === 'string')
                data = JSON.parse(receivedData);
            if (isGeneralMessage(data)) {
                switch (data.type) {
                    case 'MSG_SEND': {
                        if (
                            isMessagePayloadServer(data.payload) &&
                            this.userService.currentUser.login
                        ) {
                            this.handleMessageSend(
                                data.payload,
                                this.userService.currentUser.login
                            );
                        }

                        break;
                    }
                    case 'MSG_FROM_USER': {
                        if (
                            isMessagesPayloadServer(data.payload) &&
                            this.userService.currentUser.login
                        ) {
                            this.handleHistory(
                                data.payload,
                                this.userService.currentUser.login
                            );
                        }

                        break;
                    }
                    case 'MSG_DELIVER': {
                        if (isMessagePayloadServerStatus(data.payload)) {
                            handleDeliverStatusMessage(data.payload);
                        }

                        break;
                    }
                    case 'MSG_READ': {
                        if (isMessagePayloadServerStatus(data.payload)) {
                            this.updateMessages(data.payload);
                        }

                        break;
                    }
                    case 'ERROR': {
                        if (isErrorPayload(data.payload)) {
                            const errorPayload = data.payload;
                            createErrorMessage(errorPayload.error);
                            break;
                        }
                    }
                }
            }
        });
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
            type: 'MSG_FROM_USER',
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
                ?.append(drawMessage(message.message, userName));
            const lineSeparator = document.querySelector(
                '.new-message-separator'
            );
            if (!lineSeparator) scrollChatToBottom();
            this.activeChatMessages.push(message.message);
        }
    }
    public handleHistory(
        messagesPayload: MessagesPayloadServer,
        currentUser: string
    ): void {
        const messages = messagesPayload.messages;
        this.activeChatMessages = [];
        messages.forEach((message) => this.activeChatMessages.push(message));

        drawMessageHistory(messages, currentUser);
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
            type: 'MSG_READ',
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
