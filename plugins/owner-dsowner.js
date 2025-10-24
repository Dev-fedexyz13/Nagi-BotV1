import { readdirSync, unlinkSync, existsSync, promises as fs, rmSync} from 'fs';
import path from 'path';

const handler = async (m, { conn, usedPrefix}) => {
  if (global.conn.user.jid!== conn.user.jid) {
    return conn.reply(
      m.chat,
      `🍃 Este comando solo puede ejecutarse desde el número principal del bot.`,
      m
);
}

  await conn.reply(
    m.chat,
    `🌿 Iniciando el proceso de limpieza...\nSe eliminarán todos los archivos de sesión excepto *creds.json*.`,
    m
);
  m.react(rwait);

  const sessionPath = `./${NagiSessions}/`;

  try {
    if (!existsSync(sessionPath)) {
      return conn.reply(m.chat, `🍂 La carpeta de sesiones está vacía.`, m);
}

    const files = await fs.readdir(sessionPath);
    let filesDeleted = 0;

    for (const file of files) {
      if (file!== 'creds.json') {
        await fs.unlink(path.join(sessionPath, file));
        filesDeleted++;
}
}

    if (filesDeleted === 0) {
      await conn.reply(m.chat, `No se encontraron archivos para eliminar.`, m);
} else {
      m.react(done);
      await conn.reply(
        m.chat,
        `Se eliminaron ${filesDeleted} archivos de sesión. El archivo *creds.json* permanece intacto.`,
        m
);
      await conn.reply(m.chat, `Hola, ¿logras verme?`, m);
}
} catch (err) {
    console.error('Error al eliminar archivos de sesión:', err);
    await conn.reply(m.chat, `Ocurrió un error inesperado.`, m);
}
};

handler.help = ['dsowner'];
handler.tags = ['owner'];
handler.command = ['delai', 'dsowner'];
handler.rowner = true;

export default handler;
