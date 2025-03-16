interface Route {
    url: string;
    handler: () => void;
}
export class Router {
    public routes: Route[];
    constructor(routes: Route[]) {
        this.routes = routes;
    }
    public openPage(path: string): void {
        const selectedRoute = this.routes.find(
            (element) => element.url === path
        );
        if (selectedRoute) selectedRoute.handler();
    }
}
