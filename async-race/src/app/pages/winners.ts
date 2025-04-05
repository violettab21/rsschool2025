import type { Main } from '../components/main';
import type { CustomElement } from '../interfaces';
import { ElementBase } from '../components/elements';
import { Button } from '../components/buttons';
export class Winners {
    public winnersContainer: CustomElement;
    constructor(main: Main) {
        this.winnersContainer = new ElementBase({
            tag: 'div',
            className: ['winners-container'],
        }).element;
        this.configurePage(main);
    }
    public configurePage(main: Main): void {
        const winnersPageMenu = createWinnersPageMenu();
        if (main.main instanceof Element)
            main.main.append(winnersPageMenu, this.winnersContainer);
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
