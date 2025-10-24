import syntaxerror from 'syntax-error';
import { format} from 'util';
import { fileURLToPath} from 'url';
import { dirname} from 'path';
import { createRequire} from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(__dirname);

const handler = async (m, context) => {
  const { conn, usedPrefix, noPrefix, args, groupMetadata, isROwner} = context;
  if (!isROwner) return;

  const originalExp = m.exp;
  const inputCode = (/^=/.test(usedPrefix)? 'return ': '') + noPrefix;
  let output;
  let syntaxMessage = '';

  try {
    let printLimit = 15;
    const moduleWrapper = { exports: {}};

    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    const execFunction = new AsyncFunction(
      'print', 'm', 'handler', 'require', 'conn', 'Array', 'process', 'args',
      'groupMetadata', 'module', 'exports', 'argument',
      inputCode
);

    output = await execFunction.call(conn, (...args) => {
      if (--printLimit < 1) return;
      console.log(...args);
      return conn.reply(m.chat, format(...args), m, rcanal);
}, m, handler, require, conn, CustomArray, process, args, groupMetadata, moduleWrapper, moduleWrapper.exports, [conn, context]);

} catch (err) {
    const syntaxErr = syntaxerror(inputCode, 'Evaluación de código', {
      allowReturnOutsideFunction: true,
      allowAwaitOutsideFunction: true,
      sourceType: 'module'
});
    if (syntaxErr) syntaxMessage = '```' + syntaxErr + '```\n\n';
    output = err;
} finally {
    conn.reply(m.chat, syntaxMessage + format(output), m, rcanal);
    m.exp = originalExp;
}
};

handler.help = ['> ', '=> '];
handler.tags = ['owner'];
handler.customPrefix = /^=?> /;
handler.command = /(?:)/i;

export default handler;

class CustomArray extends Array {
  constructor(...args) {
    if (typeof args[0] === 'number') {
      super(Math.min(args[0], 10000));
} else {
      super(...args);
}
}
}
