import type { ElementBase } from './element';
import { LocalStorage } from './localStorage';
import type { Option } from '../interfaces';

import win from './game-bonus.mp3';

export class Wheel {
    public wheelElement: HTMLCanvasElement;
    public rotation: number;
    public colors: string[];
    public options: Option[];
    public duration: number;
    public isSpinning: boolean;
    public startTime: number;
    constructor() {
        this.wheelElement = document.createElement('canvas');
        this.wheelElement.width = 500;
        this.wheelElement.height = 450;
        this.rotation = 0;
        this.options = shuffleOptions();
        this.colors = this.generateColors();
        this.drawWheel(this.rotation, this.options);
        this.duration = 10000;
        this.isSpinning = false;
        this.startTime = 0;
        shuffleOptions();
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
                ctx.arc(centerX, centerY, 220, startRadians, endRadians);
                ctx.lineTo(centerX, centerY);

                ctx.closePath();
                ctx.strokeStyle = 'yellow';
                ctx.lineWidth = 3;
                ctx.stroke();
                ctx.fillStyle = this.colors[i];
                ctx.fill();
                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.rotate(startRadians + (endRadians - startRadians) / 2);
                ctx.font = '30px Arial';
                ctx.shadowColor = 'yellow';
                ctx.shadowOffsetX = 1;
                ctx.shadowOffsetY = 1;
                ctx.fillStyle = 'black';
                ctx.fillText(options[i].title, 40, 0);

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

            ctx.beginPath();
            ctx.moveTo(centerX, 15);
            ctx.lineTo(centerX + 10, 0);
            ctx.lineTo(centerX - 10, 0);
            ctx.lineTo(centerX, 15);
            ctx.fillStyle = 'white';
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
            ctx.fillStyle = 'white';
            ctx.fill();
        }
    }
    public animateWheel(rotationCount: number, result: ElementBase): void {
        const progress =
            (performance.now() - this.startTime) / this.duration < 1
                ? (performance.now() - this.startTime) / this.duration
                : 1;

        const diff = Math.PI * 2 * rotationCount * easeInOutSine(progress);
        this.rotation = diff;
        if (progress < 1) {
            this.drawWheel(this.rotation, this.options, result);
            window.requestAnimationFrame(() =>
                this.animateWheel(rotationCount, result)
            );
        } else {
            this.isSpinning = false;
            highlightResult(result.element);
            playAudio();
        }
    }
    public startWheel(duration: number, result: ElementBase): void {
        removeHighlight(result.element);
        this.duration = duration;
        const rotationCount = this.generateRotationCount();
        if (!this.isSpinning) {
            this.isSpinning = true;
            this.rotation = 0;
            this.startTime = performance.now();
            window.requestAnimationFrame(() =>
                this.animateWheel(rotationCount, result)
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
    const localStorage = new LocalStorage('decision-maker_options');
    const options: Option[] = localStorage.getData();
    const filteredOptions = options.filter(
        (option) => option.title.length !== 0 && option.weight.length !== 0
    );
    return filteredOptions;
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
