# Конвертер
Simple CLI to onvert images from `JPEG, PNG, WEBP, HEIC, HEIF` to `JPEG, PNG or WEBP`.

## Setup
In order to use Конвертер, the bin script has to be linked.
This has to be done once in order to use global.

```bash
npm link
```

## Usage
Конвертер converts all images inside an input folder and writes them in the given format to the output folder.
If the input format is HEIC or HEIF, it has to be specified with the --format (-f) argument.

The target format is specified by the --target (-t) argument.
For further information see `konverter -h`.

`konverter -i ./path/to/input/dir -o ./path/to/output/dir -f inputformat -t targetformat`


