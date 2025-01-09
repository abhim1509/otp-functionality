import { closeDb } from "./db_connectivity";
import { closeRedis } from "./redis_client";

export const shutdown = () => {
  closeDb();
  closeRedis();
  process.exit(1);
};
