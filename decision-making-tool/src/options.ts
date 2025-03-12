import { Button } from './button';
import { ElementBase } from './element';
class OptionsPage {
    public buttonsContainer: ElementBase;
    public optionsContainer?: ElementBase;

    constructor() {
        this.buttonsContainer = new ElementBase({
            tag: 'div',
            className: ['buttons'],
        });
        this.configureButtonsView();
        this.configureOptionsView();
    }

    public configureButtonsView(): void {
        const addOptions = new Button({
            className: ['add_option'],
            textContent: 'Add Option',
            handlerFunction: this.addOptionElement.bind(this),
        });
        const start = new Button({
            className: ['start'],
            textContent: 'Start',
            handlerFunction: this.addOptionElement.bind(this),
        });
        this.buttonsContainer.element.append(addOptions.element, start.element);
        document.querySelector('body')?.append(this.buttonsContainer.element);
    }
    public configureOptionsView(): void {
        this.optionsContainer = new ElementBase({
            tag: 'div',
            className: ['options'],
        });
        document.querySelector('body')?.prepend(this.optionsContainer.element);
    }
    public addOptionElement(): void {
        const option = new ElementBase({ tag: 'div', className: ['option'] });
        const number = new ElementBase({
            tag: 'p',
            className: ['optition__number'],
            textContent: '#1',
        });
        const name = new ElementBase({
            tag: 'input',
            className: ['optition__input'],
        });
        const weight = new ElementBase({
            tag: 'input',
            className: ['optition__input'],
        });
        const deleteBtn = new Button({
            className: ['delete'],
            textContent: 'Delete',
            handlerFunction: this.addOptionElement.bind(this),
        });
        option.element.append(
            number.element,
            name.element,
            weight.element,
            deleteBtn.element
        );

        this.optionsContainer?.element.append(option.element);
    }
}

export { OptionsPage };
