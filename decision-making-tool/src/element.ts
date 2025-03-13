import type { Properties } from './interfaces';

export class ElementBase {
    public properties: Properties;

    public element: HTMLElement | HTMLInputElement | HTMLTextAreaElement;
    constructor(properties: Properties) {
        this.properties = properties;
        this.element = this.createElement();
        this.addClasses();
        this.setContent();
    }
    public createElement():
        | HTMLElement
        | HTMLInputElement
        | HTMLTextAreaElement {
        const element = document.createElement(this.properties.tag);
        return element;
    }

    public addClasses(): void {
        this.properties.className.forEach((className) =>
            this.element.classList.add(className)
        );
    }

    public setContent(): void {
        this.element.textContent = this.properties.textContent
            ? this.properties.textContent
            : '';
    }
}
