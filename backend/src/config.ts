import path from 'path';
import dotenv from 'dotenv';

// Parse the .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Interface to load env variables
interface ENV {
    AWS_ENDPOINT: string | undefined;
    AWS_CERT_PATH: string | undefined;
    AWS_KEY_PATH: string | undefined;
    AWS_IOT_TOPIC: string | undefined;
}

interface Config {
    AWS_ENDPOINT: string;
    AWS_CERT_PATH: string;
    AWS_KEY_PATH: string;
    AWS_IOT_TOPIC: string;
}

// Load process.env as Env interface
const getConfig = (): ENV => {
    return {
        AWS_ENDPOINT: process.env.AWS_ENDPOINT,
        AWS_CERT_PATH: process.env.AWS_CERT_PATH,
        AWS_KEY_PATH: process.env.AWS_KEY_PATH,
        AWS_IOT_TOPIC: process.env.AWS_IOT_TOPIC
    }
}

const getSanitizedConfig = (config: ENV): Config => {
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined) {
            throw new Error('Missing key ${key} in .env');
        }
    }
    return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitizedConfig(config);

export default sanitizedConfig;