import { igdl} from 'ruhend-scraper'

const handler = async (m, { args, conn}) => {
  const emoji = '📩'
  const errorEmoji = '❌'
  const warning = '⚠️'
  const success = '✅'
  const loading = '⏳'

  if (!args[0]) {
    return conn.reply(
      m.chat,
      '🍃 *_Ingresa un enlace de Instagram._*',
      m,
      global.rcanal
)
}

  try {
    await m.react(loading)

    const res = await igdl(args[0])
    const data = res.data

    for (let media of data) {
      await conn.sendFile(
        m.chat,
        media.url,
        'instagram.mp4',
        `${emoji} _Aquí tienes tu video de Instagram._`,
        m,
        global.rcanal
)
      await m.react(success)
}
} catch (e) {
    console.error(e)
    await m.react(warning)
    return conn.reply(
      m.chat,
      `${errorEmoji} Ocurrió un error al procesar el enlace.`,
      m,
      global.rcanal
)
}
}

handler.command = ['instagram', 'ig']
handler.tags = ['downloader']
handler.help = ['instagram', 'ig']
handler.register = true
handler.coin = 2

export default handler
