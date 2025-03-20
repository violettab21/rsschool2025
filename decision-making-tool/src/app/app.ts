import { Router } from './components/router';
import { Main } from './components/main';
import { LocalStorage } from './components/local-storage';

export class App {
    public router: Router;
    public localStorage: LocalStorage;
    public main: Main;
    constructor() {
        this.main = new Main();
        this.localStorage = new LocalStorage('decision-maker_options');

        this.router = new Router(this.main, this.localStorage);
        document.addEventListener('DOMContentLoaded', () => {
            this.router.openPage();
        });
        globalThis.addEventListener('popstate', () => {
            console.log('popstate event triggered');
            this.router.openPage();
        });
    }
}
