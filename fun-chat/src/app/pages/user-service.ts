import type { Connection } from '../connection/connection';
import type {
    GeneralMessage,
    UserPayloadServer,
    User,
    UserPayloadServerUsers,
} from '../interfaces';
import { createErrorMessage } from '../components/modal';
import type { Router } from '../components/router';
import {
    isErrorPayload,
    isGeneralMessage,
    isUserPayloadServer,
    isUsersPayloadServer,
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
                switch (data.type) {
                    case 'USER_LOGIN': {
                        if (isUserPayloadServer(data.payload))
                            this.handleUserLoginMessage(data.payload);
                        break;
                    }
                    case 'USER_LOGOUT': {
                        if (isUserPayloadServer(data.payload))
                            this.handleUserLogoutMessage(data.payload);
                        break;
                    }
                    case 'USER_ACTIVE': {
                        if (isUsersPayloadServer(data.payload))
                            this.handleActiveUsersMessage(data.payload);
                        break;
                    }
                    case 'USER_EXTERNAL_LOGIN': {
                        if (isUserPayloadServer(data.payload))
                            handleExternalLogin(data.payload);
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

    public handleActiveUsersMessage(message: UserPayloadServerUsers): void {
        const activeUsers = message.users;
        const usersElements: HTMLElement[] = [];
        activeUsers.forEach((user) => {
            if (user.login === this.currentUser.login) return;
            const item = document.createElement('li');
            item.textContent = user.login;

            usersElements.push(item);
        });
        const usersList = document.querySelector('.users');
        if (usersList) {
            usersList.append(...usersElements);
        }
    }

    public sendUserMessage(userRequest: GeneralMessage): void {
        if (this.connection.connection) {
            this.connection.connection.send(JSON.stringify(userRequest));
        }
    }

    public getAllActiveUsers(): void {
        const id = crypto.randomUUID();
        const request: GeneralMessage = {
            id: id,
            type: 'USER_ACTIVE',
            payload: null,
        };
        if (this.connection.connection) {
            this.connection.connection.send(JSON.stringify(request));
        }
    }
}

function handleExternalLogin(message: UserPayloadServer): void {
    const usersList = document.querySelector('.users');
    const item = document.createElement('li');
    item.textContent = message.user.login;
    if (usersList) {
        usersList.append(item);
    }
}

/* if (data.type === 'USER_LOGIN') {
                    if (isUserPayloadServer(data.payload))
                        this.handleUserLoginMessage(data.payload);
                } else if (data.type === 'USER_LOGOUT') {
                    if (isUserPayloadServer(data.payload))
                        this.handleUserLogoutMessage(data.payload);
                } else if (data.type === 'USER_ACTIVE') {
                    if (isUsersPayloadServer(data.payload))
                        this.handleActiveUsersMessage(data.payload);
                } else if (
                    data.type === 'ERROR' &&
                    isErrorPayload(data.payload)
                ) {
                    const errorPayload = data.payload;
                    createErrorMessage(errorPayload.error);
                }*/
