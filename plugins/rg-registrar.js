import { createHash} from 'crypto';

const GROUP_JID = '120363422479488737@g.us';
const DEFAULT_PFP = 'https://kirito.my/media/images/33437668_k.jpg';

function parseInput(text) {
  const match = text.match(/\|?(.*?)[.|]\s*?(\d{1,4})$/i);
  if (!match) return null;
  const [, name, age] = match;
  return { name: name?.trim(), age: parseInt(age)};
}

async function getProfile(conn, jid) {
  try {
    return await conn.profilePictureUrl(jid, 'image');
} catch {
    return DEFAULT_PFP;
}
}

async function sendPrivateMessage(conn, m, profileUrl, name) {
  const msg = `🍃 *Registro exitoso*\n\n🌿 Bienvenido, ${name}!\n🍂 Usa *#menu* para ver comandos disponibles.`;
  await conn.sendMessage(m.chat, {
    text: msg,
    contextInfo: {
      externalAdReply: {
        title: '🌿 Registro completado',
        body: '🍃 Gracias por registrarte',
        thumbnailUrl: profileUrl,
        mediaType: 1,
        renderLargerThumbnail: true
}
}
}, { quoted: m});
}

async function notifyGroup(conn, m, user) {
  const msg = `🍂 *Nuevo registro en el sistema*\n\n👤 Nombre: ${user.name}\n🎂 Edad: ${user.age}\n🔗 Usuario: ${m.sender}`;
  await conn.sendMessage(GROUP_JID, { text: msg});
}

const handler = async (m, { conn, text, usedPrefix, command}) => {
  const user = global.db.data.users[m.sender];
  const profileUrl = await getProfile(conn, m.sender);

  if (command === 'unreg') {
    if (!user.registered) {
      return m.reply(`🍂 No estás registrado.\n\n🌿 Usa *${usedPrefix}reg nombre.edad* para registrarte.`);
}

    Object.assign(user, {
      name: '',
      age: 0,
      regTime: 0,
      registered: false
});

    return m.reply(`🍃 Registro eliminado correctamente.\n🌿 Puedes volver a registrarte con *${usedPrefix}reg nombre.edad*`);
}

  if (command === 'reg') {
    if (user.registered) {
      return m.reply(`🍂 Ya estás registrado.\n\n🌿 Usa *${usedPrefix}unreg* para eliminar tu registro si deseas cambiarlo.`);
}

    const data = parseInput(text);
    if (!data ||!data.name || isNaN(data.age)) {
      return m.reply(`🍂 Formato incorrecto.\n\n🌿 Usa: *${usedPrefix}reg nombre.edad*\n🍃 Ejemplo: *${usedPrefix}reg Nagi.17*`);
}

    if (data.name.length> 100) return m.reply('🍂 El nombre es demasiado largo.');
    if (data.age < 5 || data.age> 1000) return m.reply('🌿 Edad no válida.');

    Object.assign(user, {
      name: data.name,
      age: data.age,
      regTime: Date.now(),
      registered: true,
      money: (user.money || 0) + 600,
      estrellas: (user.estrellas || 0) + 10,
      exp: (user.exp || 0) + 245,
      joincount: (user.joincount || 0) + 5
});

    await sendPrivateMessage(conn, m, profileUrl, user.name);
    await notifyGroup(conn, m, user);
}
};

handler.help = ['reg', 'unreg'];
handler.tags = ['registro'];
handler.command = ['reg', 'unreg'];
handler.rowner = false;

export default handler;
