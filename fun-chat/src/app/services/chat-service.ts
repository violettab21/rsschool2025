import type { Connection } from '../connection/connection';
import type { MessagePayloadServer, User } from '../interfaces';
import type { GeneralMessage } from '../interfaces';
import {
    isGeneralMessage,
    isMessagePayloadServer,
    isErrorPayload,
} from '../utilities';
import type { Router } from '../components/router';
import { createErrorMessage } from '../components/modal';
import { drawMessage } from '../pages/chat';
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
                            handleMessageSend(
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
}
function handleMessageSend(
    message: MessagePayloadServer,
    userName: string
): void {
    drawMessage(message.message, userName);
}
