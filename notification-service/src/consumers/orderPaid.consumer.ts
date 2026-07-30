import { Worker } from "bullmq";
import { Resend } from "resend";
import { redisConnection } from "@/config/redis";
import { env } from "@/config/env";

const resend = new Resend(env.RESEND_API_KEY);

// Idempotency ở tầng ứng dụng — Set trong memory chỉ demo cho quy mô portfolio,
// KHÔNG bền vững khi restart process (mất hết). Ghi rõ hạn chế này, không giấu đi.
// Production thật cần lưu vào DB/Redis riêng (bảng processed_notification_events),
// tương tự cách ProcessedWebhookEvent đã làm ở Core API.
const processedOrderIds = new Set<string>();

export const orderPaidWorker = new Worker(
  "notifications",
  async (job) => {
    if (job.name !== "order.paid") {
      console.log(`[notification] ignored job type: ${job.name}`);
      return;
    }

    const { orderId, customerEmail } = job.data as {
      orderId: string;
      userId: string;
      stripeSessionId: string;
      customerEmail: string;
    };

    if (processedOrderIds.has(orderId)) {
      console.log(`[notification] order ${orderId} already notified, skipping`);
      return;
    }

    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: customerEmail, 
      subject: `Order ${orderId} confirmed`,
      html: `<p>Your order <strong>${orderId}</strong> has been paid successfully.</p>`,
    });
    processedOrderIds.add(orderId);
    console.log(`[notification] sent confirmation email for order ${orderId}`);
  },
  { connection: redisConnection },
);

orderPaidWorker.on("failed", (job, err) => {
  console.error(`[notification] job ${job?.id} failed:`, err.message);
});
