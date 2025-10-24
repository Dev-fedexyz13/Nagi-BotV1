import { igdl} from 'ruhend-scraper';

const handler = async (m, { text, conn, args}) => {
  const emoji = {
    wait: '🕒',
    success: '✅',
    error: '⚠️',
    fb: '📹'
};

  const url = args[0];
  if (!url) {
    return conn.reply(m.chat, '🍃 Por favor, ingresa un enlace válido de Facebook.', m);
}

  try {
    await m.react(emoji.wait);
    conn.reply(m.chat, `${emoji.fb} Descargando video de Facebook...`, m);

    const response = await igdl(url);
    const videos = response?.data;

    if (!videos || videos.length === 0) {
      await m.react(emoji.error);
      return conn.reply(m.chat, '🍂 No se encontraron videos disponibles para ese enlace.', m);
}

    const selectedVideo = videos.find(v => v.resolution === '720p (HD)') || videos.find(v => v.resolution === '360p (SD)');
    if (!selectedVideo) {
      await m.react(emoji.error);
      return conn.reply(m.chat, '🍂 No se encontró una resolución compatible para enviar.', m);
}

    await conn.sendMessage(
      m.chat,
      {
        video: { url: selectedVideo.url},
        caption: `${emoji.fb} *Video de Facebook*`,
        fileName: 'facebook_video.mp4',
        mimetype: 'video/mp4'
},
      { quoted: m}
);

    await m.react(emoji.success);
} catch (err) {
    console.error('Error al procesar el video de Facebook:', err);
    await m.react(emoji.error);
    conn.reply(m.chat, `🍂 Ocurrió un error al intentar descargar el video.\nVerifica el enlace o intenta más tarde.`, m);
}
};

handler.help = ['facebook', 'fb'];
handler.tags = ['downloader'];
handler.command = ['facebook', 'fb'];
handler.register = true;

export default handler;
