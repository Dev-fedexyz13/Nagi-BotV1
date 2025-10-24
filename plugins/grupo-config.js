const handler = async (m, { conn, command, participants}) => {
  if (!m.isGroup) return;

  const isAdmin = participants.some(p => p.id === m.sender && p.admin);
  const botAdmin = participants.some(p => p.id === conn.user.jid && p.admin);

  if (command) {
    if (!isAdmin) {
      return conn.reply(m.chat, 'Solo los administradores pueden usar este comando.', m);
}

    if (!botAdmin) {
      return conn.reply(m.chat, 'Necesito ser administrador para cambiar la configuración del grupo.', m);
}

    const isOpen = command === 'abrir';
    const action = isOpen? 'not_announcement': 'announcement';

    await conn.groupSettingUpdate(m.chat, action);

    const estado = isOpen
? '🍃 El grupo ha sido abierto.\nAhora todos pueden mandar mensajes al grupo.'
: '🔒 El grupo ha sido cerrado.\nAhora solo los administradores pueden enviar mensajes al grupo.';

    await conn.sendMessage(m.chat, { text: estado}, { quoted: m});
}
};

handler.before = async (m, { conn}) => {
  if (!m.isGroup ||!m.messageStubType) return;

  const stub = m.messageStubType;
  const actor = m.messageStubParameters?.[0]?.split('@')[0];

  if (stub === 29) {
    await conn.sendMessage(m.chat, {
      text: `🔒 El grupo fue cerrado por @${actor}.\nAhora solo los administradores pueden enviar mensajes.`,
      mentions: [m.messageStubParameters[0]]
});
}

  if (stub === 30) {
    await conn.sendMessage(m.chat, {
      text: `🍃 El grupo fue abierto por @${actor}.\nAhora todos pueden enviar mensajes.`,
      mentions: [m.messageStubParameters[0]]
});
}
};

handler.help = ['abrir', 'cerrar'];
handler.tags = ['group'];
handler.command = ['abrir', 'cerrar'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
