import { ElementBase } from './elements';
import type { LoginPage } from '../pages/login';

export class Main {
    public main: Element;
    public content: LoginPage | null;
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
