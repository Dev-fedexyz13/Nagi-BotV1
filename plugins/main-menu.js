let handler = async (m, { conn, usedPrefix}) => {
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const nombre = await conn.getName(m.sender);
  const user = global.db.data.users[m.sender];

  const premium = user.premium? '✅ Sí': '❌ No';
  const limite = user.limit || 0;
  const totalreg = Object.keys(global.db.data.users).length;
  const groupsCount = Object.values(conn.chats).filter(v => v.id.endsWith('@g.us')).length;
  const muptime = clockString(process.uptime());

  function clockString(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}

  const infoUser = `
🍃 *_Hola, ${nombre} Soy Nagi-BotV1._*

🌿 *_INFO USUARIO_*
> *_Usuario:_* *${nombre}*
> *_Premium:_* *${premium}*
> *_Límite:_* *${limite}*

🌿 *_DATOS DEL BOT_*
> *_Grupos:_* *${groupsCount}*
> *_Activo:_* *${muptime}*
> *_Usuarios:_* *${totalreg}*
> *_Plataforma:_* *Ubuntu*
`.trim();

  const imagen = 'https://kirito.my/media/images/95668416_k.jpg';
  const video = 'https://files.catbox.moe/6zg54n.mp4';
  const after = `© ᴍᴀᴅᴇ ʙʏ ᴅᴇᴠ-ꜰᴇᴅᴇxʏᴢ`;

  await m.react('⚽');

  await conn.sendMessage(m.chat, {
    video: { url: video},
    caption: `${infoUser}\n\n${after}`,
    contextInfo: {
      externalAdReply: {
        title: '© ᴍᴀᴅᴇ ʙʏ ᴅᴇᴠ-ꜰᴇᴅᴇxʏᴢ 🍂',
        body: '⌬ NagiBot-IA 🍃',
        thumbnailUrl: imagen,
        mediaType: 1,
        renderLargerThumbnail: true,
        sourceUrl: 'https://github.com/Dev-fedexyz13'
}
},
    buttons: [
      {
        buttonId: `${usedPrefix}menucompleto`,
        buttonText: { displayText: '🌿 ᴍᴇɴᴜ ᴄᴏᴍᴘʟᴇᴛᴏ'},
        type: 1
},
      {
        buttonId: `${usedPrefix}reg Nagi-Bot.17`,
        buttonText: { displayText: '🌿 ᴀᴜᴛᴏ ʀᴇɢɪꜱᴛʀᴏ'},
        type: 1
}
    ]
}, { quoted: m});

  await delay(400);
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = ['menu', 'help', 'menú'];

export default handler;
