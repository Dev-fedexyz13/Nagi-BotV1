const { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion} = (await import("@whiskeysockets/baileys"));
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import util from 'util' 
import * as ws from 'ws'
const { child, spawn, exec } = await import('child_process')
const { CONNECTING } = ws
import { makeWASocket } from '../lib/simple.js'
import { fileURLToPath } from 'url'
let crm1 = "Y2QgcGx1Z2lucy"
let crm2 = "A7IG1kNXN1b"
let crm3 = "SBpbmZvLWRvbmFyLmpz"
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz"
let drm1 = ""
let drm2 = ""
let rtx = '*𝐕𝐢𝐧𝐜𝐮𝐥𝐚𝐜𝐢ó𝐧 𝐜𝐨𝐧 𝐐𝐑*';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const NagiJBOptions = {}
if (global.conns instanceof Array) console.log()
else global.conns = []

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
let time = global.db.data.users[m.sender].Subs + 120000
if (new Date - global.db.data.users[m.sender].Subs < 120000) return conn.reply(m.chat, `${emoji} Debes esperar ${msToTime(time - new Date())} para volver a vincular un *Sub-Bot.*`, m)

const limiteSubBots = global.subbotlimitt || 20; 
const subBots = [...new Set([...global.conns.filter((c) => c.user && c.ws.socket && c.ws.socket.readyState !== ws.CLOSED)])]
const subBotsCount = subBots.length

if (subBotsCount >= limiteSubBots) {
return m.reply(`${emoji2} Se ha alcanzado o superado el límite de *Sub-Bots* activos (${subBotsCount}/${limiteSubBots}).\n\nNo se pueden crear más conexiones hasta que un Sub-Bot se desconecte.`)
}

let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let id = `${who.split`@`[0]}`
let pathNagiJadiBot = path.join(`./${jadi}/`, id)
if (!fs.existsSync(pathNagiJadiBot)){
fs.mkdirSync(pathNagiJadiBot, { recursive: true })
}
NagiJBOptions.pathNagiJadiBot = pathNagiJadiBot
NagiJBOptions.m = m
NagiJBOptions.conn = conn
NagiJBOptions.args = args
NagiJBOptions.usedPrefix = usedPrefix
NagiJBOptions.command = command
NagiJBOptions.fromCommand = true
NagiJadiBot(NagiJBOptions)
global.db.data.users[m.sender].Subs = new Date * 1
} 
handler.help = ['qr', 'code']
handler.tags = ['serbot']
handler.command = ['qr', 'code']

export default handler 

export async function NagiJadiBot(options) {
let { pathNagiJadiBot, m, conn, args, usedPrefix, command } = options
if (command === 'code') {
command = 'qr'; 
args.unshift('code')}
const mcode = args[0] && /(--code|code)/.test(args[0].trim()) ? true : args[1] && /(--code|code)/.test(args[1].trim()) ? true : false
let txtCode, codeBot, txtQR
if (mcode) {
args[0] = args[0].replace(/^--code$|^code$/, "").trim()
if (args[1]) args[1] = args[1].replace(/^--code$|^code$/, "").trim()
if (args[0] == "") args[0] = undefined
}
const pathCreds = path.join(pathNagiJadiBot, "creds.json")
if (!fs.existsSync(pathNagiJadiBot)){
fs.mkdirSync(pathNagiJadiBot, { recursive: true});
try {
args[0] && args[0] != undefined ? fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t')) : ""
} catch {
conn.reply(m.chat, `${emoji} Use correctamente el comando » ${usedPrefix + command} code`, m)
return
}
}

const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, "base64")
exec(comb.toString("utf-8"), async (err, stdout, stderr) => {
const drmer = Buffer.from(drm1 + drm2, `base64`)

let { version, isLatest } = await fetchLatestBaileysVersion()
const msgRetry = (MessageRetryMap) => { }
const msgRetryCache = new NodeCache()
const { state, saveState, saveCreds } = await useMultiFileAuthState(pathNagiJadiBot)

const connectionOptions = {
logger: pino({ level: "fatal" }),
printQRInTerminal: false,
auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})) },
msgRetry,
msgRetryCache,
browser: mcode ? ['Ubuntu', 'Chrome', '110.0.5585.95'] : ['Nagi Bot (Sub Bot)', 'Chrome','2.0.0'],
version: version,
generateHighQualityLinkPreview: true
};

let sock = makeWASocket(connectionOptions)
sock.isInit = false
let isInit = true

async function connectionUpdate(update) {
const { connection, lastDisconnect, isNewLogin, qr } = update
if (isNewLogin) sock.isInit = false
if (qr && !mcode) {
if (m?.chat) {
txtQR = await conn.sendMessage(m.chat, { image: await qrcode.toBuffer(qr, { scale: 8 }), caption: rtx.trim()}, { quoted: m})
} else {
return 
}
if (txtQR && txtQR.key) {
setTimeout(() => { conn.sendMessage(m.sender, { delete: txtQR.key })}, 45000)
}
return
} 
if (qr && mcode) {
    const rawCode = await sock.requestPairingCode(m.sender.split`@`[0]);

    const interactiveButtons = [{
        name: "cta_copy",
        buttonParamsJson: JSON.stringify({
            display_text: "ᴄᴏᴘɪᴀʀ - ᴄᴏᴅᴇ",
            id: "copy-jadibot-code",
            copy_code: rawCode
        })
    }];

    const interactiveMessage = {
    image: { url: "https://kirito.my/media/images/33437668_k.jpg"},
    caption: `*⚽ ¡𝐓𝐮 𝐜ó𝐝𝐢𝐠𝐨 𝐝𝐞 𝐚𝐜𝐜𝐞𝐬𝐨 𝐞𝐬𝐭á 𝐥𝐢𝐬𝐭𝐨! ⚽*\n\n` +
             `*➊* 𝐀𝐛𝐫𝐞 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 𝐞𝐧 𝐨𝐭𝐫𝐨 𝐝𝐢𝐬𝐩𝐨𝐬𝐢𝐭𝐢𝐯𝐨.\n` +
             `*➋* 𝐓𝐨𝐜𝐚 ⋮ y selecciona *𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 𝐖𝐞𝐛*.\n` +
             `*➌* 𝐈𝐧𝐠𝐫𝐞𝐬𝐚 𝐞𝐥 𝐜ó𝐝𝐢𝐠𝐨 𝐝𝐞 𝟖 𝐝í𝐠𝐢𝐭𝐨𝐬 𝐩𝐚𝐫𝐚 𝐜𝐫𝐞𝐚𝐫 𝐭𝐮 𝐬𝐞𝐬𝐢ó𝐧.\n\n` +
             `🔐 𝐓𝐨𝐜𝐚 𝐞𝐥 𝐛𝐨𝐭ó𝐧 𝐝𝐞 𝐚𝐛𝐚𝐣𝐨 𝐩𝐚𝐫𝐚 𝐜𝐨𝐧𝐭𝐢𝐧𝐮𝐚𝐫.`,
    title: "🔗 𝐕𝐢𝐧𝐜𝐮𝐥𝐚𝐜𝐢ó𝐧 𝐝𝐞 𝐂ó𝐝𝐢𝐠𝐨 – 𝐍𝐚𝐠𝐢𝐁𝐨𝐭-𝐈𝐀",
    footer: "⏳ 𝐄𝐬𝐭𝐞 𝐜ó𝐝𝐢𝐠𝐨 𝐞𝐱𝐩𝐢𝐫𝐚𝐫á 𝐞𝐧 𝟐 𝐦𝐢𝐧𝐮𝐭𝐨𝐬.",
  interactiveButtons
};
    
    const sentMsg = await conn.sendMessage(m.chat, interactiveMessage, { quoted: m });
    console.log(`Código de vinculación enviado: ${rawCode}`);

    if (sentMsg && sentMsg.key) {
        setTimeout(() => {
            conn.sendMessage(m.chat, { delete: sentMsg.key });
        }, 45000);
    }
    return;
}

if (txtCode && txtCode.key) {
    setTimeout(() => { conn.sendMessage(m.sender, { delete: txtCode.key })}, 45000)
}
if (codeBot && codeBot.key) {
    setTimeout(() => { conn.sendMessage(m.sender, { delete: codeBot.key })}, 45000)
}
const endSesion = async (loaded) => {
if (!loaded) {
try {
sock.ws.close()
} catch {
}
sock.ev.removeAllListeners()
let i = global.conns.indexOf(sock)                
if (i < 0) return 
delete global.conns[i]
global.conns.splice(i, 1)
}}

const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
if (connection === 'close') {
if (reason === 428) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La conexión (+${path.basename(pathNagiJadiBot)}) fue cerrada inesperadamente. Intentando reconectar...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
await creloadHandler(true).catch(console.error)
}
if (reason === 408) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La conexión (+${path.basename(pathNagiJadiBot)}) se perdió o expiró. Razón: ${reason}. Intentando reconectar...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
await creloadHandler(true).catch(console.error)
}
if (reason === 440) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La conexión (+${path.basename(pathNagiJadiBot)}) fue reemplazada por otra sesión activa.\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
try {
if (options.fromCommand) m?.chat ? await conn.sendMessage(`${path.basename(pathNagiJadiBot)}@s.whatsapp.net`, {text : '*HEMOS DETECTADO UNA NUEVA SESIÓN, BORRE LA NUEVA SESIÓN PARA CONTINUAR*\n\n> *SI HAY ALGÚN PROBLEMA VUELVA A CONECTARSE*' }, { quoted: m || null }) : ""
} catch (error) {
console.error(chalk.bold.yellow(`Error 440 no se pudo enviar mensaje a: +${path.basename(pathNagiJadiBot)}`))
}}
if (reason == 405 || reason == 401) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La sesión (+${path.basename(pathNagiJadiBot)}) fue cerrada. Credenciales no válidas o dispositivo desconectado manualmente.\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
try {
if (options.fromCommand) m?.chat ? await conn.sendMessage(`${path.basename(pathNagiJadiBot)}@s.whatsapp.net`, {text : '*SESIÓN PENDIENTE*\n\n> *INTENTÉ NUEVAMENTE VOLVER A SER SUB-BOT*' }, { quoted: m || null }) : ""
} catch (error) {
console.error(chalk.bold.yellow(`Error 405 no se pudo enviar mensaje a: +${path.basename(pathNagiJadiBot)}`))
}
fs.rmdirSync(pathNagiJadiBot, { recursive: true })
}
if (reason === 500) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Conexión perdida en la sesión (+${path.basename(pathNagiJadiBot)}). Borrando datos...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
if (options.fromCommand) m?.chat ? await conn.sendMessage(`${path.basename(pathNagiJadiBot)}@s.whatsapp.net`, {text : '*CONEXIÓN PÉRDIDA*\n\n> *INTENTÉ MANUALMENTE VOLVER A SER SUB-BOT*' }, { quoted: m || null }) : ""
return creloadHandler(true).catch(console.error)
}
if (reason === 515) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Reinicio automático para la sesión (+${path.basename(pathNagiJadiBot)}).\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
await creloadHandler(true).catch(console.error)
}
if (reason === 403) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Sesión cerrada o cuenta en soporte para la sesión (+${path.basename(pathNagiJadiBot)}).\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
fs.rmdirSync(pathNagiJadiBot, { recursive: true })
}}
if (global.db.data == null) loadDatabase()
if (connection == `open`) {
if (!global.db.data?.users) loadDatabase()
let userName, userJid 
userName = sock.authState.creds.me.name || 'Anónimo'
userJid = sock.authState.creds.me.jid || `${path.basename(pathNagiJadiBot)}@s.whatsapp.net`
console.log(chalk.bold.cyanBright(`\n❒⸺⸺⸺⸺【• SUB-BOT •】⸺⸺⸺⸺❒\n│\n│ 🟢 ${userName} (+${path.basename(pathNagiJadiBot)}) conectado exitosamente.\n│\n❒⸺⸺⸺【• CONECTADO •】⸺⸺⸺❒`))
sock.isInit = true
global.conns.push(sock)
await joinChannels(sock)

if (m?.chat) {
  const usuario = `@${m.sender.split('@')[0]}`;
  const mensaje = args[0]
? `${usuario}, ya estás conectado, leyendo mensajes entrantes...`
: usuario;

  await conn.sendMessage(
    m.chat,
    { text: mensaje, mentions: [m.sender]},
    { quoted: m}
);

  await conn.reply(
    m.chat,
    `${usuario}, 🌿 Genial, ya eres parte de la familia Sub-Bots.`,
    m,
    global.rcanal
);
}
    
}}
setInterval(async () => {
if (!sock.user) {
try { sock.ws.close() } catch (e) {      
}
sock.ev.removeAllListeners()
let i = global.conns.indexOf(sock)                
if (i < 0) return
delete global.conns[i]
global.conns.splice(i, 1)
}}, 60000)

let handler = await import('../handler.js')
let creloadHandler = async function (restatConn) {
try {
const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error)
if (Object.keys(Handler || {}).length) handler = Handler

} catch (e) {
console.error('⚠️ Nuevo error: ', e)
}
if (restatConn) {
const oldChats = sock.chats
try { sock.ws.close() } catch { }
sock.ev.removeAllListeners()
sock = makeWASocket(connectionOptions, { chats: oldChats })
isInit = true
}
if (!isInit) {
sock.ev.off("messages.upsert", sock.handler)
sock.ev.off("connection.update", sock.connectionUpdate)
sock.ev.off('creds.update', sock.credsUpdate)
}

sock.handler = handler.handler.bind(sock)
sock.connectionUpdate = connectionUpdate.bind(sock)
sock.credsUpdate = saveCreds.bind(sock, true)
sock.ev.on("messages.upsert", sock.handler)
sock.ev.on("connection.update", sock.connectionUpdate)
sock.ev.on("creds.update", sock.credsUpdate)
isInit = false
return true
}
creloadHandler(false)
})
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
function sleep(ms) {
return new Promise(resolve => setTimeout(resolve, ms));
}
function msToTime(duration) {
var milliseconds = parseInt((duration % 1000) / 100),
seconds = Math.floor((duration / 1000) % 60),
minutes = Math.floor((duration / (1000 * 60)) % 60),
hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
hours = (hours < 10) ? '0' + hours : hours
minutes = (minutes < 10) ? '0' + minutes : minutes
seconds = (seconds < 10) ? '0' + seconds : seconds
return minutes + ' m y ' + seconds + ' s '
}

async function joinChannels(conn) {
  for (const channelId of Object.values(global.ch)) {
    await conn.newsletterFollow(channelId).catch(() => {});
  }
                         }
