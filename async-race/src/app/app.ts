import { Router } from './components/router';
import { Main } from './components/main';
import { State } from './state/state';

export class App {
    public router: Router;
    public state: State;
    public main: Main;
    constructor() {
        this.main = new Main();
        this.state = new State();

        this.router = new Router(this.main, this.state);
        document.addEventListener('DOMContentLoaded', () => {
            this.router.openPage();
        });
        globalThis.addEventListener('popstate', () => {
            console.log('popstate event triggered');
            this.router.openPage();
        });
    }
}
