import { LocalStorage } from './localStorage';
import type { Option } from './options';

export class Wheel {
    public wheelElement: HTMLCanvasElement;
    public rotation: number;
    constructor() {
        this.wheelElement = document.createElement('canvas');
        this.wheelElement.id = '#wheel';
        this.rotation = 0;
        this.drawWheel(this.rotation);
    }
    public drawWheel(rotation: number): void {
        const ctx = this.wheelElement.getContext('2d');
        if (ctx) {
            const localStorage = new LocalStorage('decision-maker_options');
            const options: Option[] = localStorage.getData();
            const filteredOptions = options.filter(
                (option) =>
                    option.title.length !== 0 && option.weight.length !== 0
            );

            let weightSum = 0;
            let startRadians = rotation;
            let endRadians = 0;
            for (let i = 0; i < filteredOptions.length; i += 1) {
                weightSum += parseInt(filteredOptions[i].weight);
            }
            const radiansPerOneWeight = (Math.PI * 2) / weightSum;
            for (let i = 0; i < filteredOptions.length; i += 1) {
                endRadians =
                    startRadians +
                    radiansPerOneWeight * parseInt(filteredOptions[i].weight);
                ctx.beginPath();
                ctx.arc(150, 75, 70, startRadians, endRadians);
                const textX =
                    150 +
                    (70 / 2) *
                        Math.cos(
                            startRadians + (endRadians - startRadians) / 2
                        );
                const textY =
                    75 +
                    (70 / 2) *
                        Math.sin(
                            startRadians + (endRadians - startRadians) / 2
                        );

                ctx.lineTo(150, 75);

                ctx.closePath();
                ctx.strokeStyle = 'yellow';
                ctx.lineWidth = 3;
                ctx.stroke();
                ctx.fillStyle = generateRandomColor();
                ctx.fill();
                ctx.save();
                ctx.translate(textX, textY);
                ctx.rotate(startRadians + (endRadians - startRadians) / 2);
                ctx.font = '12px';
                ctx.fillStyle = 'black';
                ctx.fillText(filteredOptions[i].title, -10, 0);
                ctx.restore();
                startRadians = endRadians;
            }
        }
    }
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
