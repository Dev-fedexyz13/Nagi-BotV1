import ws from 'ws';

const handler = async (m, { conn, usedPrefix, isRowner}) => {
  const uptimeMs = process.uptime() * 1000;
  const uptime = formatUptime(uptimeMs);

  const totalUsersRegistered = Object.keys(global.db.data.users).length;
  const totalChatsStored = Object.keys(global.db.data.chats).length;

  const activeSubBots = global.conns.filter(c => c.user && c.ws?.socket?.readyState!== ws.CLOSED);
  const totalSubBots = activeSubBots.length;

  const allChats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats);
  const groupChats = allChats.filter(([id]) => id.endsWith('@g.us'));
  const privateChats = allChats.length - groupChats.length;

  const pingStart = performance.now();
  const pingEnd = performance.now();
  const ping = ((pingEnd - pingStart) * 1000).toFixed(0) / 1000;

  const infoMessage = `
> *_🍃 𝑬𝒔𝒕𝒂𝒅𝒐 𝒅𝒆𝒍 𝑩𝒐𝒕 🍃_*

👑 Creador: ${etiqueta}
✨ Prefijo actual: ${usedPrefix}
🛠️ Versión: ${vs}

💌 Chats privados: ${privateChats}
👥 Grupos activos: ${groupChats.length}
📊 Total de chats: ${allChats.length}
🌍 Usuarios registrados: ${totalUsersRegistered}

⏳ Tiempo activo: ${uptime}
⚡ Ping: ${ping}s
🤖 Sub-bots activos: ${totalSubBots || '0'}

> *🍃 Estado del bot*
`.trim();

  await conn.sendFile(m.chat, banner, 'estado.jpg', infoMessage, m);
};

handler.help = ['estado'];
handler.tags = ['info'];
handler.command = ['estado', 'status'];
handler.register = true;

export default handler;

function formatUptime(ms) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  return `${hours}h ${minutes}m ${seconds}s`;
}
