import { HostnamesService } from './hostnames.service';
export declare class HostnamesController {
    private readonly hostnamesService;
    constructor(hostnamesService: HostnamesService);
    checkAvailability(hostname: string): Promise<{
        available: boolean;
        hostname: string;
    }>;
    register(body: {
        hostname: string;
    }): Promise<import("../entities").Hostname>;
    registerWithUser(body: {
        hostname: string;
        userId: number;
    }): Promise<import("../entities").Hostname>;
    findAll(): Promise<import("../entities").Hostname[]>;
    findById(id: number): Promise<import("../entities").Hostname | null>;
    update(id: number, body: {
        hostname: string;
    }): Promise<import("../entities").Hostname | null>;
    delete(id: number): Promise<{
        message: string;
    }>;
}
