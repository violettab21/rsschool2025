import { LocalStorage } from './localStorage';
import type { Option } from './options';

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
        this.wheelElement.id = '#wheel';
        this.rotation = 0;
        this.options = getValidOptions();
        this.colors = this.generateColors();
        this.drawWheel(this.rotation, this.options);
        this.duration = 6000;
        this.isSpinning = false;
        this.startTime = 0;
    }
    public drawWheel(rotation: number, options: Option[]): void {
        const ctx = this.wheelElement.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, 400, 250);
            ctx.save();
            ctx.translate(150, 75);
            ctx.rotate(rotation);

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
                ctx.arc(0, 0, 70, startRadians, endRadians);
                const textX =
                    (70 / 2) *
                    Math.cos(startRadians + (endRadians - startRadians) / 2);
                const textY =
                    (70 / 2) *
                    Math.sin(startRadians + (endRadians - startRadians) / 2);

                ctx.lineTo(0, 0);

                ctx.closePath();
                ctx.strokeStyle = 'yellow';
                ctx.lineWidth = 3;
                ctx.stroke();
                ctx.fillStyle = this.colors[i];
                ctx.fill();
                ctx.save();
                ctx.translate(textX, textY);
                ctx.rotate(startRadians + (endRadians - startRadians) / 2);
                ctx.font = '12px';
                ctx.fillStyle = 'black';
                ctx.fillText(options[i].title, -10, 0);
                ctx.restore();
                startRadians = endRadians;
            }
            ctx.restore();
        }
    }
    public animateWheel(rotationCount: number): void {
        const progress =
            (performance.now() - this.startTime) / this.duration < 1
                ? (performance.now() - this.startTime) / this.duration
                : 1;

        const diff = Math.PI * 2 * rotationCount * easeInOutSine(progress);
        this.rotation = diff;
        if (progress < 1) {
            this.drawWheel(this.rotation, this.options);
            window.requestAnimationFrame(() =>
                this.animateWheel(rotationCount)
            );
        } else this.isSpinning = false;
    }
    public startWheel(): void {
        const rotationCount = this.generateRotationCount();
        if (!this.isSpinning) {
            this.isSpinning = true;
            this.rotation = 0;
            this.startTime = performance.now();
            window.requestAnimationFrame(() =>
                this.animateWheel(rotationCount)
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
function getValidOptions(): Option[] {
    const localStorage = new LocalStorage('decision-maker_options');
    const options: Option[] = localStorage.getData();
    const filteredOptions = options.filter(
        (option) => option.title.length !== 0 && option.weight.length !== 0
    );
    return filteredOptions;
}
