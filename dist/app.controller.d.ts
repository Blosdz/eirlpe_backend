import type { Response } from 'express';
import { PagesService } from './pages/pages.service';
export declare class AppController {
    private readonly pagesService;
    constructor(pagesService: PagesService);
    root(res: Response): void;
    getHealth(): {
        status: string;
        timestamp: string;
    };
}
