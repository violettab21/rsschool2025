import { Button } from './button';
import { ElementBase } from './element';
import type { Main } from './main';
import { Wheel } from './canvas';
export class Picker {
    public wheel: Wheel;
    public menuContainer: ElementBase;
    constructor(main: Main) {
        this.wheel = new Wheel();
        this.menuContainer = new ElementBase({
            tag: 'div',
            className: ['decision-menu'],
        });
        this.configureMenu(main);
        main.main.element.append(this.wheel.wheelElement);
    }
    public configureMenu(main: Main): void {
        const backButton = new Button({
            className: ['decision-back'],
            textContent: 'Back',
            handlerFunction: (): void => console.log('back'),
        });
        const pickButton = new Button({
            className: ['decision-pick'],
            textContent: 'Pick',
            handlerFunction: (): void => this.wheel.startWheel(),
        });
        this.menuContainer.element.append(
            backButton.element,
            pickButton.element
        );
        main.main.element.append(this.menuContainer.element);
    }
}
