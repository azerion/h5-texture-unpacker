[![npm version](https://badge.fury.io/js/%40azerion%2Fh5-texture-unpacker.svg)](https://badge.fury.io/js/%40azerion%2Fh5-texture-unpacker) 

# h5-texture-unpacker
Simple CLI tool that allows you to unpack your existing Texture atlasses provided that you have the JSON file available

Getting Started
---------------
First you want to install a fresh copy of the plugin.
```
ale@computer:~$ npm install @azerion/h5-texture-unpacker -g
```
Now you'll be able to use the command:
```
ale@computer:~$ unpack
Usage: unpack -j [jsonFile] -o [outputDir]
```

Usage
-----
```
ale@computer:~$ unpack
Usage: unpack -j [jsonFile] -o [outputDir]

Options:
  --version        Show version number                                 [boolean]
  --imageFile, -i  The input texture image                [string] [default: ""]
  --jsonFile, -j   The input JSON configuration              [string] [required]
  --outputDir, -o  The output folder                         [string] [required]
  --verbose, -v    Show log messages                  [boolean] [default: false]
  -h, --help       Show help                                           [boolean]

copyright Azerion 2019
```

TODO
----
- [ ] Add support for format
- [ ] Format validation
- [ ] parse/process trimmed/rotation from json

F.A.Q.
------
### My atlas format [json/xml/csv] is not supported!
We'd love to include more format as we go, but for now will only add the ones we need, if there's anything you'd like to add or suggest feel free to add a ticker or create a Pull Request

Credits
=======
Created with https://github.com/alexjoverm/typescript-library-starter.git 

Disclaimer
----------
We at Azerion just love playing and creating awesome games. We aren't affiliated with Phaser.io. We just needed to unpack some awesome texture for our awesome HTML5 games. Feel free to use it for enhancing your own awesome games!
h5-texture-unpacker is distributed under the MIT license. All 3rd party libraries and components are distributed under their
respective license terms.

