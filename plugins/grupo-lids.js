const handler = async (m, { conn, text, args}) => {
  const mentioned = m.mentionedJid && m.mentionedJid.length? m.mentionedJid[0]: m.sender;
  const number = mentioned.split('@')[0];

  const id = `${number}@s.whatsapp.net`;
  const lid = `${Math.floor(Math.random() * 1e14)}@lid`;

  const message = `🍃 *_ID_:* ${id}\n🌿 *_LID:_* ${lid}`;

  await conn.reply(m.chat, message, m, {
    mentions: [mentioned]
});
};

handler.command = ['lid'];
handler.help = ['.lid'];
handler.tags = ['grupo'];
handler.register = true;

export default handler;
