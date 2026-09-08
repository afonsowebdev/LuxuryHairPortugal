import { ok } from "@/backend/lib/response";
import { withAdmin } from "@/backend/middleware/withAdmin";
import { listSubscribers } from "@/backend/models/message.model";

export const GET = withAdmin(async () => {
  const subscribers = await listSubscribers();
  return ok(subscribers);
});
