// Código creado por https://github.com/Dioneibi-rip

import axios from 'axios'

const handler = async (m, { conn, text, usedPrefix}) => {
  if (!text) {
    return conn.reply(
      m.chat,
      '🌿 Por favor, ingresa *el nombre o término* que deseas buscar.',
      m,
      global.rcanal
)
}

  try {
    await m.react('🕒')

    const res = await axios.get(`https://ruby-core.vercel.app/api/search/pinterest?q=${encodeURIComponent(text)}`)
    const data = res.data

    if (!data.status ||!data.results || data.results.length === 0) {
      return conn.reply(
        m.chat,
        `⚠️ No se encontraron resultados de «${text}».`,
        m,
        global.rcanal
)
}

    const medias = data.results.slice(0, 10).map(img => ({
      type: 'image',
      data: { url: img.image_large_url, title: img.title}
}))

    for (let i = 0; i < medias.length; i++) {
      await conn.sendMessage(m.chat, {
        image: { url: medias[i].data.url},
        caption: i === 0
? `🔍 Búsqueda en Pinterest\n\n📌 Título: *${text}*\n📚 Resultados: ${medias.length} imágenes encontradas`
: `📷 ${medias[i].data.title || 'Sin título'}`
}, { quoted: m})
}

    await m.react('✅')
} catch (e) {
    await m.react('❌')
    conn.reply(
      m.chat,
      `⚠️ Se ha producido un error.\nUsa *${usedPrefix}report* para informarlo.\n\n${e}`,
      m,
      global.rcanal
)
}
}

handler.help = ['pinterest <texto>']
handler.command = ['pinterest', 'pin']
handler.tags = ['buscador']
handler.register= true
handler.group = true

export default handler
