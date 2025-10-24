import { default as WAMessageStubType} from '@whiskeysockets/baileys';
import fetch from 'node-fetch';

const handler = m => m;

handler.before = async function (m, { conn, participants}) => {
  if (!m.messageStubType ||!m.isGroup) return;

  const chat = global.db.data.chats[m.chat];
  if (!chat.detect) return;

  const stubType = m.messageStubType;
  const stubParam = m.messageStubParameters?.[0];
  const actor = m.sender;
  const actorTag = `@${actor.split('@')[0]}`;
  const target = stubParam? `@${stubParam.split('@')[0]}`: '';
  const groupAdmins = participants.filter(p => p.admin).map(p => p.id);
  const mentioned = [actor, stubParam,...groupAdmins].filter(Boolean);

  const thumbnail = await conn.profilePictureUrl(m.chat, 'image').catch(() => null) || 'https://files.catbox.moe/xr2m6u.jpg';

  const messageTemplates = {
    21: `${actorTag} ha cambiado el nombre del grupo.\n📝 Nuevo nombre: *${stubParam}*`,
    22: {
      image: { url: thumbnail},
      caption: `${actorTag} ha cambiado la foto del grupo.`
},
    23: `${actorTag} ha restablecido el enlace del grupo.\n🔗 Nuevo enlace disponible.`,
    25: `${actorTag} ha cambiado los permisos de edición del grupo.\n🔧 Ahora ${stubParam === 'on'? 'solo los admins': 'todos los miembros'} pueden modificar la info.`,
    26: `${actorTag} ha ${stubParam === 'on'? 'cerrado 🔒': 'abierto 🔓'} el grupo.\n💬 ${stubParam === 'on'? 'Solo admins pueden enviar mensajes': 'Todos pueden enviar mensajes'}`,
    29: `🎖️ ${target} ha sido promovido a admin.\nAcción realizada por ${actorTag}.`,
    30: `⚠️ ${target} ha sido removido como admin.\nAcción realizada por ${actorTag}.`
};

  const content = messageTemplates[stubType];
  if (!content) return;

  const contextInfo = {
    mentionedJid: mentioned,
    externalAdReply: {
      title: '📢 Notificación de Grupo',
      body: 'Cambios detectados automáticamente',
      thumbnail: await (await fetch(thumbnail)).buffer(),
      sourceUrl: 'https://whatsapp.com',
      mediaType: 1,
      renderLargerThumbnail: false,
      previewType: 'PHOTO'
}
};

  const message = typeof content === 'string'
? { text: content, contextInfo}
: {...content, contextInfo};

  await conn.sendMessage(m.chat, message, { quoted: null});
};

export default handler;
