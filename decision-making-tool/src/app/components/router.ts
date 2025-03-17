import type { Route } from '../interfaces';
import { OptionsPage } from '../pages/options';
import { ErrorPage } from '../pages/error-page';
import { Picker } from '../pages/picker';
import type { Main } from './main';
import type { LocalStorage } from './localStorage';
import { getValidOptions } from './canvas';
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
            console.log('added to history');
        }
        const url = window.location.pathname.substring(1);
        const selectedRoute = this.routes.find(
            (element) => element.url === url
        );
        if (selectedRoute) {
            selectedRoute.handler();
        } else {
            console.log('not found');
            this.routes[3].handler();
        }
    }
    protected setRoutes(main: Main, localStorage: LocalStorage): Route[] {
        const routes: Route[] = [
            {
                url: 'options',
                handler: (): void => {
                    if (!main.content)
                        main.content = new OptionsPage(main, this);
                    else if (main.content instanceof Picker) {
                        main.content.wheel.wheelElement.remove();
                        main.content.menuContainer.element.remove();
                        main.content.time.element.remove();
                        main.content.finalOption.element.remove();
                        main.content = new OptionsPage(main, this);
                    } else if (main.content instanceof ErrorPage) {
                        main.content.text.element.remove();
                        main.content.button.element.remove();
                    }
                },
            },
            {
                url: 'decision-picker',
                handler: (): void => {
                    if (main.content instanceof OptionsPage) {
                        localStorage.saveData(main.content.getOptions());
                        main.content.optionsContainer.element.remove();
                        main.content.buttonsContainer.element.remove();
                        main.content = new Picker(main, this);
                    } else if (main.content instanceof ErrorPage) {
                        main.content.text.element.remove();
                        main.content.button.element.remove();
                        main.content = new Picker(main, this);
                    } else {
                        const validOptions = getValidOptions();
                        if (validOptions.length >= 2)
                            main.content = new Picker(main, this);
                        else {
                            main.content = new OptionsPage(main, this);
                            history.replaceState(null, '', '/');
                        }
                    }
                },
            },
            {
                url: '',
                handler: (): void => {
                    if (main.content instanceof Picker) {
                        main.content.wheel.wheelElement.remove();
                        main.content.menuContainer.element.remove();
                        main.content.time.element.remove();
                        main.content.finalOption.element.remove();
                        main.content = new OptionsPage(main, this);
                    } else if (main.content instanceof ErrorPage) {
                        main.content.text.element.remove();
                        main.content.button.element.remove();
                        main.content = new OptionsPage(main, this);
                    } else main.content = new OptionsPage(main, this);
                },
            },
            {
                url: 'error',
                handler: (): void => {
                    if (main.content instanceof Picker) {
                        main.content.wheel.wheelElement.remove();
                        main.content.menuContainer.element.remove();
                        main.content.time.element.remove();
                        main.content.finalOption.element.remove();
                        main.content = new ErrorPage(main, this);
                    } else if (main.content instanceof OptionsPage) {
                        localStorage.saveData(main.content.getOptions());
                        main.content.optionsContainer.element.remove();
                        main.content.buttonsContainer.element.remove();
                        main.content = new ErrorPage(main, this);
                    } else main.content = new ErrorPage(main, this);
                },
            },
        ];

        return routes;
    }
}
