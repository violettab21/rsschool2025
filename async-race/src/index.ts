import './sass/_style.scss';
import { Main } from './app/components/main';
import { Router } from './app/components/router';
const main = new Main();
const router = new Router(main);
document.addEventListener('DOMContentLoaded', () => {
    router.openPage();
});
globalThis.addEventListener('popstate', () => {
    router.openPage();
});
