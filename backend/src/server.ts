import config from './config';
import connectAndSubscribe from './client';

connectAndSubscribe(config.AWS_ENDPOINT,config.AWS_CERT_PATH,config.AWS_KEY_PATH, config.AWS_IOT_TOPIC);