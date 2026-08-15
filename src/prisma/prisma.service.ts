import {OnModuleDestroy, OnModuleInit, Logger} from "@nestjs/common";
import {PrismaClient} from "@prisma/client";

export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);
    
    async onModuleInit() {
        try {
            // Use a timeout to prevent hanging on database connection
            const connectPromise = this.$connect();
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Database connection timeout')), 10000)
            );
            
            await Promise.race([connectPromise, timeoutPromise]);
            this.logger.log('Database connected successfully');
        } catch (error) {
            this.logger.warn(`Database connection failed: ${error.message}. App will continue; requests will fail until DB is available.`);
        }
    }
    
    async onModuleDestroy() {
        await this.$disconnect();
    }
}

