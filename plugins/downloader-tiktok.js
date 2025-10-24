import fg from 'api-dylux';

const handler = async (m, { conn, text, args}) => {
  try {
    const url = args[0];

    if (!url) {
      return conn.sendMessage(m.chat, {
        text: `🍃 Debes ingresar un enlace de tuktok.`
}, { quoted: m});
}

    const tiktokRegex = /^(https?:\/\/)?(www\.|vm\.|vt\.|t\.)?tiktok\.com\/[^\s]+$/i;
    if (!tiktokRegex.test(url)) {
      return conn.sendMessage(m.chat, {
        text: `🍃 El enlace de tiktok no es válido.` 
}, { quoted: m});
}

    if (typeof m.react === 'function') m.react('⌛');

    const { result} = await fg.tiktok(url);
    const { title, play, duration, author} = result;
    const { nickname} = author;

    const caption = `
> 🍃 *_Nagi - Downloader_*

👤 *Autor:* ${nickname}
🍃 *Título:* ${title}
⏱️ *Duración:* ${duration}
`.trim();

    await conn.sendMessage(m.chat, {
      video: { url: play},
      caption
}, { quoted: m});

    if (typeof m.react === 'function') m.react('✅');
} catch (error) {
    console.error(error);
    return conn.sendMessage(m.chat, {
      text: `❌ *Ocurrió un error:* ${error.message}`
}, { quoted: m});
}
};

handler.help = ["tiktok"];
handler.tags = ["downloader"];
handler.command = ["tt", "tiktok"];

export default handler;
