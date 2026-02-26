import { Repository } from 'typeorm';
import { Hostname, UserProfile } from '../entities';
import { TenantConnectionService } from '../tenant/tenant-connection.service';
export declare class HostnamesService {
    private hostnameRepository;
    private userProfileRepository;
    private tenantConnectionService;
    private readonly logger;
    constructor(hostnameRepository: Repository<Hostname>, userProfileRepository: Repository<UserProfile>, tenantConnectionService: TenantConnectionService);
    findAll(): Promise<Hostname[]>;
    findOne(id: number): Promise<Hostname>;
    findByHostname(hostname: string): Promise<Hostname | null>;
    checkAvailability(hostname: string): Promise<{
        available: boolean;
        hostname: string;
    }>;
    create(hostname: string, userId?: number): Promise<Hostname>;
    registerWithUser(hostname: string, userId: number): Promise<Hostname>;
    update(id: number, hostname: string): Promise<Hostname>;
    remove(id: number): Promise<void>;
}
