import type { Properties } from './interfaces';

export class ElementBase {
    public properties: Properties;
    public element: HTMLElement;
    constructor(properties: Properties) {
        this.properties = properties;
        this.element = this.createElement();
        this.addClasses();
        this.setContent();
    }
    public createElement(): HTMLElement {
        return document.createElement(this.properties.tag);
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
