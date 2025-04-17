import type { Route } from '../interfaces';
import { renderLoginContent } from '../pages/login';
import type { UserService } from '../pages/user-service';
import type { Connection } from '../connection/connection';
import { renderChatPageContent } from '../pages/chat';
export class Router {
    public routes: Route[];
    public currentUrl: string;
    public connection: Connection;
    constructor(connection: Connection, userService: UserService) {
        this.connection = connection;
        this.currentUrl = '';
        this.routes = this.setRoutes(userService);
    }

    public openPage(path?: string): void {
        const isHistory: boolean = path !== undefined;
        if (isHistory) {
            history.pushState(null, '', path);
        }
        this.currentUrl = globalThis.location.pathname.slice(1);
        if (this.currentUrl === '') history.pushState(null, '', 'login');
        this.routes.find((route) => route.url === this.currentUrl)?.handler();
    }
    protected setRoutes(userService: UserService): Route[] {
        const routes: Route[] = [
            {
                url: 'login',
                handler: renderLoginContent.bind(
                    null,
                    this.connection,
                    userService
                ),
            },
            {
                url: 'chat',
                handler: renderChatPageContent,
            },
            {
                url: 'info',
                handler: () => console.log('info'),
            },
            {
                url: '',
                handler: renderLoginContent.bind(
                    null,
                    this.connection,
                    userService
                ),
            },
        ];

        return routes;
    }
}
