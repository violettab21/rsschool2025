import type { Route } from '../interfaces';
import { renderLoginContent } from '../pages/login';
import { UserService } from '../pages/user-service';
import type { Connection } from '../connection/connection';
import { renderChatPageContent } from '../pages/chat';
export class Router {
    public routes: Route[];
    public currentUrl: string;
    public connection: Connection;
    public userService: UserService;
    constructor(connection: Connection) {
        this.connection = connection;
        this.currentUrl = '';
        this.userService = new UserService(connection, this);
        this.routes = this.setRoutes(this.userService);
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
                handler: renderChatPageContent.bind(null, userService),
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
