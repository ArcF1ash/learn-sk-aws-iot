import { iot, mqtt5 } from 'aws-iot-device-sdk-v2';
import { ICrtError } from 'aws-iot-device-sdk-v2';
import { toUtf8 } from '@aws-sdk/util-utf8-browser';

// Function to configure the MQTT5 client settings
function createClientConfig(endpoint: string, certPath: string, keyPath: string) : mqtt5.Mqtt5ClientConfig {
    let builder: iot.AwsIotMqtt5ClientConfigBuilder | undefined  = undefined;

    builder = iot.AwsIotMqtt5ClientConfigBuilder.newDirectMqttBuilderWithMtlsFromPath(endpoint, certPath, keyPath);
    builder.withConnectProperties({
        keepAliveIntervalSeconds: 1200
    });

    return builder.build();
}

// Function to start the MQTT5 client
export const startClient = async (endpoint: string, certPath: string, keyPath: string, topicName: string, onMessage: (topic: string, payload: string) => void): Promise<void> => {
    let config : mqtt5.Mqtt5ClientConfig = createClientConfig(endpoint, certPath, keyPath);
    
    console.log("Creating client for " + config.hostName);
    let client : mqtt5.Mqtt5Client = new mqtt5.Mqtt5Client(config);

    // Handle client lifecycle events
    client.on('messageReceived', (eventData: mqtt5.MessageReceivedEvent) : void => {
        console.log("Message received: " + JSON.stringify(eventData.message));
        if (eventData.message.payload) {
            const messageTopic = eventData.message.topicName || '';
            const messagePayload = toUtf8(new Uint8Array(eventData.message.payload as ArrayBuffer));
            onMessage(messageTopic, messagePayload);
        }
    });
    
    client.on('error', (error: ICrtError) => {
        console.log("Error event: " + error.toString());
    });

    client.on('attemptingConnect', (eventData: mqtt5.AttemptingConnectEvent) => {
        console.log("Client attempting to connect.");
    });

    client.on('connectionSuccess', (eventData: mqtt5.ConnectionSuccessEvent) => {
        console.log("Client successfully connected.");
    });

    client.on('connectionFailure', (eventData: mqtt5.ConnectionFailureEvent) => {
        console.log("Failed to establish connection: " + eventData.error.toString());
    });

    client.on('disconnection', (eventData: mqtt5.DisconnectionEvent) => {
        console.log("Client disconnected: " + eventData.error.toString());
    });

    client.on('stopped', (eventData: mqtt5.StoppedEvent) => {
        console.log("Client stopped.");
    });

    // Start the client and subscribe to the topic
    try {
        await client.start();

        await client.subscribe({
            subscriptions: [
                { qos: mqtt5.QoS.AtMostOnce, topicFilter: topicName }
            ]
        });
    } catch (error) {
        console.log('Error starting the MQTT client:', error);
    }
}