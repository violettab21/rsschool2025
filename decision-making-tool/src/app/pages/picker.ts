import { Button } from '../components/button';
import { ElementBase } from '../components/element';
import type { Main } from '../components/main';
import { Wheel } from '../components/canvas';
import type { Router } from '../components/router';
import imageSoundOff from './sound-off-filled-svgrepo-com.svg';
import imageSoundOn from './sound-loud-filled-svgrepo-com.svg';
import { LocalStorage } from '../components/localStorage';
export class Picker {
    public wheel: Wheel;
    public menuContainer: ElementBase;
    public time: ElementBase;
    public finalOption: ElementBase;
    public sound: ElementBase;
    public soundStatus: LocalStorage;
    constructor(main: Main, router: Router) {
        this.soundStatus = new LocalStorage('sound');
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
        this.wheel = new Wheel(this.soundStatus);
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
        const soundStatusData: { sound: boolean } | null =
            this.soundStatus.getData();
        if (soundStatusData !== null) {
            soundImage.src = soundStatusData.sound
                ? imageSoundOn
                : imageSoundOff;
        } else soundImage.src = imageSoundOn;
        this.sound.element.addEventListener('click', () => {
            if (soundImage.src === imageSoundOn) {
                soundImage.src = imageSoundOff;
                this.disableAudio();
            } else if (soundImage.src === imageSoundOff) {
                soundImage.src = imageSoundOn;
                this.enableAudio();
            }
        });
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
    public disableAudio(): void {
        this.soundStatus.saveData({ sound: false });
    }
    public enableAudio(): void {
        this.soundStatus.saveData({ sound: true });
    }
}
