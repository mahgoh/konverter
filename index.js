const Konverter = require('./modules/konverter');
const { program } = require('commander');

module.exports = async function init() {
  program.version('0.1.0', '-v, --version', 'current version');

  program
    .option('-i, --input <path>', 'input folder')
    .option('-t, --target <path>', 'target folder')
    .option('-f, --format <type>', 'target format [jpg|png|webp]', 'jpg');

  program.parse(process.argv);

  if (!program.input) console.log(`- Input folder required`);
  if (!program.target) console.log(`- Target folder required`);

  if (program.input && program.target && program.format) {
    const path = require('path');

    const options = {
      input: path.resolve(__dirname, program.input),
      target: path.resolve(__dirname, program.target),
      format: program.format,
    };

    await Konverter.init(options);
  } else {
    process.exit(0);
  }
};
