import prisma from "@/config/prisma";
import { notificationQueue } from "./queues/notification.queue";
import { logger } from "@/config/logger";

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

        logger.info(
          `[Outbox] published event ${event.id} (${event.eventType})`,
        );
      } catch (error) {
        logger.error(
          error as Error,
          `[Outbox] failed to publish event ${event.id}`,
        );
      }
    }
  } catch (error) {
    logger.error(error as Error, "[Outbox] Critical error in relay mechanism");
  }
};

const startPolling = () => {
  setTimeout(async () => {
    await relayOutboxEvents();
    startPolling();
  }, 5000);
};

export const startOutboxRelay = () => {
  logger.info("[Outbox] Bắt đầu lắng nghe sự kiện...");
  startPolling();
};
