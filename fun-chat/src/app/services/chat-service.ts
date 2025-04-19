import type { Connection } from '../connection/connection';
import type {
    MessagePayloadServer,
    User,
    MessagesPayloadServer,
} from '../interfaces';
import type { GeneralMessage } from '../interfaces';
import {
    isGeneralMessage,
    isMessagePayloadServer,
    isErrorPayload,
    isMessagesPayloadServer,
} from '../utilities';
import type { Router } from '../components/router';
import { createErrorMessage } from '../components/modal';
import { drawMessage, scrollChatToBottom } from '../pages/chat';
import type { UserService } from './user-service';
export class ChatService {
    public connection: Connection;
    public activeChatWith: Partial<User>;
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
                            handleHistory(
                                data.payload,
                                this.userService.currentUser.login
                            );
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
        )
            document
                .querySelector('.chat-messages')
                ?.append(drawMessage(message.message, userName));
        scrollChatToBottom();
    }
}
function handleHistory(
    messagesPayload: MessagesPayloadServer,
    currentUser: string
): void {
    const messages = messagesPayload.messages;
    const messagesHistory = messages;
    const chatElement = document.querySelector('.chat-messages');
    if (messagesHistory.length > 0) {
        const listOfMessageElements: HTMLElement[] = [];
        messagesHistory.forEach((message) => {
            listOfMessageElements.push(drawMessage(message, currentUser));
        });
        chatElement?.append(...listOfMessageElements);
    } else {
        const message = document.createElement('p');
        message.className = 'chat-empty-message';
        message.textContent = 'Write your first message';
        chatElement?.append(message);
    }
}
