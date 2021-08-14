export function isCommand(message) {
  return (
    message.entities && message.entities.some((e) => e.type === "bot_command")
  );
}

export function isCalledDirectlyWithReply(message) {
  if (!message.text) return false;
  return /^@DocSaveTestBot+$/.exec(message.text.trim());
  // && msg.reply_to_message &&
  // checkIfLinkOrFile(msg.reply_to_message)
}
