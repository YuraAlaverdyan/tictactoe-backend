import mongoose, {ConnectOptions} from 'mongoose';
import logger from "@/utils/logger";

export class MongoDBService {
    private readonly uri: string;
    private readonly options: ConnectOptions;

    constructor(uri: string, options: ConnectOptions = {}) {
        this.uri = uri;
        this.options = options;
    }

    public async connect(): Promise<void> {
        try {
            logger.debug('Connecting to MongoDB...')
            await mongoose.connect(this.uri, this.options);
        } catch (error) {
            logger.error('Error connecting to MongoDB:', error);
        }
    }

    public async disconnect(): Promise<void> {
        await mongoose.disconnect();
        logger.info('MongoDB disconnected');
    }
}