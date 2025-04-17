import type { Connection } from '../connection/connection';
import type { GeneralMessage, UserPayloadServer, User } from '../interfaces';
import { createErrorMessage } from '../components/modal';
import type { Router } from '../components/router';
import {
    isErrorPayload,
    isGeneralMessage,
    isUserPayloadServer,
} from '../utilities';

export class UserService {
    public connection: Connection;
    public currentUser: Partial<User>;
    public router: Router;
    constructor(connection: Connection, router: Router) {
        this.connection = connection;
        this.router = router;
        this.currentUser = {};
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
                } else if (data.type === 'USER_LOGOUT') {
                    if (isUserPayloadServer(data.payload))
                        this.handleUserLogoutMessage(data.payload);
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
            message.user.login === this.currentUser?.login &&
            message.user.isLogined
        ) {
            this.router.openPage('chat');
        } else console.log('other user logged in');
    }
    public handleUserLogoutMessage(message: UserPayloadServer): void {
        if (
            message.user.login === this.currentUser?.login &&
            !message.user.isLogined
        ) {
            this.connection.connection?.close();
            this.connection.connect();
            this.router.openPage('login');
        } else console.log('other user logged in');
    }

    public sendUserMessage(userRequest: GeneralMessage): void {
        if (this.connection.connection) {
            this.connection.connection.send(JSON.stringify(userRequest));
        }
    }
}
