import type { Connection } from '../connection/connection';
import type {
    GeneralMessage,
    UserPayloadServer,
    User,
    UserPayloadServerUsers,
    UserServer,
} from '../interfaces';
import { createErrorMessage } from '../components/modal';
import type { Router } from '../components/router';
import {
    isErrorPayload,
    isGeneralMessage,
    isUserPayloadServer,
    isUsersPayloadServer,
} from '../utilities';
import { drawUser, drawUsers } from '../pages/chat';
import type { State } from '../state/state';
import { ResponseTypesUsers } from '../../types';
import {
    updateUserStatusHeader,
    updateUserStatusUsersList,
} from '../pages/chat-handlers';
export class UserService {
    public connection: Connection;
    public currentUser: Partial<User>;
    public users: { login: string; isLogined: boolean }[];
    public router: Router;
    public state: State;
    constructor(connection: Connection, router: Router, state: State) {
        this.connection = connection;
        this.router = router;
        this.currentUser = {};
        this.state = state;
        const savedState = state.getChatState();
        if (
            typeof savedState === 'object' &&
            savedState !== null &&
            'currentUser' in savedState
        ) {
            const savedCurrentUser = savedState.currentUser;
            if (
                typeof savedCurrentUser === 'object' &&
                savedCurrentUser !== null
            )
                this.currentUser = savedCurrentUser;
        }

        this.users = [];
        this.processUserMessages();
    }

    public processUserMessages(): void {
        this.connection.addHandlerPerEvent(
            'message',
            (event: MessageEvent | Event) => {
                if (event instanceof MessageEvent) {
                    const receivedData: unknown = event.data;
                    let data: unknown;
                    if (typeof receivedData === 'string')
                        data = JSON.parse(receivedData);
                    if (isGeneralMessage(data)) {
                        this.userLoginHandler(data);
                        this.userLogoutHandler(data);
                        this.activeUsersHandler(data);
                        this.inactiveUsersHandler(data);
                        this.externalLoginHandler(data);
                        this.externalLogoutHandler(data);
                        errorHandler(data);
                    }
                }
            }
        );
    }
    public userLoginHandler(data: GeneralMessage): void {
        if (
            data.type === ResponseTypesUsers.USER_LOGIN &&
            isUserPayloadServer(data.payload)
        ) {
            this.handleUserLoginMessage(data.payload);
        }
    }
    public userLogoutHandler(data: GeneralMessage): void {
        if (
            data.type === ResponseTypesUsers.USER_LOGOUT &&
            isUserPayloadServer(data.payload)
        ) {
            this.handleUserLogoutMessage(data.payload);
        }
    }
    public activeUsersHandler(data: GeneralMessage): void {
        if (
            data.type === ResponseTypesUsers.USER_ACTIVE &&
            isUsersPayloadServer(data.payload)
        ) {
            this.handleRegisteredUsersMessage(data.payload);
        }
    }

    public inactiveUsersHandler(data: GeneralMessage): void {
        if (
            data.type === ResponseTypesUsers.USER_INACTIVE &&
            isUsersPayloadServer(data.payload)
        ) {
            this.handleRegisteredUsersMessage(data.payload);
        }
    }

    public externalLoginHandler(data: GeneralMessage): void {
        if (
            data.type === ResponseTypesUsers.USER_EXTERNAL_LOGIN &&
            isUserPayloadServer(data.payload)
        ) {
            this.handleExternalLogin(data.payload);
        }
    }
    public externalLogoutHandler(data: GeneralMessage): void {
        if (
            data.type === ResponseTypesUsers.USER_EXTERNAL_LOGOUT &&
            isUserPayloadServer(data.payload)
        ) {
            this.handleExternalLogout(data.payload);
        }
    }

    public handleUserLoginMessage(message: UserPayloadServer): void {
        if (
            message.user.login === this.currentUser?.login &&
            message.user.isLogined
        ) {
            this.updateUsersListAfterLogin(message.user);
            if (globalThis.location.pathname.slice(1) === 'login')
                this.router.openPage('chat');
            this.state.saveChatState({
                currentUser: this.currentUser,
            });
        }
    }
    public updateUsersListAfterLogin(user: UserServer): void {
        if (this.users.some((element) => element.login === user.login)) {
            const index = this.users.findIndex(
                (element) => element.login === user.login
            );

            this.users[index].isLogined = user.isLogined;
        } else {
            this.users.push(user);
        }
    }
    public updateUsersListAfterLogout(): void {
        if (
            this.users.some(
                (element) => element.login === this.currentUser.login
            )
        ) {
            const index = this.users.findIndex(
                (element) => element.login === this.currentUser.login
            );
            this.users.splice(index, 1);
        }
    }

    public handleUserLogoutMessage(message: UserPayloadServer): void {
        if (
            message.user.login === this.currentUser?.login &&
            !message.user.isLogined
        ) {
            this.currentUser = {};
            this.router.chatService.activeChatWith = {};
            this.state.saveChatState({
                currentUser: this.currentUser,
            });
            this.updateUsersListAfterLogout();

            this.router.openPage('login');
        }
    }

    public handleRegisteredUsersMessage(message: UserPayloadServerUsers): void {
        const users = message.users;

        users.forEach((user) => {
            this.updateUsersListAfterLogin(user);
        });

        drawUsers(
            this.users.filter(
                (element) => element.login !== this.currentUser.login
            ),
            this.router.chatService
        );
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
            type: ResponseTypesUsers.USER_ACTIVE,
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
            type: ResponseTypesUsers.USER_INACTIVE,
            payload: null,
        };
        if (this.connection.connection) {
            this.connection.connection.send(JSON.stringify(request));
        }
    }
    public handleExternalLogin(message: UserPayloadServer): void {
        if (
            this.users.some((element) => element.login === message.user.login)
        ) {
            const affectedUser = this.users.find(
                (element) => element.login === message.user.login
            );
            if (affectedUser) affectedUser.isLogined = true;
            updateUserStatusUsersList(message.user);
            updateUserStatusHeader(message.user);
        } else {
            this.users.push(message.user);
            drawUser(message.user);
        }
    }
    public handleExternalLogout(message: UserPayloadServer): void {
        const affectedUser = this.users.find(
            (element) => element.login === message.user.login
        );
        if (affectedUser) affectedUser.isLogined = false;

        updateUserStatusUsersList(message.user);
        updateUserStatusHeader(message.user);
    }

    public searchUsers(searchValue: string): void {
        const usersWithoutCurrent = this.users.filter(
            (element) => element.login !== this.currentUser.login
        );
        const filteredUsers = usersWithoutCurrent.filter((user) =>
            user.login.includes(searchValue)
        );

        drawUsers(filteredUsers, this.router.chatService);
    }
}

function errorHandler(data: GeneralMessage): void {
    if (
        data.type === ResponseTypesUsers.ERROR &&
        isErrorPayload(data.payload)
    ) {
        const errorPayload = data.payload;
        createErrorMessage(errorPayload.error);
    }
}
function prepareUserLogoutRequest(userService: UserService): GeneralMessage {
    const currentUserName = userService.currentUser.login;
    const currentUserPassword = userService.currentUser.password;
    let loginValue = '';
    let passwordValue = '';
    if (currentUserName && currentUserPassword) {
        loginValue = currentUserName;
        passwordValue = currentUserPassword;
    }

    const id = crypto.randomUUID();
    const userRequest: GeneralMessage = {
        id: id,
        type: ResponseTypesUsers.USER_LOGOUT,
        payload: {
            user: {
                login: loginValue,
                password: passwordValue,
            },
        },
    };

    return userRequest;
}

function prepareUserRequest(
    connection: Connection,
    userService: UserService
): GeneralMessage {
    const loginElement = document.querySelector('.user-name-input');
    const loginValue =
        loginElement instanceof HTMLInputElement ? loginElement.value : '';
    const passwordElement = document.querySelector('.password-input');
    const passwordValue =
        passwordElement instanceof HTMLInputElement
            ? passwordElement.value
            : '';
    connection.userIdRequest = crypto.randomUUID();
    const userRequest: GeneralMessage = {
        id: connection.userIdRequest,
        type: ResponseTypesUsers.USER_LOGIN,
        payload: {
            user: {
                login: loginValue,
                password: passwordValue,
            },
        },
    };
    userService.currentUser = { login: loginValue, password: passwordValue };

    return userRequest;
}
export { prepareUserLogoutRequest, prepareUserRequest };
