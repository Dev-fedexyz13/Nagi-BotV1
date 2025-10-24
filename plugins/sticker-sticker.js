import { sticker} from '../lib/sticker.js'

const handler = async (m, { conn, args}) => {
  let stiker = false
  const userId = m.sender
  const userData = global.db.data.users[userId] || {}

  const texto1 = userData.text1 || global.packsticker
  const texto2 = userData.text2 || global.packsticker2

  try {
    const q = m.quoted || m
    const mime = (q.msg || q).mimetype || q.mediaType || ''
    const txt = args.join(' ')
    const marca = txt? txt.split(/[\u2022|]/).map(part => part.trim()): [texto1, texto2]

    if (/webp|image|video/.test(mime) && q.download) {
      if (/video/.test(mime) && (q.msg || q).seconds> 15) {
        return conn.reply(
          m.chat,
          '🍃 *_El video no puede durar más de 15 segundos para crear un sticker._*',
          m,
          global.rcanal
)
}

      const buffer = await q.download()
      await m.react('🌿')
      stiker = await sticker(buffer, false, marca[0], marca[1])

} else if (args[0] && isUrl(args[0])) {
      stiker = await sticker(false, args[0], texto1, texto2)

} else {
      return conn.reply(
        m.chat,
        '🌿 Por favor, envía una *imagen* o *video* para crear su sticker.',
        m,
        global.rcanal
)
}

} catch (e) {
    await conn.reply(
      m.chat,
      `🍃 Ocurrió un error:\n*${e.message}*`,
      m,
      global.rcanal
)
    await m.react('🍂')
} finally {
    if (stiker) {
      await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
      await m.react('🍃')
}
}
}

handler.help = ['sticker']
handler.tags = ['sticker']
handler.command = ['s', 'sticker']

export default handler

const isUrl = (text) => {
  return /^https?:\/\/.+\.(jpe?g|gif|png|webp)$/i.test(text)
}
