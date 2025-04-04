import type { CustomElement, NewCar, Car } from '../interfaces';
import { ElementBase } from '../components/elements';
import { Button } from '../components/buttons';
import { GarageAPI } from '../api/garage-api';
import { isCar, isCars, isEngine } from '../utilities';
import { cars, models } from '../constants';

export class GaragePage {
    public content: CustomElement;
    public createRowContainer: CustomElement;
    public updateRowContainer: CustomElement;
    public carsContainer: CustomElement;
    public garageContainer: CustomElement;
    public pageNumber: number;
    public api: GarageAPI;
    public selectedCarId: number;
    public carsNumber: number;
    constructor() {
        this.carsNumber = 0;
        this.api = new GarageAPI();

        this.selectedCarId = 0;
        this.pageNumber = 1;
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

        this.carsContainer = createCarsContainer();
        this.garageContainer = new ElementBase({
            tag: 'div',
            className: ['garage'],
        }).element;
        this.getCarsNumber()
            .then(() => {
                this.createGarageContainer(this.pageNumber);
                document.body.append(this.content);

                this.configurePage();
            })
            .catch((error: Error) => console.log(error));
    }

    public configurePage(): void {
        const garagePageMenu = this.createGaragePageMenu();
        this.content.append(garagePageMenu, this.garageContainer);
        void this.populateGarage(this.pageNumber);
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
            this.carsNumber += 1;
            this.setCarsNumber(this.carsNumber);
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
        const updateCarButton = new Button({
            className: ['update-car'],
            textContent: 'Update',
            handlerFunction: (): void => {
                void this.updateCarRecordHandler();
            },
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
            this.createBottomLevelButtons()
        );

        return pageMenuContainer;
    }
    public createCarRecord(car: Car): void {
        const carRow = new ElementBase({
            tag: 'div',
            className: ['car-row'],
        }).element;
        carRow.dataset.id = car.id.toString();

        const carMenu = this.createCarRecordTopMenu(car.name);
        const carMain = this.createCarMainContent(car.color);
        carRow.append(carMenu, carMain);

        this.carsContainer.append(carRow);
    }

    public async populateGarage(page: number): Promise<void> {
        const cars = await this.api.getCars(page);
        if (isCars(cars)) cars.forEach((car) => this.createCarRecord(car));
    }
    public getCarsCountOnPage(): number {
        return this.carsContainer.children.length;
    }

    public createGarageContainer(pageNumber: number): void {
        const pageTitle = new ElementBase({
            tag: 'p',
            className: ['garage-title'],
            textContent: `Garage (${this.carsNumber})`,
        }).element;

        const page = new ElementBase({
            tag: 'p',
            className: ['garage-page-number'],
            textContent: `Page #${pageNumber}`,
        }).element;

        this.garageContainer.append(
            pageTitle,
            page,
            this.carsContainer,
            this.createPaginationButtons()
        );
    }
    public clearGarage(): void {
        [...this.garageContainer.children].forEach((element) =>
            element.remove()
        );
    }
    public clearCars(): void {
        [...this.carsContainer.children].forEach((element) => element.remove());
    }
    public createPaginationButtons(): CustomElement {
        const paginationButtons = new ElementBase({
            tag: 'div',
            className: ['pagination-buttons'],
        }).element;

        const previousButton = new Button({
            className: ['prev-button', 'button'],
            textContent: 'Prev',
            handlerFunction: (): void => {
                this.clearGarage();
                this.carsContainer = createCarsContainer();
                this.pageNumber -= 1;
                this.createGarageContainer(this.pageNumber);
                void this.populateGarage(this.pageNumber);
            },
        }).element;

        const nextButton = new Button({
            className: ['next-button', 'button'],
            textContent: 'Next',
            handlerFunction: (): void => {
                this.clearGarage();
                this.carsContainer = createCarsContainer();
                this.pageNumber += 1;
                this.createGarageContainer(this.pageNumber);
                void this.populateGarage(this.pageNumber);
            },
        }).element;
        paginationButtons.append(previousButton, nextButton);
        return paginationButtons;
    }

    public createCarRecordTopMenu(name: string): CustomElement {
        const menuContainer = new ElementBase({
            tag: 'div',
            className: ['car-menu'],
        }).element;

        const selectButton = new Button({
            className: ['select-button'],
            textContent: 'Select',
            handlerFunction: (event?: Event): void => {
                void this.selectCarRecordHandler(event);
            },
        }).element;

        const removeButton = new Button({
            className: ['remove-button'],
            textContent: 'Remove',
            handlerFunction: (event?: Event): void => {
                void this.removeCarRecordHandler(event);
            },
        }).element;

        const carName = new ElementBase({
            tag: 'p',
            className: ['car-name'],
            textContent: name,
        }).element;

        menuContainer.append(selectButton, removeButton, carName);

        return menuContainer;
    }
    public async removeCarRecordHandler(event?: Event): Promise<void> {
        let idOfClickedItem: number;
        if (event) {
            const clickedItem = event.target;
            if (clickedItem instanceof Node) {
                const optionToDelete = clickedItem.parentElement?.parentElement;
                if (
                    optionToDelete instanceof Element &&
                    optionToDelete.dataset
                ) {
                    idOfClickedItem = Number(optionToDelete.dataset.id);
                    await this.api.removeCar(idOfClickedItem);
                    this.carsNumber -= 1;
                    this.setCarsNumber(this.carsNumber);
                    this.clearCars();
                    await this.populateGarage(this.pageNumber);
                }
            }
        }
    }
    public async selectCarRecordHandler(event?: Event): Promise<void> {
        if (event) {
            const clickedItem = event.target;
            if (clickedItem instanceof Node) {
                const optionToSelect = clickedItem.parentElement?.parentElement;
                if (
                    optionToSelect instanceof Element &&
                    optionToSelect.dataset
                ) {
                    this.selectedCarId = Number(optionToSelect.dataset.id);
                    const car = await this.api.getCar(this.selectedCarId);
                    if (isCar(car)) {
                        const updateRowContainerFields = [
                            ...this.updateRowContainer.children,
                        ];
                        if (
                            updateRowContainerFields[0] instanceof
                                HTMLInputElement &&
                            updateRowContainerFields[1] instanceof
                                HTMLInputElement
                        ) {
                            updateRowContainerFields[0].value = car.name;
                            updateRowContainerFields[1].value = car.color;
                        }
                    }
                }
            }
        }
    }

    public async updateCarRecordHandler(): Promise<void> {
        const updateRowContainerFields = [...this.updateRowContainer.children];
        let name: string;
        let color: string;
        if (
            updateRowContainerFields[0] instanceof HTMLInputElement &&
            updateRowContainerFields[1] instanceof HTMLInputElement
        ) {
            name = updateRowContainerFields[0].value;
            color = updateRowContainerFields[1].value;
            await this.api.updateCar(this.selectedCarId, {
                name: name,
                color: color,
            });
            this.clearCars();
            await this.populateGarage(this.pageNumber);
        }
    }
    public async generateRandomCars(): Promise<void> {
        for (let i = 0; i < 100; i += 1) {
            const car = {
                name: generateRandomCarName(),
                color: generateRandomColor(),
            };
            const createdCar = await this.api.createCar(car);

            if (this.getCarsCountOnPage() < 7 && isCar(createdCar))
                this.createCarRecord(createdCar);
        }
        await this.getCarsNumber();
        this.setCarsNumber(this.carsNumber);
    }
    public createBottomLevelButtons(): CustomElement {
        const buttonsContainer = new ElementBase({
            tag: 'div',
            className: ['garage-page-bottom-buttons'],
        }).element;

        const raceButton = new Button({
            className: ['race-button', 'button'],
            textContent: 'Race',
            handlerFunction: (): void => {},
        }).element;

        const resetButton = new Button({
            className: ['reset-button', 'button'],
            textContent: 'Reset',
            handlerFunction: (): void => {},
        }).element;

        const generateCarsButton = new Button({
            className: ['generate-cars-button', 'button'],
            textContent: 'Generate Cars',
            handlerFunction: (): void => {
                void this.generateRandomCars();
            },
        }).element;

        buttonsContainer.append(raceButton, resetButton, generateCarsButton);

        return buttonsContainer;
    }

    public async getAllCarsCount(): Promise<number> {
        let count: number;
        const cars = await this.api.getAllCars();
        if (isCars(cars)) {
            count = cars.length;
            return count;
        } else return 0;
    }

    public setCarsNumber(count: number): void {
        const garage = [...this.garageContainer.children];
        const title = garage[0];
        title.textContent = `Garage (${count})`;
    }

    public async getCarsNumber(): Promise<void> {
        this.carsNumber = await this.getAllCarsCount();
    }

    public startCarHandler(event?: Event): void {
        if (event) {
            const clickedItem = event.target;
            if (clickedItem instanceof Node) {
                const carToStart = clickedItem.parentElement?.parentElement;
                if (carToStart instanceof Element && carToStart.dataset) {
                    const carId = Number(carToStart.dataset.id);
                    this.api
                        .startEngine(carId)
                        .then((result) => {
                            if (isEngine(result)) {
                                const time = result.distance / result.velocity;
                                console.log(time);
                                const animationId = startCar(time, carToStart);
                                console.log('id of animation' + animationId);
                                this.api
                                    .draveEngine(carId)
                                    .then((response) => {
                                        if (!response.ok) {
                                            console.log(response.status);
                                            globalThis.cancelAnimationFrame(
                                                animationId
                                            );
                                            carToStart.dataset.state =
                                                'stopped';
                                        } else if (response.ok)
                                            console.log('finish animation');
                                    })
                                    .catch((error: Error) =>
                                        console.log(error)
                                    );
                            }
                        })
                        .catch((error: Error) => console.log(error));
                }
            }
        }
    }
    public stopCarHandler(event?: Event): void {
        if (event) {
            const clickedItem = event.target;
            if (clickedItem instanceof Node) {
                const carToStop = clickedItem.parentElement?.parentElement;
                if (carToStop instanceof Element && carToStop.dataset) {
                    const carId = Number(carToStop.dataset.id);
                    this.api
                        .stopEngine(carId)
                        .then((result) => {
                            if (isEngine(result)) {
                                carToStop.dataset.state = 'stopped';
                                changeCarPosition(0, carToStop);
                            }
                        })
                        .catch((error: Error) => console.log(error));
                }
            }
        }
    }
    public createCarMainContent(color: string): CustomElement {
        const carContainer = new ElementBase({
            tag: 'div',
            className: ['car-main'],
        }).element;
        const startButton = new Button({
            className: ['start-button'],
            textContent: 'A',
            handlerFunction: (event?: Event): void => {
                this.startCarHandler(event);
            },
        }).element;
        const stopButton = new Button({
            className: ['stop-button'],
            textContent: 'B',
            handlerFunction: (event?: Event): void => {
                this.stopCarHandler(event);
            },
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
}

function createTopLevelButtons(): CustomElement {
    const buttonsContainer = new ElementBase({
        tag: 'div',
        className: ['garage-page-top-buttons'],
    }).element;

    const toGarageButton = new Button({
        className: ['garage-button', 'button'],
        textContent: 'To Garage',
        handlerFunction: (): void => {},
    }).element;

    const toWinnersButton = new Button({
        className: ['winners-button', 'button'],
        textContent: 'To Winners',
        handlerFunction: (): void => {},
    }).element;
    buttonsContainer.append(toGarageButton, toWinnersButton);

    return buttonsContainer;
}

function createCarsContainer(): CustomElement {
    const garageContainer = new ElementBase({
        tag: 'div',
        className: ['cars'],
    }).element;

    return garageContainer;
}

function generateRandomColor(): string {
    const HEX = ['A', 'B', 'C', 'D', 'E', 'F', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let color: string = '';
    for (let i = 0; i < 6; i += 1) {
        color += HEX[Math.floor(Math.random() * 16)];
    }
    return `#${color}`;
}

function generateRandomCarName(): string {
    const carName =
        cars[Math.floor(Math.random() * cars.length)] +
        ' ' +
        models[Math.floor(Math.random() * models.length)];

    return carName;
}

function startCar(time: number, carRow: Element): number {
    const startTime = performance.now();
    let animationId: number;
    function animateCar(
        timestamp: number,
        startTime: number,
        time: number,
        carRow: Element
    ): void {
        const progress = (timestamp - startTime) / time;

        const offset = progress * (carRow.clientWidth - 130);
        if (progress < 1 && carRow instanceof HTMLElement) {
            if (carRow.dataset.state !== 'stopped') {
                changeCarPosition(offset, carRow);
                animationId = requestAnimationFrame((timestamp) =>
                    animateCar(timestamp, startTime, time, carRow)
                );
            }
        } else console.log('finish');
    }
    animationId = requestAnimationFrame((timestamp) =>
        animateCar(timestamp, startTime, time, carRow)
    );
    return animationId;
}

function changeCarPosition(offset: number, carRow: Element): void {
    const carElement = carRow.querySelector('.car-image');
    if (carElement instanceof HTMLElement)
        carElement.style.transform = `translate(${offset}px)`;
}
