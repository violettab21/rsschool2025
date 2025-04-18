import type { Route } from '../interfaces';
import { renderLoginContent } from '../pages/login';
import { UserService } from '../services/user-service';
import type { Connection } from '../connection/connection';
import { renderChatPageContent } from '../pages/chat';
import { ChatService } from '../services/chat-service';
export class Router {
    public routes: Route[];
    public currentUrl: string;
    public connection: Connection;
    public userService: UserService;
    public chatService: ChatService;
    constructor(connection: Connection) {
        this.connection = connection;
        this.currentUrl = '';
        this.userService = new UserService(connection, this);
        this.chatService = new ChatService(connection, this, this.userService);
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
                handler: renderChatPageContent.bind(
                    null,
                    userService,
                    this.chatService
                ),
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
