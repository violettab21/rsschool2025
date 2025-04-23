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

const connectionValue = connection.connection;
document.addEventListener('DOMContentLoaded', () => {
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
            if (connectionValue?.readyState === 1)
                router.userService.sendUserMessage(userRequest);
        }
        if (connectionValue?.readyState === 1) router.openPage();
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
    connection.addHandlerPerEvent('error', () => {
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
});
globalThis.addEventListener('popstate', () => {
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
            if (connectionValue?.readyState === 1)
                router.userService.sendUserMessage(userRequest);
        }

        if (connectionValue?.readyState === 1) router.openPage();
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
    connection.addHandlerPerEvent('error', () => {
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
});
