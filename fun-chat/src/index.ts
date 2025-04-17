import { Connection } from './app/connection/connection';
import './sass/_style.scss';
import { createBaseContainer } from './app/pages/main-base';
import { UserService } from './app/pages/user-service';
import { Router } from './app/components/router';
const connection = new Connection();
connection.connect();
const userService = new UserService(connection);
createBaseContainer();
const router = new Router(connection, userService);
document.addEventListener('DOMContentLoaded', () => {
    router.openPage();
});
globalThis.addEventListener('popstate', () => {
    console.log('popstate event triggered');

    router.openPage();
});
