import { Button } from './button';
import { ElementBase } from './element';
import type { Main } from './main';
import { Wheel } from './canvas';
export class Picker {
    public wheel: Wheel;
    public menuContainer: ElementBase;
    public time: ElementBase;
    constructor(main: Main) {
        this.time = new ElementBase({
            tag: 'input',
            className: ['input-time'],
        });

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
            handlerFunction: (): void => {
                if (this.time.element instanceof HTMLInputElement)
                    this.wheel.startWheel(
                        parseInt(this.time.element.value) * 1000
                    );
                else this.wheel.startWheel(10000);
            },
        });
        if (this.time.element instanceof HTMLInputElement) {
            this.time.element.value = '10';
        }
        this.menuContainer.element.append(
            backButton.element,
            pickButton.element,
            this.time.element
        );
        main.main.element.append(this.menuContainer.element);
    }
}
