import { Button } from '../components/button';
import { ElementBase } from '../components/element';
import type { Main } from '../components/main';
import { Wheel } from '../components/canvas';
import type { Router } from '../components/router';
/*import imageSoundOff from './sound-off-filled-svgrepo-com.svg';*/
import imageSoundOn from './sound-loud-filled-svgrepo-com.svg';
export class Picker {
    public wheel: Wheel;
    public menuContainer: ElementBase;
    public time: ElementBase;
    public finalOption: ElementBase;
    public sound: ElementBase;
    constructor(main: Main, router: Router) {
        this.time = new ElementBase({
            tag: 'input',
            className: ['input-time'],
        });
        this.sound = new ElementBase({
            tag: 'span',
            className: ['sound-image'],
        });

        if (this.time.element instanceof HTMLInputElement) {
            this.time.element.type = 'number';
            this.time.element.min = '5';
            this.time.element.max = '30';
        }
        this.finalOption = new ElementBase({
            tag: 'input',
            className: ['input-final-option'],
        });
        this.wheel = new Wheel();
        this.menuContainer = new ElementBase({
            tag: 'div',
            className: ['decision-menu'],
        });

        this.configureMenu(main, router);
        main.main.element.append(this.wheel.wheelElement);
    }
    public configureMenu(main: Main, router: Router): void {
        const container = new ElementBase({
            tag: 'div',
            className: ['top-elements'],
        });
        const backButton = new Button({
            className: ['decision-back'],
            textContent: 'Back',
            handlerFunction: (): void => router.openPage('/'),
        });
        const pickButton = new Button({
            className: ['decision-pick'],
            textContent: 'Pick',
            handlerFunction: (): void => {
                if (this.time.element instanceof HTMLInputElement)
                    this.wheel.startWheel(
                        parseInt(this.time.element.value) * 1000,
                        this.finalOption
                    );
                else this.wheel.startWheel(10000, this.finalOption);
            },
        });
        const soundImage = new Image();
        soundImage.src = imageSoundOn;
        this.sound.element.append(soundImage);
        const timeLabel = new ElementBase({
            tag: 'label',
            className: ['time-label'],
            textContent: 'Duration',
        });
        timeLabel.element.append(this.time.element);
        if (this.time.element instanceof HTMLInputElement) {
            this.time.element.value = '10';
        }
        container.element.append(
            backButton.element,
            this.sound.element,
            timeLabel.element
        );
        this.menuContainer.element.append(
            container.element,
            pickButton.element
        );
        if (this.finalOption.element instanceof HTMLInputElement) {
            this.finalOption.element.disabled = true;
            this.finalOption.element.value = 'Spin the wheel';
        }
        main.main.element.append(
            this.menuContainer.element,
            this.finalOption.element
        );
    }
}
