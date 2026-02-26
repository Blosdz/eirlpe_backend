import { HostnamesService } from './hostnames.service';
export declare class HostnamesController {
    private readonly hostnamesService;
    constructor(hostnamesService: HostnamesService);
    checkAvailability(hostname: string): Promise<{
        available: boolean;
        hostname: string;
    }>;
    findAll(): Promise<import("../entities").Hostname[]>;
    findOne(id: number): Promise<import("../entities").Hostname>;
    create(body: {
        hostname: string;
    }, req: any): Promise<import("../entities").Hostname>;
    update(id: number, body: {
        hostname: string;
    }): Promise<import("../entities").Hostname>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
