
// Código creado por https://github.com/Dioneibi-rip
// Editado por Dev-fedexyz

import fetch from 'node-fetch';
import yts from 'yt-search';

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/;

const handler = async (m, { conn, text, command}) => {
  try {
    if (!text.trim()) {
      return conn.reply(
        m.chat,
        '🌿 Debes escribir *el nombre o link* del video/audio para descargar.',
        m,
        global.rcanal
);
}

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key}});

    const videoIdMatch = text.match(youtubeRegexID);
    const searchQuery = videoIdMatch? `https://youtu.be/${videoIdMatch[1]}`: text;
    let ytResult = await yts(searchQuery);

    if (videoIdMatch) {
      const videoId = videoIdMatch[1];
      ytResult = ytResult.all.find(v => v.videoId === videoId) || ytResult.videos.find(v => v.videoId === videoId);
}

    const video = ytResult.all?.[0] || ytResult.videos?.[0] || ytResult;
    if (!video) {
      await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key}});
      return m.reply('⚠︎ No encontré resultados, intenta con otro nombre o link.');
}

    const { title, thumbnail, timestamp, views, ago, url, author} = video;
    const canal = author?.name || 'Desconocido';
    const vistas = formatViews(views);

    const infoMessage = `
*_🍃 Descarga en camino..._*

📌 Título: *${title}*
📺 Canal: *${canal}*
⏱️ Duración: *${timestamp}*
👁️ Vistas: *${vistas}*
📅 Publicado: *${ago}*
🔗 Link: ${url}
    `.trim();

    const thumb = (await conn.getFile(thumbnail))?.data;
    await conn.reply(m.chat, infoMessage, m, {
      contextInfo: {
        externalAdReply: {
          mediaType: 1,
          thumbnail: thumb,
          renderLargerThumbnail: true,
          mediaUrl: url,
          sourceUrl: url
}
}
});

    if (['play', 'yta', 'ytmp3', 'playaudio'].includes(command)) {
      const audioRes = await fetch(`https://ruby-core.vercel.app/api/download/youtube/mp3?url=${encodeURIComponent(url)}`);
      const audioJson = await audioRes.json();

      if (!audioJson?.status ||!audioJson?.download?.url) {
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key}});
        return conn.reply(m.chat, '🌿 No se pudo descargar el audio. Inténtalo después.', m);
}

      await conn.sendMessage(m.chat, {
        audio: { url: audioJson.download.url},
        fileName: `${audioJson.metadata?.title || 'music'}.mp3`,
        mimetype: 'audio/mpeg',
        ptt: false
}, { quoted: m});

      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key}});
}

    else if (['play2', 'ytmp4'].includes(command)) {
      const videoRes = await fetch(`https://ruby-core.vercel.app/api/download/youtube/mp4?url=${encodeURIComponent(url)}`);
      const videoJson = await videoRes.json();

      if (!videoJson?.status ||!videoJson?.download?.url) {
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key}});
        return conn.reply(m.chat, '🍂 No se pudo descargar el video. Intenta más tarde.', m);
}

      await conn.sendMessage(m.chat, {
        video: { url: videoJson.download.url},
        fileName: `${videoJson.metadata?.title || 'video'}.mp4`,
        caption: title,
        mimetype: 'video/mp4'
}, { quoted: m});

      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key}});
}

    else {
      return conn.reply(m.chat, '✧︎ Comando no válido, revisa el menú.', m);
}

} catch (error) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key}});
    return m.reply(`⚠︎ Error inesperado:\n\n${error}`);
}
};

handler.command = handler.help = ['play', 'ytmp3', 'play2', 'ytmp4', 'playaudio'];
handler.tags = ['descargas'];
handler.register = true

export default handler;

function formatViews(views) {
  if (!views) return 'No disponible';
  if (views>= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B`;
  if (views>= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views>= 1_000) return `${(views / 1_000).toFixed(1)}k`;
  return views.toString();
}
