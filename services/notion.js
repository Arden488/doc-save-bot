import { Client } from "@notionhq/client";

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
      //   children: [
      //     {
      //       object: "block",
      //       type: "paragraph",
      //       paragraph: {
      //         text: [
      //           {
      //             type: "text",
      //             text: {
      //               content: JSON.stringify(savedData.link),
      //             },
      //           },
      //         ],
      //       },
      //     },
      //   ],
    });
    console.log("Success! Entry added.");
  } catch (error) {
    console.error(error.body);
  }
}

export { saveToNotion };
