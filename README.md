A telegram bot written with `node-telegram-bot-api` to save files from group chats.

It has three options:

- save last file or link in the chat
- save file or link provided by user after command prompt
- save file or link mentioned to the bot in a message reply

The file is uploaded to the GDrive to be stored and accessed later.

The link to the stored file or a direct link is added to the notion using Notion API.

To make it work:

1. Create a telegram bot and allow it to read user messages https://core.telegram.org/bots#privacy-mode
2. create a `.env` file in the root with these lines:

```
TELEGRAM_TOKEN=<TOKEN_HERE>
NOTION_TOKEN=<TOKEN_HERE>
NOTION_DB_ID=<NOTION_DB_ID>
GDRIVE_UPLOAD_FOLDER=<GDRIVE_FOLDER_ID>
```

3. Add `credentials.json` with GDrive credentials
   https://developers.google.com/drive/api/v3/about-auth
4. Authorize gdrive the first time by running `yarn google-auth`.
   After successfull authorisation - the `token.json` file will be stored in the root for
   further authentication.
5. Add the bot the group
