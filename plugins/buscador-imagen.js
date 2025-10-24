import { googleImage} from '@bochilteam/scraper'

const handler = async (m, { conn, text, usedPrefix, command}) => {
  if (!text) {
    return conn.reply(
      m.chat,
      '🌿 Por favor, ingresa *el nombre o término* que deseas buscar.',
      m,
      global.rcanal
)
}

  await m.react(rwait)
  conn.reply(
    m.chat,
    '🌿 Descargando su imagen, espere por favor...',
    m,
    global.rcanal
)

  const res = await googleImage(text)

  const messages = []
  for (let i = 1; i <= 4; i++) {
    const img = await res.getRandom()
    messages.push([`Imagen ${i}`, '', img, [[]], [[]], [[]], [[]]])
}

  await conn.sendCarousel(
    m.chat,
    `🖼️ Resultados de: *${text}*`,
    '🍂 Nagi - Buscador 🍃',
    null,
    messages,
    m
)
}

handler.help = ['imagen']
handler.tags = ['buscador']
handler.command = ['img', 'imagen']
handler.register = true

export default handler
