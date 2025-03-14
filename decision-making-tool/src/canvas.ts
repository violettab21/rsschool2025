export class Wheel {
    public wheelElement: HTMLCanvasElement;
    constructor() {
        this.wheelElement = document.createElement('canvas');
        this.wheelElement.id = '#wheel';
        this.drawWheelBorder();
    }
    public drawWheelBorder(): void {
        const ctx = this.wheelElement.getContext('2d');
        if (ctx) {
            ctx.beginPath();
            ctx.arc(150, 75, 70, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}
