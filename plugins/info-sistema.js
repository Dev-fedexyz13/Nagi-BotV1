import os from 'os';
import { execSync} from 'child_process';

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0? 0: decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const getDiskSpace = () => {
  try {
    const stdout = execSync('df -h | grep -E "^/dev/root|^/dev/sda1"').toString();
    const [, size, used, available, usePercent] = stdout.split(/\s+/);
    return { size, used, available, usePercent};
} catch (error) {
    console.error('⚠️ Error al obtener el espacio en disco:', error);
    return null;
}
};

const formatUptime = (ms) => {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${h}h ${m}m ${s}s`;
};

const handler = async (m, { conn}) => {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const uptime = formatUptime(process.uptime() * 1000);
  const hostname = os.hostname();
  const platform = os.platform();
  const arch = os.arch();
  const nodeUsage = process.memoryUsage();
  const disk = getDiskSpace();

  const message = `
🌌 𝗘𝗦𝗧𝗔𝗗𝗢 𝗗𝗘𝗟 𝗦𝗜𝗦𝗧𝗘𝗠𝗔 🌌

🖥️ *Host:* ${hostname}
🧭 *Plataforma:* ${platform}
🧬 *Arquitectura:* ${arch}
⏱️ *Tiempo activo:* ${uptime}

💾 *Memoria RAM*
• Total: ${formatBytes(totalMem)}
• Libre: ${formatBytes(freeMem)}
• Usada: ${formatBytes(usedMem)}

🧠 *Uso de Node.js*
• RSS: ${formatBytes(nodeUsage.rss)}
• Heap Total: ${formatBytes(nodeUsage.heapTotal)}
• Heap Usado: ${formatBytes(nodeUsage.heapUsed)}
• Externa: ${formatBytes(nodeUsage.external)}
• Buffers: ${formatBytes(nodeUsage.arrayBuffers)}

${disk? `
📁 *Espacio en Disco*
• Tamaño total: ${disk.size}
• Usado: ${disk.used}
• Disponible: ${disk.available}
• Uso: ${disk.usePercent}
`: '⚠️ Sin información del disco.'}

> 🍃 *Todo funcionando con precisión.* 
`.trim();

  await conn.reply(m.chat, message, m);
};

handler.help = ['sistema'];
handler.tags = ['info'];
handler.command = ['system', 'sistema'];
handler.register = true;

export default handler;
