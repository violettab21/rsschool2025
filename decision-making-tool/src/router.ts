interface Route {
    url: string;
    handler: () => void;
}
export class Router {
    public routes: Route[];
    constructor(routes: Route[]) {
        this.routes = routes;
    }
    public openPage(path?: string): void {
        const isHistory: boolean = path !== undefined;
        if (isHistory) {
            history.pushState(null, '', path);
            console.log('added to history');
        }
        const url = window.location.pathname.substring(1);
        const selectedRoute = this.routes.find(
            (element) => element.url === url
        );
        if (selectedRoute) {
            selectedRoute.handler();
        } else {
            console.log('not found');
            this.routes[3].handler();
        }
    }
}
