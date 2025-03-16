import { ElementBase } from './element';
import type { OptionsPage } from './options';
import type { Picker } from './picker';
export class Main {
    public pageTitle: ElementBase;
    public main: ElementBase;
    public content: OptionsPage | Picker | null;
    constructor() {
        this.pageTitle = new ElementBase({
            tag: 'p',
            className: ['title'],
            textContent: 'Decision Making Tool',
        });
        this.main = new ElementBase({ tag: 'main', className: ['main'] });
        this.configurePageView();
        this.content = null;
    }
    public configurePageView(): void {
        this.main.element.append(this.pageTitle.element);
        document.querySelector('body')?.append(this.main.element);
    }
}
