import { ElementBase } from './element';
import image from '../../assets/close.svg';
class Modal {
    public modalContainer: ElementBase;
    public modal: ElementBase;
    constructor() {
        this.modalContainer = new ElementBase({
            tag: 'div',
            className: ['dark-view'],
        });
        this.modal = new ElementBase({ tag: 'div', className: ['modal'] });
        this.configureBaseModal();
    }

    public addModalContent(content: ElementBase): void {
        this.modal.element.append(content.element);
    }

    public closeModal(): void {
        this.modalContainer.element.remove();
    }

    public closeModalOnEsc(): void {
        document.addEventListener('keydown', (event) => {
            if (event.code == 'Escape') {
                this.closeModal();
            }
        });
    }

    public closeModalOutsideClick(): void {
        this.modalContainer.element.addEventListener('click', (event) => {
            if (event.target === event.currentTarget) this.closeModal();
        });
    }

    protected configureBaseModal(): void {
        const spanCross = new ElementBase({
            tag: 'span',
            className: ['icon-close'],
        });
        spanCross.element.addEventListener('click', () => {
            this.closeModal();
        });

        const crossImage = new Image();
        crossImage.src = image;

        spanCross.element.append(crossImage);
        this.modalContainer.element.append(this.modal.element);
        this.modal.element.append(spanCross.element);
        this.closeModalOnEsc();
        this.closeModalOutsideClick();
    }
}
export { Modal };
