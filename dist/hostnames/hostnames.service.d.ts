import { Repository } from 'typeorm';
import { Hostname } from '../entities';
export declare class HostnamesService {
    private hostnameRepository;
    constructor(hostnameRepository: Repository<Hostname>);
    findAll(): Promise<Hostname[]>;
    findOne(id: number): Promise<Hostname>;
    findByHostname(hostname: string): Promise<Hostname | null>;
    checkAvailability(hostname: string): Promise<{
        available: boolean;
        hostname: string;
    }>;
    create(hostname: string): Promise<Hostname>;
    registerWithUser(hostname: string, userId: number): Promise<Hostname>;
    remove(id: number): Promise<void>;
}
