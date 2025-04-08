import type { Route } from '../interfaces';
import type { Main } from './main';
import { removeChildren } from './elements';
import { Winners } from '../pages/winners';
import { GaragePage } from '../pages/garage/garage-page';
import type { State } from '../state/state';
export class Router {
    public routes: Route[];
    public main: Main;
    public state: State;
    constructor(main: Main, state: State) {
        this.routes = this.setRoutes();
        this.main = main;
        this.state = state;
    }
    public openPage(path?: string): void {
        const isHistory: boolean = path !== undefined;
        if (isHistory) {
            history.pushState(null, '', path);
        }
        const url = globalThis.location.pathname.slice(1);
        const selectedRoute = this.routes.find(
            (element) => element.url === url
        );
        if (selectedRoute) {
            selectedRoute.handler();
        }
    }
    protected setRoutes(): Route[] {
        const routes: Route[] = [
            {
                url: 'garage',
                handler: this.configureGaragePage.bind(this),
            },
            {
                url: 'winners',
                handler: this.configureWinnersPage.bind(this),
            },
            {
                url: '',
                handler: this.configureGaragePage.bind(this),
            },
        ];

        return routes;
    }
    protected configureGaragePage(): void {
        if (this.main.content) {
            removeChildren(this.main.main);
        }
        this.main.content = new GaragePage(this.main, this, this.state);
    }

    protected configureWinnersPage(): void {
        if (this.main.content) {
            removeChildren(this.main.main);
        }
        this.main.content = new Winners(this.main, this, this.state);
    }
}
