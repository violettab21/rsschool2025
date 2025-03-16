import { Button } from './button';
import { ElementBase } from './element';
import { ParseListModal } from './ParseListModal';
import type { Main } from './main';
import type { Router } from './router';
export interface Option {
    id?: string;
    title: string;
    weight: string;
}
class OptionsPage {
    public buttonsContainer: ElementBase;
    public optionsContainer: ElementBase;
    constructor(main: Main, router: Router) {
        this.buttonsContainer = new ElementBase({
            tag: 'div',
            className: ['buttons'],
        });
        this.optionsContainer = new ElementBase({
            tag: 'div',
            className: ['options'],
        });
        this.configureButtonsView(main, router);
        this.configureOptionsView();
    }

    public configureButtonsView(main: Main, router: Router): void {
        const addOptions = new Button({
            className: ['add_option'],
            textContent: 'Add Option',
            handlerFunction: this.addOptionElement.bind(this),
        });
        const start = new Button({
            className: ['start'],
            textContent: 'Start',
            handlerFunction: (): void => {
                router.openPage('decision-picker');
            },
        });
        const parseList = new Button({
            className: ['parse_list'],
            textContent: 'Parse List',
            handlerFunction: this.parseListHandler.bind(
                this,
                main.main.element
            ),
        });
        const saveToJSON = new Button({
            className: ['save'],
            textContent: 'Save options to File',
            handlerFunction: this.saveOptionsToFile.bind(this),
        });
        const inputFile = new ElementBase({
            tag: 'input',
            className: ['file-input'],
        });
        inputFile.element.id = 'upload-file';
        if (inputFile.element instanceof HTMLInputElement) {
            const input = inputFile.element;
            input.type = 'file';
            input.addEventListener('change', () => {
                console.log('readfile');
                let listOfOptions: Option[];
                if (input.files) {
                    console.log('readfile2');
                    const file = input.files[0];
                    console.log(file);
                    const reader = new FileReader();
                    reader.readAsText(file);
                    reader.addEventListener('load', () => {
                        if (typeof reader.result === 'string') {
                            const result = reader.result;
                            if (typeof JSON.parse(result) === 'object') {
                                listOfOptions = JSON.parse(result) as Option[];
                                console.log(listOfOptions);
                                this.clearAllOptions();
                                this.addOptionElements(listOfOptions);
                            }
                        }
                    });
                }
            });
            if (input.type === 'file') {
                input.accept = 'application/json';
            }
        }
        inputFile.element.style.display = 'none';

        const upload = new Button({
            className: ['upload'],
            textContent: 'Upload options from File',
            handlerFunction: (): void => {
                const upload = document.getElementById('upload-file');
                if (upload !== null) {
                    upload.click();
                }
            },
        });
        const clear = new Button({
            className: ['clear'],
            textContent: 'Clear All Options',
            handlerFunction: this.clearAllOptions.bind(this),
        });
        this.buttonsContainer.element.append(
            addOptions.element,
            start.element,
            parseList.element,
            saveToJSON.element,
            upload.element,
            inputFile.element,
            clear.element
        );
        main.main.element?.append(this.buttonsContainer.element);
    }

    public configureOptionsView(): void {
        this.buttonsContainer.element.before(this.optionsContainer.element);
        this.addOptionElement();
    }
    public addOptionElement(optionData?: Option): void {
        const option = new ElementBase({
            tag: 'div',
            className: ['option'],
        });
        const id = optionData?.id
            ? optionData.id
            : `#${this.generateIdForOption()}`;
        const number = new ElementBase({
            tag: 'p',
            className: ['option__number'],
            textContent: id,
        });

        const name = new ElementBase({
            tag: 'input',
            className: ['option__input'],
        });
        if (name.element instanceof HTMLInputElement && optionData?.title)
            name.element.value = optionData.title;
        const weight = new ElementBase({
            tag: 'input',
            className: ['option__input'],
        });
        if (weight.element instanceof HTMLInputElement && optionData?.weight)
            weight.element.value = optionData.weight;
        const deleteBtn = new Button({
            className: ['delete'],
            textContent: 'Delete',
            handlerFunction: function (event?: Event): void {
                if (event) {
                    const optionToDelete = (event.target as Node).parentElement;
                    if (optionToDelete) optionToDelete.remove();
                }
            },
        });
        option.element.append(
            number.element,
            name.element,
            weight.element,
            deleteBtn.element
        );

        this.optionsContainer?.element.append(option.element);
    }
    public addOptionElements(optionData: Option[]): void {
        optionData.forEach((option) => this.addOptionElement(option));
    }
    public generateIdForOption(): number {
        let value: string | null;
        let id: number = 0;
        const numberChildren = this.optionsContainer.element.children.length;
        if (numberChildren === 0) return 1;
        else {
            const lastChild: Element | null =
                this.optionsContainer.element.children.item(numberChildren - 1);
            if (lastChild !== null) {
                value = lastChild.children.item(0)!.textContent;
                if (value) id = parseInt(value.slice(1));
            }
        }
        return id + 1;
    }
    public parseListHandler(main: HTMLElement): void {
        const modal = new ParseListModal(this);
        main.append(modal.modalContainer.element);
    }
    public saveOptionsToFile(): void {
        const json = JSON.stringify(this.getOptions());
        const file = new File([json], 'options.json', {
            type: 'application/json',
        });
        const url = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'options.json';
        link.click();
    }

    public clearAllOptions(): void {
        const numberChildren = this.optionsContainer.element.children.length;
        if (numberChildren !== 0) {
            const options = this.optionsContainer.element.children;
            Array.from(options).forEach((el) => el.remove());
        }
    }
    public getOptions(): Option[] {
        const numberChildren = this.optionsContainer.element.children.length;
        const optionsList: Option[] = [];
        if (numberChildren !== 0) {
            const options = this.optionsContainer.element.children;
            for (const child of options) {
                const optionDetails = Array.from(child.children).slice(0, 3);
                const listOfValues = optionDetails.map((element) => {
                    if (element instanceof HTMLInputElement) {
                        return element.value ? element.value : '';
                    } else
                        return element.textContent ? element.textContent : '';
                });
                const [id, title, weight] = listOfValues;
                const option: Option = { id: id, title: title, weight: weight };
                optionsList.push(option);
            }
        }
        return optionsList;
    }
}
export { OptionsPage };
