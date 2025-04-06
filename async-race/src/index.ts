import './sass/_style.scss';
import { Main } from './app/components/main';
import { Router } from './app/components/router';
import { State } from './app/state/state';
const main = new Main();
const state = new State();
const router = new Router(main, state);

document.addEventListener('DOMContentLoaded', () => {
    router.openPage();
});
globalThis.addEventListener('popstate', () => {
    router.openPage();
});
