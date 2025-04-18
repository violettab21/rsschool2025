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
import { drawUsers } from '../pages/chat';

export class UserService {
    public connection: Connection;
    public currentUser: Partial<User>;
    public users: { login: string; isLogined: boolean }[];
    public router: Router;
    constructor(connection: Connection, router: Router) {
        this.connection = connection;
        this.router = router;
        this.currentUser = {};
        this.users = [];
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
                            this.handleRegisteredUsersMessage(data.payload);
                        break;
                    }
                    case 'USER_INACTIVE': {
                        if (isUsersPayloadServer(data.payload))
                            this.handleRegisteredUsersMessage(data.payload);
                        break;
                    }
                    case 'USER_EXTERNAL_LOGIN': {
                        if (isUserPayloadServer(data.payload))
                            this.handleExternalLogin(data.payload);
                        break;
                    }
                    case 'USER_EXTERNAL_LOGOUT': {
                        if (isUserPayloadServer(data.payload))
                            this.handleExternalLogout(data.payload);
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

    public handleRegisteredUsersMessage(message: UserPayloadServerUsers): void {
        const users = message.users;
        users.forEach((user) => {
            if (user.login === this.currentUser.login) return;
            if (!this.users.some((element) => element.login === user.login))
                this.users.push(user);
        });

        drawUsers(this.users);
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

    public getAllInactiveUsers(): void {
        const id = crypto.randomUUID();
        const request: GeneralMessage = {
            id: id,
            type: 'USER_INACTIVE',
            payload: null,
        };
        if (this.connection.connection) {
            this.connection.connection.send(JSON.stringify(request));
        }
    }
    public handleExternalLogin(message: UserPayloadServer): void {
        const usersList = document.querySelector('.users');

        const item = document.createElement('li');

        item.textContent = message.user.login;
        item.className = 'user-chat';
        const status = document.createElement('span');
        status.className = 'user-status';
        if (message.user.isLogined) status.classList.add('user-status-active');
        else status.classList.add('user-status-inactive');
        item.prepend(status);

        if (
            !this.users.some((element) => element.login === message.user.login)
        ) {
            this.users.push(message.user);

            if (usersList) {
                usersList.append(item);
            }
        }
    }
    public handleExternalLogout(message: UserPayloadServer): void {
        const affectedUser = this.users.find(
            (element) => element.login === message.user.login
        );
        if (affectedUser) affectedUser.isLogined = false;

        const usersList = document.querySelector('.users');
        if (usersList) {
            const usersElements = [...usersList.children];
            const userElement = usersElements.find(
                (element) => element.textContent === message.user.login
            );
            if (userElement) {
                const status = userElement.querySelector('.user-status');
                if (status) {
                    status.classList.remove('user-status-active');
                    status.classList.add('user-status-inactive');
                }
            }
        }
    }

    public searchUsers(searchValue: string): void {
        const filteredUsers = this.users.filter((user) =>
            user.login.includes(searchValue)
        );

        drawUsers(filteredUsers);
    }
}
