import { TenantContext } from '../interfaces/tenant-context.interface';
export declare const CurrentTenant: (...dataOrPipes: (import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | keyof TenantContext | undefined)[]) => ParameterDecorator;
