const fs = require('fs').promises;
const path = require('path');

const sharp = require('sharp');

module.exports = class Konverter {
  static async init(options) {
    let defaults = {
      filter: ['.DS_Store'],
      input: './input',
      target: './output',
      format: 'jpg',
    };

    const settings = { ...defaults, ...options };

    let inputFiles = await Konverter.getFilesOfDir(settings.input);
    let filteredInputFiles = await Konverter.filterFiles(inputFiles, settings.filter);

    // Make target dir if not existant
    await Konverter.mkDirIfNotExists(settings.target);

    // Convert all images and save to target folder
    await Konverter.convert(settings.input, settings.target, settings.format, filteredInputFiles);

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

  static async convert(input, target, format, filteredInputFiles) {
    await Konverter.asyncForEach(filteredInputFiles, async (file) => {
      const sourcePath = path.resolve(input, file);

      let splitted = file.split('.');
      splitted[splitted.length - 1] = format;
      const filename = splitted.join('.');

      const targetPath = path.resolve(target, filename);

      let buffer;

      switch (format) {
        case 'jpg':
          try {
            buffer = await sharp(sourcePath).jpeg().toBuffer();
          } catch (err) {
            console.log(err);
          }
          break;
        case 'png':
          try {
            buffer = await sharp(sourcePath).png().toBuffer();
          } catch (err) {
            console.log(err);
          }
          break;
        case 'webp':
          try {
            buffer = await sharp(sourcePath).webp().toBuffer();
          } catch (err) {
            console.log(err);
          }
          break;
        default:
          console.log('Target file format not supported.');
          break;
      }

      await fs.writeFile(targetPath, buffer);

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
