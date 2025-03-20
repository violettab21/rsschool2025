import type { Properties } from '../interfaces';
import type { CustomElement } from '../interfaces';

export class ElementBase {
    public element: CustomElement;
    protected properties: Properties;

    constructor(properties: Properties) {
        this.properties = properties;
        this.element = this.createElement();
        this.addClasses();
        this.setContent();
    }

    public createElement(): CustomElement {
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
function removeAllChildElements(element: HTMLElement | Element): void {
    const childrenElementsCount = element.children.length;
    if (childrenElementsCount !== 0) {
        const children = [...element.children].slice(1);
        children.forEach((child) => {
            child.remove();
        });
    }
}
export { removeAllChildElements };
