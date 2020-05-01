const fs = require('fs').promises;
const path = require('path');

const sharp = require('sharp');
const heicConvert = require('heic-convert');

module.exports = class Konverter {
  static async init(options) {
    let defaults = {
      filter: ['.DS_Store'],
      input: './input',
      output: './output',
      format: 'webp',
      target: 'jpg',
    };

    const settings = { ...defaults, ...options };

    let inputFiles = await Konverter.getFilesOfDir(settings.input);
    let filteredInputFiles = await Konverter.filterFiles(inputFiles, settings.filter);

    // Make output directory if not existant
    await Konverter.mkDirIfNotExists(settings.output);

    // Convert all images and save to output directory
    await Konverter.convert(settings, filteredInputFiles);

    console.log(`${filteredInputFiles.length} file(s) converted.`);
  }

  static async getFilesOfDir(dir) {
    let files = [];

    try {
      files = await fs.readdir(dir);
    } catch (err) {
      console.log(err);
    }

    return files;
  }

  static async mkDirIfNotExists(dir) {
    await fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) throw err;
    });
  }

  static async convert(settings, filteredInputFiles) {
    await Konverter.asyncForEach(filteredInputFiles, async (file) => {
      const sourcePath = path.resolve(settings.input, file);

      let splitted = file.split('.');
      splitted[splitted.length - 1] = settings.target;
      const filename = splitted.join('.');

      const outputPath = path.resolve(settings.output, filename);

      let inputBuffer, outputBuffer;

      switch (settings.format) {
        case 'heic':
        case 'heif':
          switch (settings.target) {
            case 'jpg':
              inputBuffer = await fs.readFile(sourcePath);

              outputBuffer = await heicConvert({
                buffer: inputBuffer, // the HEIC file buffer
                format: 'JPEG', // output format
                quality: 1, // the jpeg compression quality, between 0 and 1
              });

              break;
            case 'png':
              inputBuffer = await fs.readFile(sourcePath);

              outputBuffer = await heicConvert({
                buffer: inputBuffer, // the HEIC file buffer
                format: 'PNG', // output format
              });
              break;
          }
          break;
        default:
          switch (settings.target) {
            case 'jpg':
              try {
                outputBuffer = await sharp(sourcePath).jpeg().toBuffer();
              } catch (err) {
                console.log(err);
              }
              break;
            case 'png':
              try {
                outputBuffer = await sharp(sourcePath).png().toBuffer();
              } catch (err) {
                console.log(err);
              }
              break;
            case 'webp':
              try {
                outputBuffer = await sharp(sourcePath).webp().toBuffer();
              } catch (err) {
                console.log(err);
              }
              break;
            default:
              console.log('Target file format not supported.');
              break;
          }

          break;
      }

      await fs.writeFile(outputPath, outputBuffer);

      console.log(`${filename}`);
    });
  }

  static async filterFiles(files, filter) {
    let filtered = [];

    await Konverter.asyncForEach(files, (file) => {
      if (!filter.includes(file)) {
        filtered.push(file);
      }
    });

    return filtered;
  }

  static async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }
};
