import { Button } from '../components/button';
import { ElementBase } from '../components/element';
import type { Main } from '../components/main';
import { Wheel } from '../components/canvas';
import type { Router } from '../components/router';
import imageSoundOff from '../../assets/sound-off-filled-svgrepo-com.svg';
import imageSoundOn from '../../assets/sound-loud-filled-svgrepo-com.svg';
import { LocalStorage } from '../components/local-storage';
import type { Sound } from '../interfaces';
import { Modal } from '../components/modal';
import { buttonName } from '../enums';
export class Picker {
    public wheel: Wheel;
    public menuContainer: ElementBase;
    public time: ElementBase;
    public finalOption: ElementBase;
    public sound: ElementBase;
    public soundStatus: LocalStorage;
    constructor(main: Main, router: Router, optionsStorage: LocalStorage) {
        this.soundStatus = new LocalStorage('sound');

        this.sound = new ElementBase({
            tag: 'span',
            className: ['sound-image'],
        });
        this.time = new ElementBase({
            tag: 'input',
            className: ['input-time'],
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
        if (this.finalOption.element instanceof HTMLInputElement) {
            this.finalOption.element.disabled = true;
            this.finalOption.element.value = 'Spin the wheel';
        }
        this.wheel = new Wheel(this.soundStatus, optionsStorage);
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
            textContent: buttonName.BACK,
            handlerFunction: (): void => router.openPage('/'),
        });
        const pickButton = new Button({
            className: ['decision-pick'],
            textContent: buttonName.PICK,
            handlerFunction: (): void => {
                this.pickHandler(main);
            },
        });

        this.configureSoundControls();
        const timeLabel = this.createDurationLabel();
        container.element.append(
            backButton.element,
            this.sound.element,
            timeLabel.element
        );
        this.menuContainer.element.append(
            container.element,
            pickButton.element
        );

        main.main.element.append(
            this.menuContainer.element,
            this.finalOption.element
        );
    }
    public createDurationLabel(): ElementBase {
        const timeLabel = new ElementBase({
            tag: 'label',
            className: ['time-label'],
            textContent: 'Duration',
        });
        timeLabel.element.append(this.time.element);
        if (this.time.element instanceof HTMLInputElement) {
            this.time.element.value = '10';
        }
        return timeLabel;
    }
    public pickHandler(main: Main): void {
        if (this.time.element instanceof HTMLInputElement) {
            if (Number.parseInt(this.time.element.value) < 5) {
                showErrorMessage(
                    main,
                    'Please, provide value greater than or equal to 5'
                );
            } else
                this.wheel.startWheel(
                    Number.parseInt(this.time.element.value) * 1000,
                    this.finalOption,
                    this.menuContainer
                );
        } else
            this.wheel.startWheel(10_000, this.finalOption, this.menuContainer);
    }
    public configureSoundControls(): void {
        const soundImage = new Image();

        const soundStatusData = this.soundStatus.getData();
        if (isSound(soundStatusData)) {
            const soundStatus = soundStatusData;
            soundImage.src = soundStatus.sound ? imageSoundOn : imageSoundOff;
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
    }
    public disableAudio(): void {
        this.soundStatus.saveData({ sound: false });
    }
    public enableAudio(): void {
        this.soundStatus.saveData({ sound: true });
    }
}

function isSound(data: unknown): data is Sound {
    if (typeof data !== 'object' || data === null) {
        return false;
    }
    const object: Partial<Sound> = data;
    return typeof object.sound === 'boolean';
}

function showErrorMessage(main: Main, text: string): void {
    const modal = new Modal();
    const modalContent = new ElementBase({
        tag: 'p',
        className: ['modal-message'],
        textContent: text,
    });
    modal.modal.element.append(modalContent.element);
    main.main.element.append(modal.modalContainer.element);
}

export { isSound };
