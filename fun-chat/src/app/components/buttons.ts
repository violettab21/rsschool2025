import type { ButtonProperties } from '../interfaces';
import type { Properties } from '../interfaces';
import { ElementBase } from './elements';

export class Button extends ElementBase {
    constructor(buttonProperties: ButtonProperties) {
        const properties: Properties = {
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
                handler(event);
            });
        } catch (error) {
            console.error(error);
        }
    }
}
