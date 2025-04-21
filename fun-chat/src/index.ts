import { Connection } from './app/connection/connection';
import './sass/_style.scss';
import { createBaseContainer } from './app/pages/main-base';
import { State } from './app/state/state';
import { Router } from './app/components/router';
import type { GeneralMessage } from './app/interfaces';
import { createErrorMessage } from './app/components/modal';
const connection = new Connection();
connection.connect();
createBaseContainer();
const state = new State();
const router = new Router(connection, state);

connection.addHandlerPerEvent('open', () => {
    const reconnectMessage = document.querySelector('.reconnect-message');
    if (reconnectMessage) reconnectMessage.remove();
    const currentUser = router.userService.currentUser;
    if (
        'login' in currentUser &&
        currentUser.login &&
        'password' in currentUser &&
        currentUser.password
    ) {
        const userRequest: GeneralMessage = {
            id: crypto.randomUUID(),
            type: 'USER_LOGIN',
            payload: {
                user: {
                    login: currentUser.login,
                    password: currentUser.password,
                },
            },
        };
        router.userService.sendUserMessage(userRequest);
    }

    router.openPage();
});
connection.addHandlerPerEvent('close', () => {
    if (document.querySelector('.reconnect-message')) connection.connect();
    else {
        createErrorMessage('reconnecting...');

        document.querySelector('.icon-close')?.remove();

        document
            .querySelector('.dark-view')
            ?.classList.add('reconnect-message');
        connection.connect();
    }
});
const connectionValue = connection.connection;
document.addEventListener('DOMContentLoaded', () => {
    if (connectionValue && connectionValue.readyState === 1) router.openPage();
});
globalThis.addEventListener('popstate', () => {
    if (connectionValue && connectionValue.readyState === 1) router.openPage();
});
