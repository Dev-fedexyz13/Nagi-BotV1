
import { execSync} from 'child_process';
import fetch from "node-fetch";
import crypto from "crypto";
import { FormData, Blob} from "formdata-node";
import { fileTypeFromBuffer} from "file-type";

const newsletterJid = '120363405641626756@newsletter';
const newsletterName = '『 ⏤͟͟͞͞☆ 𝑵𝒂𝒈𝒊𝑩𝒐𝒕-𝑰𝑨 | 𝑪𝒉𝒂𝒏𝒏𝒆𝒍 𝑶𝒇𝒇𝒊𝒄𝒊𝒂𝒍 ❀ 』';
const packname = '© 🄽🄰🄶🄸🄱🄾🅃‐🄼🄳';
const redes = 'https://dev-fedexz.vercel.app';

const iconos = [
  'https://files.catbox.moe/npum4p.jpg',
  'https://files.catbox.moe/npum4p.jpg',
  'https://files.catbox.moe/18qri6.jpg',
];

function getRandomIcono() {
  return iconos[Math.floor(Math.random() * iconos.length)];
}

const handler = async (m, { conn}) => {
  let q = m.quoted? m.quoted: m;
  let mime = (q.msg || q).mimetype || "";
  if (!mime) return m.reply("🌿 *_Es necesario que envíes una imagen, vídeo, audio o gif.!_*", null, { quoted: fkontak});
  let media = await q.download();
  let link = await catbox(media);
  let caption = `🍃 *N A G I - C A T  B O X:*
\`\`\`• ${link}\`\`\`
📚 *_Tamaño:_* ${formatBytes(media.length)}
📅 *_Validez:_* *"Sin fecha de caducidad"*
`;

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
}
};

  await m.reply(caption, null, { contextInfo});
};

handler.command = handler.help = ['catbox'];
handler.tags = ['tools'];
handler.register = true

export default handler;

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
}

async function catbox(content) {
  const { ext, mime} = (await fileTypeFromBuffer(content)) || {};
  const blob = new Blob([content.toArrayBuffer()], { type: mime});
  const formData = new FormData();
  const randomBytes = crypto.randomBytes(5).toString("hex");
  formData.append("reqtype", "fileupload");
  formData.append("fileToUpload", blob, randomBytes + "." + ext);

  const response = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: formData,
    headers: {
      "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36",
},
});

  return await response.text();
}
