import { Client } from "@notionhq/client";
import { logger } from "./log.js";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const databaseId = process.env.NOTION_DB_ID;

async function saveToNotion(data) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: {
          type: "title",
          title: [
            {
              type: "text",
              text: {
                content: data.description,
              },
            },
          ],
        },
        Link: {
          url: data.link,
        },
        User: {
          type: "rich_text",
          rich_text: [
            {
              type: "text",
              text: {
                content: data.user,
              },
            },
          ],
        },
      },
    });
    logger.log("info", "Entry successfully added to the notion", { data });
  } catch (error) {
    logger.log("error", "Failed to add an entry to the notion", { error });
  }
}

export { saveToNotion };
