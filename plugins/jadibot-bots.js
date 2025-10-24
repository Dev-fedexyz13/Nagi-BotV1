import { rmSync, existsSync} from 'fs';
import ws from 'ws';

const formatUptime = (ms) => {
  if (!ms || ms < 1000) return 'Nuevo';
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  return `${d? d + 'd, ': ''}${h % 24}h, ${m % 60}m, ${s % 60}s`;
};

const handler = async (m, { conn, command, usedPrefix}) => {
  const isDeleteBot = /^(deletebot|delcode)$/i.test(command);
  const isShowBots = /^bots$/i.test(command);

  try {
    if (isDeleteBot) {
      const who = m.mentionedJid?.[0] || (m.fromMe? conn.user.jid: m.sender);
      const uniqid = who.split('@')[0];
      const dirPath = `./${jadi}/${uniqid}`;

      if (!existsSync(dirPath)) {
        await conn.sendMessage(m.chat, {
          text: `🌿 ɴᴏ ʜᴀʏ ꜱᴇꜱɪóɴ ᴀᴄᴛɪᴠᴀ ᴘᴀʀᴀ ᴇʟɪᴍɪɴᴀʀ.\n\nᴜꜱᴀ *${usedPrefix}qr* ᴘᴀʀᴀ ᴄʀᴇᴀʀ ᴜɴᴀ ɴᴜᴇᴠᴀ.`,
}, { quoted: m});
        return;
}

      if (global.conn.user.jid!== conn.user.jid) {
        await conn.sendMessage(m.chat, {
          text: `🍂 ꜱᴏʟᴏ ᴇʟ ʙᴏᴛ ᴘʀɪɴᴄɪᴘᴀʟ ᴘᴜᴇᴅᴇ ᴇᴊᴇᴄᴜᴛᴀʀ ᴇꜱᴛᴇ ᴄᴏᴍᴀɴᴅᴏ.\n\nᴄᴏɴᴛᴀᴄᴛᴏ: wa.me/${global.conn.user.jid.split('@')[0]}`,
}, { quoted: m});
        return;
}

      rmSync(dirPath, { recursive: true, force: true});
      await conn.sendMessage(m.chat, {
        text: `🍃 ꜱᴇꜱɪóɴ ᴇʟɪᴍɪɴᴀᴅᴀ ᴄᴏʀʀᴇᴄᴛᴀᴍᴇɴᴛᴇ.`,
}, { quoted: m});
}

    if (isShowBots) {
      const activeBots = global.conns.filter(c => c.user && c.ws.socket && c.ws.socket.readyState!== ws.CLOSED);

      const list = activeBots.map((bot, i) => {
        const uptime = bot.uptime? formatUptime(Date.now() - bot.uptime): 'Desconocido';
        const number = bot.user.jid.split('@')[0];
        const name = bot.user.name || 'Sin Nombre';
        return `╭─ ꜱᴜʙ-ʙᴏᴛ ${i + 1}
│• ᴜꜱᴜᴀʀɪᴏ: ${name}
│• ɴᴜ́ᴍᴇʀᴏ: wa.me/${number}
│• ᴀᴄᴛɪᴠᴏ: ${uptime}
╰────────────`;
}).join('\n\n');

      const msg = `*🌸 ꜱᴜʙ-ʙᴏᴛꜱ ᴀᴄᴛɪᴠᴏꜱ*\n\n🔌 ᴄᴏɴᴇᴄᴛᴀᴅᴏꜱ: ${activeBots.length}\n\n${activeBots.length? list: '❌ ɴᴏ ʜᴀʏ ꜱᴜʙ-ʙᴏᴛꜱ ᴀᴄᴛɪᴠᴏꜱ.'}`;

      const interactiveButtons = [
        {
          name: "cta_command",
          buttonParamsJson: JSON.stringify({
            display_text: "ꜱᴇʀ ꜱᴜʙ-ʙᴏᴛ",
            command: ".code"
})
}
      ];

      await conn.sendMessage(m.chat, {
        image: { url: "https://kirito.my/media/images/33437668_k.jpg"},
        caption: msg,
        footer: "© 𝑵𝒂𝒈𝒊𝑩𝒐𝒕-𝑰𝑨 | ꜱᴜʙ-ʙᴏᴛ 🌿",
        interactiveButtons,
        mentions: conn.parseMention(msg)
}, { quoted: m});
}
} catch (e) {
    await m.reply('❌ ᴏᴄᴜʀʀɪó ᴜɴ ᴇʀʀᴏʀ ɪɴᴇsᴘᴇʀᴀᴅᴏ.');
    console.error(e);
}
};

handler.tags = ['serbot'];
handler.help = ['deletebot', 'delcode', 'bots'];
handler.command = ['deletebot', 'delcode', 'bots'];
handler.register = true;

export default handler;
