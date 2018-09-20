#!/usr/bin/env node
/*

Script to convert truetype/woff fonts to an .jscad file
By making use off Browserify and brfs transform

MIT License 

Copyright (c) 2018 Menno Vossen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// TODO handle errors (try)

const path = require('path');
const argv = require('yargs')
  .usage ('font2jscad.js -f font.ttf/font.woff')
  .option("font",{ alias: "f", descibtion: "ttf/woff filename"})
  .option("out", { alias: "o", description: `name outputfile, 
 default it is the same name as the input filename with the extension changed to .jscad` })
  .option("standalone", { alias: "s", description: `This will be the name in the "global" scope,
default will be "lowercasefontname_ttf_data" (or lowercasefontname_woff_data)`})
  .demandOption("font")
  .help(false)
  .version("1.0.0")
  .argv;

const mkdirpSync = function (dirPath) {
  const parts = dirPath.split(path.sep)
  for (let i = 1; i <= parts.length; i++) {
    fs.mkdirSync(path.join.apply(null, parts.slice(0, i)))
  }
} 

var fs = require('fs');

if ( !fs.existsSync(argv.f) ) {
  console.error(`Error: Can't find font file: ${argv.f}`);
  process.exit(1);
};

console.log(`Converting font: ${argv.f} ..`); 

let filename = path.basename(argv.f)
      .toLowerCase()
      .replace(/[.,\ ,-]/gi,"_");

// holds temporary script to be browerified
if (!fs.existsSync("tmp")){
    fs.mkdirSync("tmp");
}

var browserify = require('browserify');

fs.writeFileSync("tmp/font.js", 
`var fs = require('fs');
var font = fs.readFileSync("${argv.f}");
module.exports = font;
`);

let opath;

if (!argv.o) {
  opath = path.parse(`jscad_fonts/${filename}.jscad`);
} else {
  opath = path.parse(argv.o);
}

if ( (opath.ext !== ".js") & (opath.ext !== ".jscad") ) {
  console.error("Output file extension should be .js or .jscad");
  process.exit(2);
}

if (!fs.existsSync(opath.dir)) {
    mkdirpSync(opath.dir);
}

let standalone; 

if (!argv.s) {
  standalone = filename+"_data";
} else {
  standalone = argv.s;
}
// TODO handle errors try 
var b = browserify('tmp/font.js', { standalone: standalone } );

filenameNoEx = filename.split(".")[0];
b.transform('brfs');
//b.bundle().pipe(fs.createWriteStream(`jscad_fonts/${filenameNoEx}.jscad`));
b.bundle().pipe(fs.createWriteStream(opath.dir+path.sep+opath.base));

console.log(`Output filename: ${opath.dir+path.sep+opath.base}`); 
console.log(`Exposes "${standalone}" to Openjscad "global" scope`);


