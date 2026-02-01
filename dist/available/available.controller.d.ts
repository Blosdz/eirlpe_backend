import { AvailableService } from './available.service';
export declare class AvailableController {
    private readonly availableService;
    constructor(availableService: AvailableService);
    checkAvailability(userId: number): Promise<{
        available: boolean;
        userId: number;
    }>;
    findAll(): Promise<import("../entities").Available[]>;
    getMyAvailability(req: any): Promise<{
        available: boolean;
        userId: number;
    }>;
    findOne(id: number): Promise<import("../entities").Available>;
    setAvailability(req: any, body: {
        available: boolean;
    }): Promise<import("../entities").Available>;
    setUserAvailability(userId: number, body: {
        available: boolean;
    }): Promise<import("../entities").Available>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
