import type { Route } from '../interfaces';
import { OptionsPage } from '../pages/options';
import { ErrorPage } from '../pages/error-page';
import { Picker } from '../pages/picker';
import type { Main } from './main';
import type { LocalStorage } from './localStorage';
import { getValidOptions } from './canvas';
import { removeAllChildElements } from './element';
import { pagePath } from '../enums';
export class Router {
    public routes: Route[];
    constructor(main: Main, localStorage: LocalStorage) {
        this.routes = [];
        this.routes = this.setRoutes(main, localStorage);
    }
    public openPage(path?: string): void {
        const isHistory: boolean = path !== undefined;
        if (isHistory) {
            history.pushState(null, '', path);
        }
        const url = window.location.pathname.substring(1);
        const selectedRoute = this.routes.find(
            (element) => element.url === url
        );
        if (selectedRoute) {
            selectedRoute.handler();
        } else {
            this.routes[3].handler();
        }
    }
    protected setRoutes(main: Main, localStorage: LocalStorage): Route[] {
        const routes: Route[] = [
            {
                url: pagePath.OPTIONS,
                handler: (): void => {
                    this.configureOptionsPage(main, localStorage);
                },
            },
            {
                url: pagePath.PICKER,
                handler: (): void => {
                    this.configurePickerPage(main, localStorage);
                },
            },
            {
                url: pagePath.DEFAULT,
                handler: (): void => {
                    this.configureOptionsPage(main, localStorage);
                },
            },
            {
                url: pagePath.ERROR,
                handler: (): void => {
                    this.configureErrorPage(main, localStorage);
                },
            },
        ];

        return routes;
    }
    protected configureOptionsPage(
        main: Main,
        localStorage: LocalStorage
    ): void {
        if (!main.content)
            main.content = new OptionsPage(main, this, localStorage);
        else {
            removeAllChildElements(main.main.element);
            main.content = new OptionsPage(main, this, localStorage);
        }
    }

    protected configurePickerPage(
        main: Main,
        localStorage: LocalStorage
    ): void {
        if (!main.content) {
            const validOptions = getValidOptions(localStorage);
            if (validOptions.length < 2) {
                main.content = new OptionsPage(main, this, localStorage);
                history.replaceState(null, '', '/');
                return;
            }
            main.content = new Picker(main, this, localStorage);
            return;
        }
        if (main.content instanceof OptionsPage) {
            localStorage.saveData(main.content.getOptions());
        }
        removeAllChildElements(main.main.element);
        main.content = new Picker(main, this, localStorage);
    }
    protected configureErrorPage(main: Main, localStorage: LocalStorage): void {
        if (!main.content) {
            main.content = new ErrorPage(main, this);
            return;
        }

        if (main.content instanceof OptionsPage) {
            localStorage.saveData(main.content.getOptions());
        }
        removeAllChildElements(main.main.element);
        main.content = new ErrorPage(main, this);
    }
}
