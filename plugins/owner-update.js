import { execSync} from 'child_process';

const newsletterJid = '120363405641626756@newsletter';
const newsletterName = '『 ⏤͟͟͞͞☆ 𝑵𝒂𝒈𝒊𝑩𝒐𝒕-𝑰𝑨 | 𝑪𝒉𝒂𝒏𝒏𝒆𝒍 𝑶𝒇𝒇𝒊𝒄𝒊𝒂𝒍 ❀ 』';
const packname = '© 🄽🄰🄶🄸🄱🄾🅃‐🄼🄳';
const redes = 'https://dev-fedexz.vercel.app';

const iconos = [
  'https://kirito.my/media/images/33437668_k.jpg',
  'https://kirito.my/media/images/95668416_k.jpg',
  'https://kirito.my/media/images/31336923_k.jpg',
];

const getRandomIcono = () => iconos[Math.floor(Math.random() * iconos.length)];

let handler = async (m, { conn, args}) => {
  try {
    await conn.reply(m.chat, '🌿 *Actualizando el bot, por favor espera...*', m);

    const output = execSync('git pull' + (args.length? ' ' + args.join(' '): '')).toString();
    const msg = output.includes('Already up to date')
? '🍃 *El bot ya está actualizado.*'
: `🍂 *Actualización completada:*\n\n\`\`\`${output}\`\`\``;

    if (msg) {
      const contextInfo = {
        mentionedJid: [m.sender],
        isForwarded: true,
        forwardingScore: 999,
        forwardedNewsletterMessageInfo: {
          newsletterJid,
          newsletterName,
          serverMessageId: -1,
},
        externalAdReply: {
          title: packname,
          body: `🌿 Hola, ${m.pushName || 'usuario'}!`,
          thumbnailUrl: getRandomIcono(),
          sourceUrl: redes,
          mediaType: 1,
          renderLargerThumbnail: false,
},
};

      await conn.sendMessage(m.chat, { text: msg, contextInfo}, { quoted: m});
}
} catch (error) {
    try {
      const status = execSync('git status --porcelain').toString().trim();
      if (status) {
        const conflictedFiles = status
.split('\n')
.filter(line =>!line.includes('NagiSessions/') &&!line.includes('tmp/'));

        if (conflictedFiles.length> 0) {
          const conflictMsg =
            `⚠️ *Conflictos detectados en los siguientes archivos:*\n\n` +
            conflictedFiles.map(f => '• ' + f.slice(3)).join('\n') +
            `\n\n🔧 *Solución recomendada:* reinstala el bot o resuelve los conflictos manualmente.`;

          return await conn.reply(m.chat, conflictMsg, m);
}
}
} catch (statusError) {
      console.error('Error al verificar estado de Git:', statusError);
}

    await conn.reply(m.chat, `❌ *Error al actualizar:* ${error.message || 'Error desconocido.'}`, m);
}
};

handler.help = ['update'];
handler.command = ['update', 'actualizar'];
handler.tags = ['owner'];
handler.rowner = true;

export default handler;
