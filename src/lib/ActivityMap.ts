import { ActivityType } from "discord.js";
import { type Bot } from "../bot";

export function ActivityMap(bot: Bot, activities: string[]) {
  setInterval(
    async () => {
      for (const activitiy of activities) {
        await new Promise((resolve) =>
          setTimeout(
            () =>
              resolve(
                bot.user?.setActivity(activitiy, {
                  type: ActivityType.Competing,
                }),
              ),
            10 * 1000,
          ),
        );
      }
    },
    activities.length * 10 * 1000,
  );
  return null;
}
