import type { ButtonProperties } from './interfaces';
import { ElementBase } from './element';

export class Button extends ElementBase {
    constructor(buttonProperties: ButtonProperties) {
        const properties = {
            tag: 'button',
            className: buttonProperties.className,
            textContent: buttonProperties.textContent,
        };
        super(properties);
        this.addHandler(buttonProperties.handlerFunction);
    }
    public addHandler(handler: (event?: Event) => void): void {
        try {
            this.element.addEventListener('click', (event: Event) => {
                if ((event.target as HTMLElement).textContent === 'Delete')
                    handler(event);
                else handler();
            });
        } catch (e) {
            console.error(e);
        }
    }
}
