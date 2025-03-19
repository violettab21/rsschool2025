import type { ElementBase } from './element';
import { LocalStorage } from './localStorage';
import type { Option } from '../interfaces';
import type { ControlState } from '../interfaces';
import win from './game-bonus.mp3';
import type { CustomElement } from '../interfaces';
import { isOptions } from '../pages/options';
import { isSound } from '../pages/picker';
import {
    WHEEL_RADIUS,
    WHEEL_TITLE_LIMIT_WIDTH,
    WHEEL_TITLE_SECTOR_LIMIT,
    WHEEL_TITLE_OFFSET,
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    CENTER_ELEMENT_RADIUS,
    CURSOR_ELEMENT_X_OFFSET,
    CURSOR_ELEMENT_Y_OFFSET,
} from '../constants';
import { wheelColors } from '../enums';
export class Wheel {
    public wheelElement: HTMLCanvasElement;
    public rotation: number;
    public colors: string[];
    public options: Option[];
    public duration: number;
    public isSpinning: boolean;
    public startTime: number;
    public soundStatus: LocalStorage;
    constructor(soundStatus: LocalStorage) {
        this.wheelElement = document.createElement('canvas');
        this.wheelElement.width = CANVAS_WIDTH;
        this.wheelElement.height = CANVAS_HEIGHT;
        this.rotation = 0;
        this.options = shuffleOptions();
        this.colors = this.generateColors();
        this.drawWheel(this.rotation, this.options);
        this.duration = 10000;
        this.isSpinning = false;
        this.startTime = 0;
        shuffleOptions();
        this.soundStatus = soundStatus;
    }
    public drawWheel(
        rotation: number,
        options: Option[],
        result?: ElementBase
    ): void {
        const ctx = this.wheelElement.getContext('2d');
        if (ctx) {
            ctx.clearRect(
                0,
                0,
                this.wheelElement.width,
                this.wheelElement.height
            );
            const centerX = this.wheelElement.width / 2;
            const centerY = this.wheelElement.height / 2;
            const radius = WHEEL_RADIUS;
            let weightSum = 0;
            let startRadians = rotation;
            let endRadians = 0;

            for (let i = 0; i < options.length; i += 1) {
                weightSum += parseInt(options[i].weight);
            }
            const radiansPerOneWeight = (Math.PI * 2) / weightSum;

            for (let i = 0; i < options.length; i += 1) {
                endRadians =
                    startRadians +
                    radiansPerOneWeight * parseInt(options[i].weight);
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, startRadians, endRadians);
                ctx.lineTo(centerX, centerY);

                ctx.closePath();
                ctx.strokeStyle = wheelColors.COLOR_STROKE;
                ctx.lineWidth = 3;
                ctx.stroke();
                ctx.fillStyle = this.colors[i];
                ctx.fill();
                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.rotate(startRadians + (endRadians - startRadians) / 2);

                ctx.font = '25px Arial';
                ctx.shadowColor = wheelColors.LIGHT;
                ctx.shadowOffsetX = 1;
                ctx.shadowOffsetY = 1;
                ctx.textAlign = 'center';
                ctx.fillStyle = wheelColors.DARK;
                const textWidth = ctx.measureText(options[i].title);
                if (
                    textWidth.width < WHEEL_TITLE_LIMIT_WIDTH &&
                    startRadians + (endRadians - startRadians) >
                        WHEEL_TITLE_SECTOR_LIMIT
                ) {
                    ctx.fillText(options[i].title, WHEEL_TITLE_OFFSET, 0);
                } else if (
                    textWidth.width > WHEEL_TITLE_LIMIT_WIDTH &&
                    startRadians + (endRadians - startRadians) >
                        WHEEL_TITLE_SECTOR_LIMIT
                ) {
                    const clippedTitle = options[i].title.slice(0, 13) + '...';

                    ctx.fillText(clippedTitle, WHEEL_TITLE_OFFSET, 0);
                }

                ctx.restore();
                if (
                    (startRadians % (Math.PI * 2) < (3 * Math.PI) / 2 &&
                        endRadians % (Math.PI * 2) > (3 * Math.PI) / 2 &&
                        result) ||
                    (startRadians < (3 * Math.PI) / 2 &&
                        endRadians > (3 * Math.PI) / 2 &&
                        result)
                ) {
                    if (result.element instanceof HTMLInputElement)
                        result.element.value = options[i].title;
                    console.log(options[i].title);
                }

                startRadians = endRadians;
            }
            drawCursor(ctx, centerX);
            drawCenterElement(ctx, centerX, centerY);
        }
    }

    public animateWheel(
        rotationCount: number,
        result: ElementBase,
        menuContainer: ElementBase
    ): void {
        const progress =
            (performance.now() - this.startTime) / this.duration < 1
                ? (performance.now() - this.startTime) / this.duration
                : 1;

        const diff = Math.PI * 2 * rotationCount * easeInOutSine(progress);
        this.rotation = diff;
        if (progress < 1) {
            this.drawWheel(this.rotation, this.options, result);
            window.requestAnimationFrame(() =>
                this.animateWheel(rotationCount, result, menuContainer)
            );
        } else {
            this.isSpinning = false;
            highlightResult(result.element);
            changeMenuState(menuContainer.element, {
                state: false,
                pointer: 'auto',
                className: 'disabled',
            });

            const soundStatusData = this.soundStatus.getData();
            if (isSound(soundStatusData)) {
                const soundStatus = soundStatusData;
                if (soundStatus.sound) playAudio();
            } else playAudio();
        }
    }
    public startWheel(
        duration: number,
        result: ElementBase,
        menuContainer: ElementBase
    ): void {
        removeHighlight(result.element);
        changeMenuState(menuContainer.element, {
            state: true,
            pointer: 'none',
            className: 'disabled',
        });
        this.duration = duration;
        const rotationCount = this.generateRotationCount();
        if (!this.isSpinning) {
            this.isSpinning = true;
            this.rotation = 0;
            this.startTime = performance.now();
            window.requestAnimationFrame(() =>
                this.animateWheel(rotationCount, result, menuContainer)
            );
        }
    }
    public generateColors(): string[] {
        const colors: string[] = [];
        this.options.forEach(() => colors.push(generateRandomColor()));
        return colors;
    }
    public generateRotationCount(): number {
        return Math.random() * 2 + this.duration / 1000;
    }
}
function highlightResult(element: HTMLElement): void {
    element.classList.add('highlight');
}
function removeHighlight(element: HTMLElement): void {
    element.classList.remove('highlight');
}
function easeInOutSine(x: number): number {
    return -(Math.cos(Math.PI * x) - 1) / 2;
}
function generateRandomColor(): string {
    const hexCharacters = [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
    ];

    let colorCode = '';
    for (let i = 0; i < 6; i += 1) {
        const randomIndex = Math.floor(Math.random() * 16);
        colorCode += hexCharacters[randomIndex];
    }
    return `#${colorCode}`;
}
export function getValidOptions(): Option[] {
    const storage = new LocalStorage('decision-maker_options');
    const options = storage.getData();
    if (isOptions(options)) {
        const filteredOptions = options.filter(
            (option) =>
                option.title.length !== 0 &&
                option.weight.length !== 0 &&
                parseInt(option.weight) > 0
        );
        return filteredOptions;
    }

    return [];
}
function playAudio(): void {
    const audioWin = new Audio(win);
    audioWin
        .play()
        .then(() => {})
        .catch(() => {});
}
function shuffleOptions(): Option[] {
    const options = getValidOptions();
    const randomIndexes = generateRandomIndex(options.length);
    const shuffledOptions: Option[] = [];
    randomIndexes.forEach((index) => shuffledOptions.push(options[index]));
    return shuffledOptions;
}

function generateRandomIndex(interval: number): number[] {
    const indexes: number[] = [];
    for (let i = 0; i < interval; i += 1) {
        let index = Math.floor(Math.random() * interval);
        while (indexes.includes(index)) {
            index = Math.floor(Math.random() * interval);
        }
        indexes.push(index);
    }
    return indexes;
}
function changeMenuState(
    container: CustomElement,
    properties: ControlState
): void {
    const childrenElementsCount = container.children.length;
    if (childrenElementsCount !== 0) {
        const children = Array.from(container.children);
        children.forEach((child) => {
            if (
                (child.children.length === 0 &&
                    child instanceof HTMLInputElement) ||
                child instanceof HTMLButtonElement
            ) {
                child.disabled = properties.state;
                child.style.pointerEvents = properties.pointer;
            } else if (
                child.children.length === 0 &&
                child instanceof HTMLElement
            ) {
                child.style.pointerEvents = properties.pointer;
                child.classList.toggle(properties.className);
            } else if (child.children.length > 0) {
                if (child instanceof HTMLElement) {
                    child.style.pointerEvents = properties.pointer;
                    changeMenuState(child, properties);
                }
            }
        });
    }
}
function drawCursor(ctx: CanvasRenderingContext2D, CenterX: number): void {
    ctx.beginPath();
    ctx.strokeStyle = wheelColors.COLOR_STROKE;
    ctx.moveTo(CenterX, CURSOR_ELEMENT_Y_OFFSET);
    ctx.lineTo(CenterX + CURSOR_ELEMENT_X_OFFSET, 0);
    ctx.lineTo(CenterX - CURSOR_ELEMENT_X_OFFSET, 0);
    ctx.lineTo(CenterX, CURSOR_ELEMENT_Y_OFFSET);
    ctx.fillStyle = wheelColors.LIGHT;
    ctx.fill();
    ctx.stroke();
}

function drawCenterElement(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number
): void {
    ctx.beginPath();
    ctx.strokeStyle = wheelColors.COLOR_STROKE;
    ctx.arc(centerX, centerY, CENTER_ELEMENT_RADIUS, 0, 2 * Math.PI);
    ctx.fillStyle = wheelColors.LIGHT;
    ctx.fill();
    ctx.stroke();
}
