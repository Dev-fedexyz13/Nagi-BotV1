let handler = async (m, { conn, args, command}) => {
  if (!global.owner.includes(m.sender)) {
    return conn.reply(m.chat, '❌ Solo el *owner* puede usar este comando.', m)
}

  if (command === 'delprefix') {
    global.opts['noprefix'] = true
    global.opts['prefix'] = ''
    await m.react('✅')
    return conn.reply(m.chat, '🌿 *Prefijo eliminado.* Ahora puedes usar comandos sin prefijo.', m)
}

  if (command === 'setprefix') {
    const nuevoPrefijo = args[0]
    if (!nuevoPrefijo) {
      return conn.reply(m.chat, '🍃 Usa el comando así:\n*setprefix <nuevo_prefijo>*', m)
}

    global.opts['prefix'] = nuevoPrefijo
    global.opts['noprefix'] = false
    await m.react('✅')
    return conn.reply(m.chat, `🌿 *Prefijo actualizado a:* \`${nuevoPrefijo}\``, m)
}
}

handler.help = ['setprefix <prefijo>', 'delprefix']
handler.tags = ['owner']
handler.command = ['setprefix', 'delprefix']
handler.rowner = true

export default handler
