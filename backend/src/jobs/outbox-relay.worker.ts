import prisma from "@/config/prisma";
import { notificationQueue } from "./queues/notification.queue";

const relayOutboxEvents = async () => {
  try {
    const events = await prisma.outboxEvent.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      take: 20,
    });

    if (events.length === 0) {
      return;
    }

    for (const event of events) {
      try {
        await notificationQueue.add(event.eventType, event.payload as object);

        await prisma.outboxEvent.update({
          where: {
            id: event.id,
          },
          data: {
            status: "PUBLISHED",
            publishedAt: new Date(),
          },
        });

        console.log(
          `[Outbox] published event ${event.id} (${event.eventType})`,
        );
      } catch (error) {
        console.error(`[Outbox] failed to publish event ${event.id}:`, error);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const startPolling = () => {
  setTimeout(async () => {
    await relayOutboxEvents();
    startPolling();
  }, 5000);
};

export const startOutboxRelay = () => {
  console.log("[Outbox] Bắt đầu lắng nghe sự kiện...");
  startPolling();
};
