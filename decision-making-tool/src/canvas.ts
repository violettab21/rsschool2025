import { LocalStorage } from './localStorage';
import type { Option } from './options';
export class Wheel {
    public wheelElement: HTMLCanvasElement;
    constructor() {
        this.wheelElement = document.createElement('canvas');
        this.wheelElement.id = '#wheel';
        this.drawWheel();
    }
    public drawWheel(): void {
        const ctx = this.wheelElement.getContext('2d');
        if (ctx) {
            ctx.beginPath();
            ctx.arc(150, 75, 70, 0, Math.PI * 2);
            ctx.stroke();
            const localStorage = new LocalStorage('decision-maker_options');
            const options: Option[] = localStorage.getData();
            const filteredOptions = options.filter(
                (option) =>
                    option.title.length !== 0 && option.weight.length !== 0
            );
            console.log(filteredOptions);

            let weightSum = 0;
            let startRadians = 0;
            let endRadians = 0;
            for (let i = 0; i < filteredOptions.length; i += 1) {
                weightSum += parseInt(filteredOptions[i].weight);
            }
            const radiansPerOneWeight = (Math.PI * 2) / weightSum;
            for (let i = 0; i < filteredOptions.length; i += 1) {
                endRadians =
                    startRadians +
                    radiansPerOneWeight * parseInt(filteredOptions[i].weight);
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
                startRadians = endRadians;
                ctx.lineTo(150, 75);
                ctx.stroke();
                ctx.font = '12px';
                ctx.fillText(filteredOptions[i].title, textX, textY);
            }
        }
    }
}
