import { iot, mqtt5 } from 'aws-iot-device-sdk-v2';
import { ICrtError } from 'aws-iot-device-sdk-v2';
import { toUtf8 } from '@aws-sdk/util-utf8-browser';
import { once } from "events";

// Function to configure the MQTT5 client settings
function createClientConfig(endpoint: string, certPath: string, keyPath: string) : mqtt5.Mqtt5ClientConfig {
    let builder: iot.AwsIotMqtt5ClientConfigBuilder | undefined  = undefined;

    builder = iot.AwsIotMqtt5ClientConfigBuilder.newDirectMqttBuilderWithMtlsFromPath(endpoint, certPath, keyPath);
    builder.withConnectProperties({
        keepAliveIntervalSeconds: 1200
    });

    return builder.build();
}

// Function to create the MQTT5 client
function createClient(endpoint: string, certPath: string, keyPath: string) : mqtt5.Mqtt5Client {
    let config : mqtt5.Mqtt5ClientConfig = createClientConfig(endpoint, certPath, keyPath);

    console.log("Creating client for " + config.hostName);
    let client : mqtt5.Mqtt5Client = new mqtt5.Mqtt5Client(config);

    client.on('error', (error: ICrtError) => {
        console.log("Error event: " + error.toString());
    });

    client.on('messageReceived', (eventData: mqtt5.MessageReceivedEvent) : void => {
        console.log("Message received: " + JSON.stringify(eventData.message));
        if (eventData.message.payload) {
            const utf8Payload = toUtf8(new Uint8Array(eventData.message.payload as ArrayBuffer));
            console.log(" with payload: " + utf8Payload);
        }
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

    return client;
}

export default async function connectAndSubscribe(endpoint: string, certPath: string, keyPath: string, topicName: string) {
    let client : mqtt5.Mqtt5Client = createClient(endpoint, certPath, keyPath);

    const connectionSuccess = once(client, "connectionSuccess");
    
    client.start();

    await connectionSuccess;

    const suback = await client.subscribe({
        subscriptions: [
            { qos: mqtt5.QoS.AtMostOnce, topicFilter: topicName }
        ]
    });
}