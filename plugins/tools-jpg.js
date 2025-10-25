import fetch from 'node-fetch';
import FormData from 'form-data';

let handler = async (m, { conn}) => {
  const mime = m?.quoted?.mimetype || m?.mimetype;
  const isJPG = mime && mime.includes('jpeg');

  if (!isJPG) {
    return conn.reply(m.chat, '📷 Responde a una imagen JPG para enviarla a la API.', m);
}

  try {
    const buffer = await conn.downloadMediaMessage(m.quoted || m);
    const form = new FormData();
    form.append('file', buffer, 'imagen.jpg');

    const res = await fetch('https://dev-fedeexyz.vercel.app/api/tools-jpg', {
      method: 'POST',
      body: form,
});

    const json = await res.json();
    const resultado = `✅ Imagen procesada:\n${JSON.stringify(json, null, 2)}`;
    conn.reply(m.chat, resultado, m);
} catch (error) {
    console.error('[ERROR JPG API]', error);
    conn.reply(m.chat, '❌ Error al enviar la imagen JPG.', m);
}
};

handler.command = ['fedejpg'];
handler.help = ['fedejpg'];
handler.tags = ['tools'];

export default handler;
