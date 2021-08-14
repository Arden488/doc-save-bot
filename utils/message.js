function getMessageType(message) {
  if (!message) return false;

  if (message.document) return "file";
  else if (isLink(message.text)) return "link";
  return "other";
}

function isLink(text) {
  let url;

  try {
    url = new URL(text);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

export { getMessageType };
