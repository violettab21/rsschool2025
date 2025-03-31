import type { CustomElement, NewCar } from '../interfaces';
import { ElementBase } from '../components/elements';
import { Button } from '../components/buttons';
import { GarageAPI } from '../api/garage-api';

export class GaragePage {
    public content: CustomElement;
    public createRowContainer: CustomElement;
    public updateRowContainer: CustomElement;
    public api: GarageAPI;
    constructor() {
        this.api = new GarageAPI();
        this.content = new ElementBase({
            tag: 'main',
            className: ['main'],
        }).element;

        this.createRowContainer = new ElementBase({
            tag: 'div',
            className: ['create-car-row'],
        }).element;
        this.createCarForm();
        this.updateRowContainer = new ElementBase({
            tag: 'div',
            className: ['update-car-row'],
        }).element;
        this.updateCarForm();
        document.body.append(this.content);

        this.configurePage();
    }

    public configurePage(): void {
        const garagePageMenu = this.createGaragePageMenu();
        this.content.append(garagePageMenu);
    }

    public async createCarHandler(): Promise<void> {
        const car: NewCar = { name: '', color: '' };

        const listOfElements = [...this.createRowContainer.children];
        if (
            listOfElements[0] instanceof HTMLInputElement &&
            listOfElements[1] instanceof HTMLInputElement
        ) {
            const carName = listOfElements[0].value;
            const carColor = listOfElements[1].value;
            car.name = carName;
            car.color = carColor;

            const createdCar = await this.api.createCar(car);
            console.log(createdCar);
        }
    }

    public createCarForm(): void {
        const newCarInput = new ElementBase({
            tag: 'input',
            className: ['create-car-input'],
        }).element;

        const newCarColor = new ElementBase({
            tag: 'input',
            className: ['create-car-color'],
        }).element;
        if (newCarColor instanceof HTMLInputElement) {
            newCarColor.type = 'color';
        }
        const newCarButton = new Button({
            className: ['create-car'],
            textContent: 'Create',
            handlerFunction: (): void => {
                this.createCarHandler().then(
                    (result) => result,
                    (error) => console.log(error)
                );
            },
        }).element;

        this.createRowContainer.append(newCarInput, newCarColor, newCarButton);
    }

    public createForm(): CustomElement {
        const formContainer = new ElementBase({
            tag: 'div',
            className: ['garage-form'],
        }).element;
        formContainer.append(this.createRowContainer, this.updateRowContainer);
        return formContainer;
    }

    public updateCarForm(): void {
        const updateCarInput = new ElementBase({
            tag: 'input',
            className: ['update-car-input'],
        }).element;

        const updatedCarColor = new ElementBase({
            tag: 'input',
            className: ['update-car-color'],
        }).element;
        if (updatedCarColor instanceof HTMLInputElement) {
            updatedCarColor.type = 'color';
        }
        const updateCarButton = new ElementBase({
            tag: 'button',
            className: ['update-car'],
            textContent: 'Update',
        }).element;

        this.updateRowContainer.append(
            updateCarInput,
            updatedCarColor,
            updateCarButton
        );
    }
    public createGaragePageMenu(): CustomElement {
        const pageMenuContainer = new ElementBase({
            tag: 'div',
            className: ['garage-page-menu'],
        }).element;

        pageMenuContainer.append(
            createTopLevelButtons(),
            this.createForm(),
            createBottomLevelButtons()
        );

        return pageMenuContainer;
    }
}

function createTopLevelButtons(): CustomElement {
    const buttonsContainer = new ElementBase({
        tag: 'div',
        className: ['garage-page-top-buttons'],
    }).element;

    const toGarageButton = new Button({
        className: ['garage-button'],
        textContent: 'To Garage',
        handlerFunction: (): void => {},
    }).element;

    const toWinnersButton = new Button({
        className: ['winners-button'],
        textContent: 'To Winners',
        handlerFunction: (): void => {},
    }).element;
    buttonsContainer.append(toGarageButton, toWinnersButton);

    return buttonsContainer;
}

function createBottomLevelButtons(): CustomElement {
    const buttonsContainer = new ElementBase({
        tag: 'div',
        className: ['garage-page-bottom-buttons'],
    }).element;

    const raceButton = new Button({
        className: ['garage-button'],
        textContent: 'Race',
        handlerFunction: (): void => {},
    }).element;

    const resetButton = new Button({
        className: ['winners-button'],
        textContent: 'Reset',
        handlerFunction: (): void => {},
    }).element;

    const generateCarsButton = new Button({
        className: ['winners-button'],
        textContent: 'Generate Cars',
        handlerFunction: (): void => {},
    }).element;

    buttonsContainer.append(raceButton, resetButton, generateCarsButton);

    return buttonsContainer;
}
