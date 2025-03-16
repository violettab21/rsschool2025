import { Button } from './button';
import { ElementBase } from './element';
import type { Main } from './main';
import type { Router } from './router';

export class ErrorPage {
    public text: ElementBase;
    public button: Button;
    constructor(main: Main, router: Router) {
        this.text = new ElementBase({
            tag: 'p',
            className: ['error-text'],
            textContent: 'Page not found',
        });
        this.button = new Button({
            className: ['back'],
            textContent: 'Back to main page',
            handlerFunction: (): void => router.openPage('/'),
        });

        main.main.element.append(this.text.element, this.button.element);
    }
}
