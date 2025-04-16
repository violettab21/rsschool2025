import type { Connection } from '../connection/connection';
import type { GeneralMessage, UserPayloadServer } from '../interfaces';
import { createErrorMessage } from '../components/modal';
import {
    isErrorPayload,
    isGeneralMessage,
    isUserPayloadServer,
} from '../utilities';

export class UserService {
    public connection: Connection;
    public currentUserName: string | null;
    constructor(connection: Connection) {
        this.connection = connection;
        this.currentUserName = null;
        this.processUserMessages();
    }

    public processUserMessages(): void {
        this.connection.addHandlerPerEvent('message', (event: MessageEvent) => {
            const receivedData: unknown = event.data;
            let data: unknown;
            if (typeof receivedData === 'string')
                data = JSON.parse(receivedData);
            if (isGeneralMessage(data)) {
                if (data.type === 'USER_LOGIN') {
                    if (isUserPayloadServer(data.payload))
                        this.handleUserLoginMessage(data.payload);
                } else if (
                    data.type === 'ERROR' &&
                    isErrorPayload(data.payload)
                ) {
                    const errorPayload = data.payload;
                    createErrorMessage(errorPayload.error);
                }
            }
        });
    }
    public handleUserLoginMessage(message: UserPayloadServer): void {
        if (
            message.user.login === this.currentUserName &&
            message.user.isLogined
        ) {
            console.log('log in user');
        } else console.log('other user logged in');
    }
    public userLogin(userRequest: GeneralMessage): void {
        if (this.connection.connection) {
            this.connection.connection.send(JSON.stringify(userRequest));
        }
    }
}
