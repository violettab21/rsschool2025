import { Connection } from './app/connection/connection';
import './sass/_style.scss';
import { createBaseContainer } from './app/pages/main-base';
import { State } from './app/state/state';
import { Router } from './app/components/router';
import type { GeneralMessage } from './app/interfaces';
import { createErrorMessage } from './app/components/modal';
const connection = new Connection();

createBaseContainer();
const state = new State();
const router = new Router(connection, state);
console.log(connection.listeners.open);

connection.addHandlerPerEvent('open', () => {
    console.log(connection.listeners.open);

    const reconnectMessage = document.querySelector('.reconnect-message');
    if (reconnectMessage) reconnectMessage.remove();
    const currentUser = router.userService.currentUser;
    router.userService.getAllActiveUsers();
    router.userService.getAllInactiveUsers();
    console.log(currentUser.login);
    const currentUserDetails = router.userService.users.find(
        (element) => element.login === router.userService.currentUser.login
    );
    if (currentUserDetails?.isLogined) {
        router.openPage();
    } else {
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
            router.openPage();
            router.userService.sendUserMessage(userRequest);
        }
        router.openPage();
    }
});
connection.addHandlerPerEvent('close', () => {
    if (document.querySelector('.reconnect-message')) {
        router.userService.users = [];
        connection.connect();
    } else {
        createErrorMessage('reconnecting...');

        document.querySelector('.icon-close')?.remove();

        document
            .querySelector('.dark-view')
            ?.classList.add('reconnect-message');
        connection.connect();
    }
});

connection.connect();

globalThis.addEventListener('popstate', () => {
    router.openPage();
});
