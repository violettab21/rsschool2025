import { ElementBase } from './element';
import type { OptionsPage } from '../pages/options';
import type { Picker } from '../pages/picker';
import type { ErrorPage } from '../pages/error-page';

export class Main {
    public pageTitle: ElementBase;
    public main: ElementBase;
    public content: OptionsPage | Picker | ErrorPage | null;
    constructor() {
        this.pageTitle = new ElementBase({
            tag: 'p',
            className: ['title'],
            textContent: 'Decision Making Tool',
        });
        this.main = new ElementBase({ tag: 'main', className: ['main'] });
        this.configureBasicView();
        this.content = null;
    }
    public configureBasicView(): void {
        this.main.element.append(this.pageTitle.element);
        document.body.append(this.main.element);
    }
}
