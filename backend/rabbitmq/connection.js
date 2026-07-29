import amqp from "amqplib";

let channel;

export async function connectRabbitMQ() {
    while (true) {
        try {
            const connection = await amqp.connect(
                process.env.RABBITMQ_URL || "amqp://rabbitmq:5672"
            );

            channel = await connection.createChannel();

            await channel.assertQueue("purchase-events", {
                durable: true,
            });

            console.log("✅ RabbitMQ connected");
            return;
        } catch (err) {
            console.log("⏳ Waiting for RabbitMQ...");
            await new Promise((resolve) => setTimeout(resolve, 3000));
        }
    }
}

export function getChannel() {
    return channel;
}