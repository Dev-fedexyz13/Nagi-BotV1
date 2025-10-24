const handler = async (m, { conn, usedPrefix}) => {
  const mentionedUsers = await m.mentionedJid;
  const quotedUser = m.quoted && await m.quoted.sender;
  const targetUser = mentionedUsers?.[0] || quotedUser;

  if (!targetUser) {
    return conn.reply(m.chat, '🍃 Debes mencionar o responder a un usuario para expulsarlo del grupo.', m);
}

  try {
    const groupMetadata = await conn.groupMetadata(m.chat);
    const groupOwner = groupMetadata.owner || `${m.chat.split('-')[0]}@s.whatsapp.net`;
    const botOwner = `${global.owner[0][0]}@s.whatsapp.net`;

    if (targetUser === conn.user.jid) {
      return conn.reply(m.chat, '🍂 No puedo eliminar al bot del grupo.', m);
}

    if (targetUser === groupOwner) {
      return conn.reply(m.chat, '🍂 No puedo eliminar al propietario del grupo.', m);
}

    if (targetUser === botOwner) {
      return conn.reply(m.chat, '🍂 No puedo eliminar al propietario del bot.', m);
}

    await conn.groupParticipantsUpdate(m.chat, [targetUser], 'remove');
} catch (error) {
    console.error('Error al intentar expulsar al usuario:', error);
    return conn.reply(
      m.chat,
      `⚠︎ Se ha producido un problema al intentar expulsar al usuario.\nUsa *${usedPrefix}report* para informarlo.\n\n${error.message}`,
      m
);
}
};

handler.help = ['kick'];
handler.tags = ['grupo'];
handler.command = ['kick', 'echar', 'ban'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
