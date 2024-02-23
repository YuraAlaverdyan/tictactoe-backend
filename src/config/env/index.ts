import dotenv from 'dotenv';

export class EnvConfig {
    private static instance: EnvConfig;
    private readonly env: { [key: string]: string };

    private constructor() {
        this.env = dotenv.config().parsed || {};
    }

    public static getInstance(): EnvConfig {
        if (!EnvConfig.instance) {
            EnvConfig.instance = new EnvConfig();
        }
        return EnvConfig.instance;
    }

    public get(key: string): string {
        return this.env[key] || '';
    }

    public getInt(key: string): number {
        return parseInt(this.env[key] || '', 10);
    }

    public getBool(key: string): boolean {
        return this.env[key] === 'true';
    }
}
