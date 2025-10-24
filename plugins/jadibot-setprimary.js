let handler = async (m, { conn, text}) => {
  if (!m.isGroup) {
    throw '🌿 Este comando solo puede usarse dentro de grupos.';
}

  if (!text ||!/^\d+$/.test(text)) {
    throw '🍂 Debes proporcionar el número del bot que deseas establecer como principal.\n🌿 Ejemplo: #setprimary 549115617878';
}

  const botJid = `${text}@s.whatsapp.net`;
  const chatData = global.db.data.chats[m.chat] ||= {};

  if (chatData.primaryBot === botJid) {
    return conn.reply(
      m.chat,
      `@${text} Ya está establecido como bot principal en este grupo.`,
      m,
      { mentions: [botJid]}
);
}

  chatData.primaryBot = botJid;

  const confirmation = `🍃 *@${text}* ahora es el bot principal del grupo.\n` +
    `Solo él responderá a los comandos.`;

  await conn.sendMessage(m.chat, {
    text: confirmation,
    mentions: [botJid]
}, { quoted: m});
};

handler.help = ['setprimary <número>'];
handler.tags = ['owner', 'group'];
handler.command = ['setprimary'];
handler.rowner = true;
handler.group = true;

export default handler;
