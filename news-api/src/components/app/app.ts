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
            this.controller.getNews(e, (data: EverythingResponse) => this.view.drawNews(data))
        );
        this.controller.getSources((data: SourceResponse) => this.view.drawSources(data));
    }
}

export default App;
