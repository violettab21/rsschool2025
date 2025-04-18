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
export class ChatService {
    public connection: Connection;
    public activeChatWith: Partial<User>;
    public users: { login: string; isLogined: boolean }[];
    public router: Router;
    constructor(connection: Connection, router: Router) {
        this.connection = connection;
        this.router = router;
        this.activeChatWith = {};
        this.users = [];
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
                        if (isMessagePayloadServer(data.payload))
                            handleMessageSend(data.payload);
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
function handleMessageSend(message: MessagePayloadServer): void {
    drawMessage(message.message);
}
