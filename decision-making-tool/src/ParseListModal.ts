import { ElementBase } from './element';
import { Button } from './button';
import { Modal } from './modal';
import type { OptionsPage } from './options';
export class ParseListModal extends Modal {
    public inputForParse?: HTMLTextAreaElement;
    public page: OptionsPage;
    constructor(page: OptionsPage) {
        super();
        const textarea = new ElementBase({
            tag: 'textarea',
            className: ['textarea'],
        });
        this.page = page;
        if (textarea.element instanceof HTMLTextAreaElement)
            this.inputForParse = textarea.element;
        this.configureModal();
    }
    public configureModal(): void {
        const modalContent = new ElementBase({
            tag: 'div',
            className: ['modal-content'],
        });

        const modalButtons = new ElementBase({
            tag: 'div',
            className: ['modal__buttons'],
        });
        const createButton = new Button({
            className: ['button', 'button__confirm'],
            textContent: 'Confirm',
            handlerFunction: this.createOptionsFromInput.bind(this),
        });
        const cancelButton = new Button({
            className: ['button', 'button__cancel'],
            textContent: 'Cancel',
            handlerFunction: this.closeModal.bind(this),
        });
        modalButtons.element.append(createButton.element, cancelButton.element);
        if (this.inputForParse)
            modalContent.element.append(
                this.inputForParse,
                modalButtons.element
            );
        this.addModalContent(modalContent);
    }
    public createOptionsFromInput(): void {
        const options = this.parseInput();
        this.page.addOptionElements(options);
        this.closeModal();
    }
    protected parseInput(): {
        title: string;
        weight: string;
    }[] {
        const inputText = this.inputForParse?.value;
        if (inputText) {
            const listOfRows = inputText.split('\n');
            const arrayOfOptions = listOfRows.map((row) => {
                const [title, weight] = row.split(',');
                return { title: title, weight: weight };
            });
            return arrayOfOptions;
        } else return [{ title: '', weight: '' }];
    }
}
