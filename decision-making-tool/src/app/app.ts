import { Router } from './components/router';
import { Main } from './components/main';
import { LocalStorage } from './components/localStorage';

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
        window.addEventListener('popstate', () => {
            console.log('popstate event triggered');
            this.router.openPage();
        });
    }
    /*protected getRoutes(): Route[] {
        const routes: Route[] = [
            {
                url: 'options',
                handler: (): void => {
                    if (!this.main.content)
                        this.main.content = new OptionsPage(
                            this.main,
                            this.router
                        );
                    else if (this.main.content instanceof Picker) {
                        this.main.content.wheel.wheelElement.remove();
                        this.main.content.menuContainer.element.remove();
                        this.main.content.time.element.remove();
                        this.main.content.finalOption.element.remove();
                        this.main.content = new OptionsPage(
                            this.main,
                            this.router
                        );
                    } else if (this.main.content instanceof ErrorPage) {
                        this.main.content.text.element.remove();
                        this.main.content.button.element.remove();
                    }
                },
            },
            {
                url: 'decision-picker',
                handler: (): void => {
                    if (this.main.content instanceof OptionsPage) {
                        this.localStorage.saveData(
                            this.main.content.getOptions()
                        );
                        this.main.content.optionsContainer.element.remove();
                        this.main.content.buttonsContainer.element.remove();
                        this.main.content = new Picker(this.main, this.router);
                    } else if (this.main.content instanceof ErrorPage) {
                        this.main.content.text.element.remove();
                        this.main.content.button.element.remove();
                        this.main.content = new Picker(this.main, this.router);
                    } else {
                        const validOptions = getValidOptions();
                        if (validOptions.length >= 2)
                            this.main.content = new Picker(
                                this.main,
                                this.router
                            );
                        else {
                            this.main.content = new OptionsPage(
                                this.main,
                                this.router
                            );
                            history.replaceState(null, '', '/');
                        }
                    }
                },
            },
            {
                url: '',
                handler: (): void => {
                    if (this.main.content instanceof Picker) {
                        this.main.content.wheel.wheelElement.remove();
                        this.main.content.menuContainer.element.remove();
                        this.main.content.time.element.remove();
                        this.main.content.finalOption.element.remove();
                        this.main.content = new OptionsPage(
                            this.main,
                            this.router
                        );
                    } else if (this.main.content instanceof ErrorPage) {
                        this.main.content.text.element.remove();
                        this.main.content.button.element.remove();
                        this.main.content = new OptionsPage(
                            this.main,
                            this.router
                        );
                    } else
                        this.main.content = new OptionsPage(
                            this.main,
                            this.router
                        );
                },
            },
            {
                url: 'error',
                handler: (): void => {
                    if (this.main.content instanceof Picker) {
                        this.main.content.wheel.wheelElement.remove();
                        this.main.content.menuContainer.element.remove();
                        this.main.content.time.element.remove();
                        this.main.content.finalOption.element.remove();
                        this.main.content = new ErrorPage(
                            this.main,
                            this.router
                        );
                    } else if (this.main.content instanceof OptionsPage) {
                        this.localStorage.saveData(
                            this.main.content.getOptions()
                        );
                        this.main.content.optionsContainer.element.remove();
                        this.main.content.buttonsContainer.element.remove();
                        this.main.content = new ErrorPage(
                            this.main,
                            this.router
                        );
                    } else
                        this.main.content = new ErrorPage(
                            this.main,
                            this.router
                        );
                },
            },
        ];

        return routes;
    }*/
}
