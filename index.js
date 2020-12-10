const Konverter = require('./modules/konverter');
const { program } = require('commander');

module.exports = async function init() {
  program.version('0.1.0', '-v, --version', 'current version');

  program
    .option('-i, --input <path>', 'inputs dir')
    .option('-o, --output <path>', 'output dir')
    .option('-f, --format <type>', 'source format [jpg|png|webp|heic|heif]', 'webp')
    .option('-t, --target <type>', 'target format [jpg|png|webp]', 'jpg');

  program.parse(process.argv);

  if (!program.input) console.log(`- Input directory required`);
  if (!program.output) console.log(`- Output directory required`);

  if (program.input && program.output && program.format && program.target) {
    const path = require('path');

    const options = {
      input: path.resolve(program.input),
      output: path.resolve(program.output),
      format: program.format,
      target: program.target,
    };

    await Konverter.init(options);
  } else {
    process.exit(0);
  }
};
