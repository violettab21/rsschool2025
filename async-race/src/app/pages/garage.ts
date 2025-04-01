import type { CustomElement, NewCar, Car } from '../interfaces';
import { ElementBase } from '../components/elements';
import { Button } from '../components/buttons';
import { GarageAPI } from '../api/garage-api';
import { isCar, isCars } from '../utilities';

export class GaragePage {
    public content: CustomElement;
    public createRowContainer: CustomElement;
    public updateRowContainer: CustomElement;
    public garageContainer: CustomElement;
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

        this.garageContainer = createGarageContainer();

        document.body.append(this.content);

        this.configurePage();
    }

    public configurePage(): void {
        const garagePageMenu = this.createGaragePageMenu();
        this.content.append(garagePageMenu, this.garageContainer);
        void this.populateGarage(1);
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
            if (this.getCarsCountOnPage() < 7 && isCar(createdCar))
                this.createCarRecord(createdCar);
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
    public createCarRecord(car: Car): void {
        const carRow = new ElementBase({
            tag: 'div',
            className: ['car-row'],
        }).element;

        const carMenu = createCarRecordTopMenu(car.name);
        const carMain = createCarMainContent(car.color);
        carRow.append(carMenu, carMain);

        this.garageContainer.append(carRow);
    }

    public async populateGarage(page: number): Promise<void> {
        const cars = await this.api.getCars(page);
        if (isCars(cars)) cars.forEach((car) => this.createCarRecord(car));
    }
    public getCarsCountOnPage(): number {
        return this.garageContainer.children.length;
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

function createGarageContainer(): CustomElement {
    const garageContainer = new ElementBase({
        tag: 'div',
        className: ['garage'],
    }).element;

    return garageContainer;
}

function createCarRecordTopMenu(name: string): CustomElement {
    const menuContainer = new ElementBase({
        tag: 'div',
        className: ['car-menu'],
    }).element;

    const selectButton = new Button({
        className: ['select-button'],
        textContent: 'Select',
        handlerFunction: (): void => {},
    }).element;

    const removeButton = new Button({
        className: ['remove-button'],
        textContent: 'Remove',
        handlerFunction: (): void => {},
    }).element;

    const carName = new ElementBase({
        tag: 'p',
        className: ['car-name'],
        textContent: name,
    }).element;

    menuContainer.append(selectButton, removeButton, carName);

    return menuContainer;
}
function createCarMainContent(color: string): CustomElement {
    const carContainer = new ElementBase({
        tag: 'div',
        className: ['car-main'],
    }).element;

    const startButton = new Button({
        className: ['start-button'],
        textContent: 'A',
        handlerFunction: (): void => {},
    }).element;

    const stopButton = new Button({
        className: ['stop-button'],
        textContent: 'B',
        handlerFunction: (): void => {},
    }).element;

    const carImage = new ElementBase({
        tag: 'span',
        className: ['car-image'],
    }).element;
    carImage.innerHTML = `<svg height="100px" width="100px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
	 viewBox="0 0 17.485 17.485" xml:space="preserve">
<g>
	<g>
		<path style="fill:${color};" d="M17.477,8.149c-0.079-0.739-3.976-0.581-3.976-0.581L11.853,5.23H4.275L3.168,7.567H0v2.404
			l2.029,0.682c0.123-0.836,0.843-1.48,1.711-1.48c0.939,0,1.704,0.751,1.73,1.685l6.62,0.041c0.004-0.951,0.779-1.726,1.733-1.726
			c0.854,0,1.563,0.623,1.704,1.439l1.479-0.17C17.006,10.442,17.556,8.887,17.477,8.149z M4.007,7.568l0.746-1.771h2.864
			l0.471,1.771H4.007z M8.484,7.568L8.01,5.797h3.67l1.137,1.771H8.484z"/>
		<circle style="fill:#030104;" cx="3.759" cy="10.966" r="1.289"/>
		<circle style="fill:#030104;" cx="13.827" cy="10.9" r="1.29"/>
	</g>
</g>
</svg>`;

    carContainer.append(startButton, stopButton, carImage);

    return carContainer;
}
