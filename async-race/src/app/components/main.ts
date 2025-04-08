import { ElementBase } from './elements';
import type { GaragePage } from '../pages/garage/garage-page';
import type { Winners } from '../pages/winners';
export class Main {
    public main: Element;
    public content: GaragePage | Winners | null;
    constructor() {
        this.main = new ElementBase({
            tag: 'main',
            className: ['main'],
        }).element;
        this.configureView();
        this.content = null;
    }
    public configureView(): void {
        document.body.append(this.main);
    }
}
