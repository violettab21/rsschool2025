import type { Main } from '../components/main';
import type { CustomElement } from '../interfaces';
import { ElementBase } from '../components/elements';
import { Button } from '../components/buttons';
import type { Car, Winner } from '../interfaces';
export class Winners {
    public winnersContainer: CustomElement;
    public winnersNumber: number;
    public pageNumber: number;
    public winners: CustomElement;
    constructor(main: Main) {
        this.winnersNumber = 0;
        this.pageNumber = 1;
        this.winnersContainer = new ElementBase({
            tag: 'div',
            className: ['winners-container'],
        }).element;
        this.winners = new ElementBase({
            tag: 'div',
            className: ['winners'],
        }).element;
        this.configurePage(main);
    }
    public configurePage(main: Main): void {
        const winnersPageMenu = createWinnersPageMenu();
        if (main.main instanceof Element) {
            main.main.append(winnersPageMenu, this.winnersContainer);
            this.createWinnersContainer(this.pageNumber);
            this.createWinnersComponents();
        }
    }
    public createWinnersContainer(pageNumber: number): void {
        const pageTitle = new ElementBase({
            tag: 'p',
            className: ['winners-title'],
            textContent: `Winners (${this.winnersNumber})`,
        }).element;

        const page = new ElementBase({
            tag: 'p',
            className: ['winners-page-number'],
            textContent: `Page #${pageNumber}`,
        }).element;

        this.winnersContainer.append(
            pageTitle,
            page,
            this.winners,
            this.createPaginationButtons()
        );
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
                this.pageNumber -= 1;
            },
        }).element;

        const nextButton = new Button({
            className: ['next-button', 'button'],
            textContent: 'Next',
            handlerFunction: (): void => {
                this.pageNumber += 1;
            },
        }).element;
        paginationButtons.append(previousButton, nextButton);
        return paginationButtons;
    }

    public createWinnersComponents(): void {
        this.createTableHeader();
        this.createWinnerRow(
            1,
            { id: 1, name: 'test', color: '#ffffff' },
            { id: 1, wins: 2, time: 2.5 }
        );
    }
    public createTableHeader(): void {
        const number = new ElementBase({
            tag: 'p',
            className: ['header-number'],
            textContent: 'Number',
        }).element;
        const name = new ElementBase({
            tag: 'p',
            className: ['header-name'],
            textContent: 'Name',
        }).element;
        const car = new ElementBase({
            tag: 'p',
            className: ['header-car'],
            textContent: 'Car',
        }).element;
        const wins = new ElementBase({
            tag: 'p',
            className: ['header-time'],
            textContent: 'Wins',
        }).element;
        const time = new ElementBase({
            tag: 'p',
            className: ['header-time'],
            textContent: 'Time',
        }).element;
        this.winners.append(number, name, car, wins, time);
    }
    public createWinnerRow(id: number, car: Car, winner: Winner): void {
        const number = new ElementBase({
            tag: 'p',
            className: ['data-number'],
            textContent: `${id}`,
        }).element;
        const name = new ElementBase({
            tag: 'p',
            className: ['data-name'],
            textContent: `${car.name}`,
        }).element;
        const carImage = new ElementBase({
            tag: 'p',
            className: ['data-car'],
            textContent: `${car.color}`,
        }).element;
        const winsCount = new ElementBase({
            tag: 'p',
            className: ['data-wins'],
            textContent: `${winner.wins}`,
        }).element;
        const time = new ElementBase({
            tag: 'p',
            className: ['data-time'],
            textContent: `${winner.time}`,
        }).element;
        this.winners.append(number, name, carImage, winsCount, time);
    }
}
function createWinnersPageMenu(): CustomElement {
    const pageMenuContainer = new ElementBase({
        tag: 'div',
        className: ['winners-page-menu'],
    }).element;

    pageMenuContainer.append(createTopLevelButtons());

    return pageMenuContainer;
}
function createTopLevelButtons(): CustomElement {
    const toGarageButton = new Button({
        className: ['garage-button', 'button'],
        textContent: 'To Garage',
        handlerFunction: (): void => {},
    }).element;

    return toGarageButton;
}
