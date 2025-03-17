import './index.html';
import './_style.scss';
import { Main } from './main';
import { Router } from './router';
import { Picker } from './picker';
import { OptionsPage } from './options';
import { LocalStorage } from './localStorage';
import { ErrorPage } from './error-page';
import { getValidOptions } from './canvas';
interface Route {
    url: string;
    handler: () => void;
}
const router = new Router(getRoutes());
const localStorage = new LocalStorage('decision-maker_options');
document.addEventListener('DOMContentLoaded', () => {
    router.openPage();
});
window.addEventListener('popstate', () => {
    console.log('event triggered');
    router.openPage();
});
const main = new Main();

function getRoutes(): Route[] {
    const routes: Route[] = [
        {
            url: 'options',
            handler: (): void => {
                if (!main.content) main.content = new OptionsPage(main, router);
                else if (main.content instanceof Picker) {
                    main.content.wheel.wheelElement.remove();
                    main.content.menuContainer.element.remove();
                    main.content.time.element.remove();
                    main.content.finalOption.element.remove();
                    main.content = new OptionsPage(main, router);
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
                    main.content = new Picker(main, router);
                } else if (main.content instanceof ErrorPage) {
                    main.content.text.element.remove();
                    main.content.button.element.remove();
                    main.content = new Picker(main, router);
                } else {
                    const validOptions = getValidOptions();
                    if (validOptions.length >= 2)
                        main.content = new Picker(main, router);
                    else {
                        main.content = new OptionsPage(main, router);
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
                    main.content = new OptionsPage(main, router);
                } else if (main.content instanceof ErrorPage) {
                    main.content.text.element.remove();
                    main.content.button.element.remove();
                    main.content = new OptionsPage(main, router);
                } else main.content = new OptionsPage(main, router);
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
                    main.content = new ErrorPage(main, router);
                } else if (main.content instanceof OptionsPage) {
                    localStorage.saveData(main.content.getOptions());
                    main.content.optionsContainer.element.remove();
                    main.content.buttonsContainer.element.remove();
                    main.content = new ErrorPage(main, router);
                } else main.content = new ErrorPage(main, router);
            },
        },
    ];

    return routes;
}
