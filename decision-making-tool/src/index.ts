import './index.html';
import './_style.scss';
import { Main } from './main';
import { Router } from './router';
import { Picker } from './picker';
import { OptionsPage } from './options';
import { LocalStorage } from './localStorage';

interface Route {
    url: string;
    handler: () => void;
}
const router = new Router(getRoutes());
const main = new Main(router);

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
                }
            },
        },
        {
            url: 'decision-picker',
            handler: (): void => {
                if (main.content instanceof OptionsPage) {
                    const localStorage = new LocalStorage(
                        'decision-maker_options'
                    );
                    localStorage.saveData(main.content.getOptions());
                    main.content.optionsContainer.element.remove();
                    main.content.buttonsContainer.element.remove();
                    main.content = new Picker(main, router);
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
                } else main.content = new OptionsPage(main, router);
            },
        },
    ];

    return routes;
}
