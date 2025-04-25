import type { Route } from '../interfaces';
import { renderLoginContent } from '../pages/login';
import { UserService } from '../services/user-service';
import type { Connection } from '../connection/connection';
import { renderChatPageContent } from '../pages/chat';
import { renderInfoContent } from '../pages/info';
import { ChatService } from '../services/chat-service';
import type { State } from '../state/state';
export class Router {
    public routes: Route[];
    public currentUrl: string;
    public connection: Connection;
    public userService: UserService;
    public chatService: ChatService;
    constructor(connection: Connection, state: State) {
        this.connection = connection;
        this.currentUrl = '';
        this.userService = new UserService(connection, this, state);
        this.chatService = new ChatService(connection, this, this.userService);
        this.routes = this.setRoutes();
        globalThis.addEventListener('popstate', () => {
            this.openPage();
        });
    }

    public openPage(path?: string): void {
        const isHistory: boolean = path !== undefined;
        if (isHistory) {
            history.pushState(null, '', path);
        }
        this.currentUrl = globalThis.location.pathname.slice(1);
        console.log(this.currentUrl);
        if (this.currentUrl === '') history.pushState(null, '', 'login');
        this.routes.find((route) => route.url === this.currentUrl)?.handler();
    }
    protected setRoutes(): Route[] {
        const routes: Route[] = [
            {
                url: 'login',
                handler: this.openLoginPage.bind(this),
            },
            {
                url: 'chat',
                handler: this.openChatPage.bind(this),
            },
            {
                url: 'info',
                handler: renderInfoContent,
            },
            {
                url: '',
                handler: this.openLoginPage.bind(this),
            },
        ];

        return routes;
    }
    protected openLoginPage(): void {
        this.userService.getAllActiveUsers();
        this.userService.getAllInactiveUsers();
        const currentUser = this.userService.users.find(
            (element) => element.login === this.userService.currentUser.login
        );
        if (currentUser && currentUser.isLogined) {
            this.redirectToChat();
        } else renderLoginContent(this.connection, this.userService, this);
    }
    protected openChatPage(): void {
        this.userService.getAllActiveUsers();
        this.userService.getAllInactiveUsers();
        const currentUser = this.userService.users.find(
            (element) => element.login === this.userService.currentUser.login
        );

        if (currentUser && currentUser.isLogined) {
            renderChatPageContent(this.userService, this.chatService, this);
        } else {
            this.redirectToLogin();
        }
    }

    protected redirectToChat(): void {
        renderChatPageContent(this.userService, this.chatService, this);
        history.replaceState(null, '', '/chat');
    }
    protected redirectToLogin(): void {
        renderLoginContent(this.connection, this.userService, this);
        history.replaceState(null, '', '/login');
    }
}
