import { ElementBase } from './element';
import image from './close.svg';
class Modal {
    public modalContainer: ElementBase;
    public modal: ElementBase;
    constructor(content: ElementBase) {
        this.modalContainer = new ElementBase({
            tag: 'div',
            className: ['dark-view'],
        });
        this.modal = new ElementBase({ tag: 'div', className: ['modal'] });
        const spanCross = new ElementBase({
            tag: 'span',
            className: ['icon-close'],
        });

        const crossImage = new Image();
        crossImage.src = image;
        spanCross.element.append(crossImage);
        this.modalContainer.element.append(this.modal.element);
        this.modal.element.append(spanCross.element);
        this.addModalContent(content);
    }
    public addModalContent(content: ElementBase): void {
        this.modal.element.append(content.element);
    }
}
export { Modal };
