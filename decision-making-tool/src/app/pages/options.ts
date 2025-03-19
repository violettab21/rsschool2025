import { Button } from '../components/button';
import { ElementBase } from '../components/element';
import { ParseListModal } from '../components/ParseListModal';
import { Modal } from '../components/modal';
import type { Main } from '../components/main';
import type { Router } from '../components/router';
import type { LocalStorage } from '../components/localStorage';
import { getValidOptions } from '../components/canvas';
import type { Option } from '../interfaces';

class OptionsPage {
    public buttonsContainer: ElementBase;
    public optionsContainer: ElementBase;
    public options: Option[] | null;
    public optionsStorage: LocalStorage;
    constructor(main: Main, router: Router, optionsStorage: LocalStorage) {
        this.optionsStorage = optionsStorage;
        this.buttonsContainer = new ElementBase({
            tag: 'div',
            className: ['buttons'],
        });
        this.optionsContainer = new ElementBase({
            tag: 'div',
            className: ['options'],
        });
        this.options = [];
        this.getOptionsFromStorage();
        this.configureButtonsView(main, router);
        this.configureOptionsView();
    }

    public configureButtonsView(main: Main, router: Router): void {
        this.configureAddOptionButton();
        this.configureStartButton(main, router);
        const parseList = new Button({
            className: ['parse_list'],
            textContent: 'Paste List',
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
        this.configureFileLoadControls();
        const clear = new Button({
            className: ['clear'],
            textContent: 'Clear All Options',
            handlerFunction: (): void => {
                this.clearAllOptions.call(this);
                this.optionsStorage.saveData(this.getOptions());
            },
        });
        this.buttonsContainer.element.append(
            parseList.element,
            saveToJSON.element,
            clear.element
        );
        main.main.element?.append(this.buttonsContainer.element);
    }

    public configureFileLoadControls(): void {
        const inputFile = new ElementBase({
            tag: 'input',
            className: ['file-input'],
        });
        this.configureFileInput(inputFile);

        const upload = new Button({
            className: ['upload'],
            textContent: 'Upload options from File',
            handlerFunction: (): void => {
                const upload = inputFile.element;
                if (upload !== null) {
                    upload.click();
                }
            },
        });
        this.buttonsContainer.element.append(upload.element, inputFile.element);
    }
    public configureFileInput(inputFile: ElementBase): void {
        inputFile.element.id = 'upload-file';
        if (inputFile.element instanceof HTMLInputElement) {
            const input = inputFile.element;
            input.type = 'file';
            input.addEventListener('change', () => {
                let listOfOptions: Option[];
                if (input.files) {
                    const file = input.files[0];

                    const reader = new FileReader();
                    reader.readAsText(file);
                    reader.addEventListener('load', () => {
                        if (typeof reader.result === 'string') {
                            const result = reader.result;
                            const receivedData: unknown = JSON.parse(result);
                            if (isOptions(receivedData)) {
                                listOfOptions = receivedData;
                                this.clearAllOptions();
                                this.addOptionElements(listOfOptions);
                                this.optionsStorage.saveData(this.getOptions());
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
    }
    public configureAddOptionButton(): void {
        const addOptions = new Button({
            className: ['add_option'],
            textContent: 'Add Option',
            handlerFunction: (): void => {
                this.addOptionElement.call(this);

                this.optionsStorage.saveData(this.getOptions());
            },
        });
        this.buttonsContainer.element.append(addOptions.element);
    }

    public configureStartButton(main: Main, router: Router): void {
        const start = new Button({
            className: ['start'],
            textContent: 'Start',
            handlerFunction: (): void => {
                if (getValidOptions(this.optionsStorage).length < 2) {
                    const modal = new Modal();
                    const modalContent = new ElementBase({
                        tag: 'p',
                        className: ['modal-message'],
                        textContent:
                            'Please, create at least 2 options with title and weight',
                    });
                    modal.modal.element.append(modalContent.element);
                    main.main.element.append(modal.modalContainer.element);
                } else router.openPage('decision-picker');
            },
        });
        this.buttonsContainer.element.append(start.element);
    }

    public configureOptionsView(): void {
        this.buttonsContainer.element.before(this.optionsContainer.element);
        if (this.options === null) this.addOptionElement();
        else this.addOptionElements(this.options);
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
            className: ['option-number'],
            textContent: id,
        });

        const name = new ElementBase({
            tag: 'input',
            className: ['option-input'],
        });
        if (name.element instanceof HTMLInputElement && optionData?.title) {
            name.element.value = optionData.title;
        }
        if (name.element instanceof HTMLInputElement)
            name.element.placeholder = 'Option Title';
        name.element.addEventListener('change', () => {
            this.optionsStorage.saveData(this.getOptions());
        });
        const weight = new ElementBase({
            tag: 'input',
            className: ['option-input', 'input-weight'],
        });
        if (weight.element instanceof HTMLInputElement && optionData?.weight) {
            weight.element.value = optionData.weight;
        }
        if (weight.element instanceof HTMLInputElement) {
            weight.element.type = 'number';
            weight.element.min = '0.1';
            weight.element.placeholder = 'Weight';
        }
        weight.element.addEventListener('change', () => {
            this.optionsStorage.saveData(this.getOptions());
        });
        const deleteBtn = new Button({
            className: ['delete'],
            textContent: 'Delete',
            handlerFunction: (event?: Event): void => {
                if (event) {
                    const clickedItem = event.target;
                    if (clickedItem instanceof Node) {
                        const optionToDelete = clickedItem.parentElement;
                        if (optionToDelete) optionToDelete.remove();
                        this.optionsStorage.saveData(this.getOptions());
                    }
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

    public getOptionsFromStorage(): void {
        const options = this.optionsStorage.getData();
        if (isOptions(options)) {
            this.options = options;
        } else this.options = null;
    }
}

function isOptions(data: unknown): data is Option[] {
    if (!Array.isArray(data) || data === null) {
        return false;
    } else if (Array.isArray(data) && !data.every((el) => isOption(el)))
        return false;
    return typeof data[0].title === 'string';
}

function isOption(data: unknown): data is Option {
    if (typeof data !== 'object' || data === null) {
        return false;
    }

    const object: Partial<Option> = data;
    return typeof object.title === 'string';
}
export { OptionsPage, isOptions };
