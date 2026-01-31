import { Repository } from 'typeorm';
import { Hostname } from '../entities/hostname.entity';
export declare class HostnamesService {
    private hostnamesRepository;
    constructor(hostnamesRepository: Repository<Hostname>);
    checkAvailability(hostname: string): Promise<{
        available: boolean;
        hostname: string;
    }>;
    register(hostname: string): Promise<Hostname>;
    findByHostname(hostname: string): Promise<Hostname | null>;
    findAll(): Promise<Hostname[]>;
    findById(id: number): Promise<Hostname | null>;
    update(id: number, hostname: string): Promise<Hostname | null>;
    delete(id: number): Promise<void>;
    registerWithUser(hostname: string, userId: number): Promise<Hostname>;
}
