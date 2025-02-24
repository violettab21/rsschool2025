import AppController from '../controller/controller';
import { AppView } from '../view/appView';
import { EverythingResponse, SourceResponse } from '../../interfaces';
class App {
    private readonly controller: AppController;
    private readonly view: AppView;
    constructor() {
        this.controller = new AppController();
        this.view = new AppView();
    }

    public start(): void {
        (document.querySelector('.sources') as Element).addEventListener('click', (e: Event) =>
            this.controller.getNews(e, (data: Readonly<EverythingResponse>) => this.view.drawNews(data))
        );
        (document.querySelector('.search__field') as Element).addEventListener('input', () => {
            if ((document.querySelector('.search__field') as HTMLInputElement).value) {
                (document.querySelector('.search__button') as HTMLButtonElement).disabled = false;
            } else (document.querySelector('.search__button') as HTMLButtonElement).disabled = true;
        });
        (document.querySelector('.search') as Element).addEventListener('click', (e: Event) =>
            this.controller.getNewsBySearch(e, (data: Readonly<EverythingResponse>) => this.view.drawNews(data))
        );
        this.controller.getSources((data: Readonly<SourceResponse>) => this.view.drawSources(data));
        (document.querySelector('.sources__categories') as Element).addEventListener('change', () =>
            this.controller.getSourcesByCategories((data: Readonly<SourceResponse>) => this.view.drawSources(data))
        );
    }
}

export default App;
