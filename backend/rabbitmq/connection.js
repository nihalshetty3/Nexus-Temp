import amqp from "amqplib";

let channel;

export async function connectRabbitMQ(){
    const connection = await amqp.connect(
        process.env.RABBITMQ_URL || "amqp://localhost:5673"
    );

    channel = await connection.createChannel();

    await channel.assertQueue("purchase-events" , {
        durable: true
    });

    console.log("RabbitMQ connected");
}

export function getChannel(){
    return channel;
}