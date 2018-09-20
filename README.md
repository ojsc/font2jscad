# font2jscad
Converts truetype fonts or woff fonts to jscad files. These files can than be included in OpenJSCad.

# Usage

## cloned from git
```
example:
font2jscad.js -f font.ttf

Options:
  --font, -f                                                          [required]
  --out, -o         name outputfile,
                    default it is the same name as the input filename with the
                    extension changed to .jscad
  --standalone, -s  This will be the name in the "global" scope,
                    default will be "lowercasefontname_ttf_data" (or
                    lowercasefontname_woff_data)
  --version         Show version number                                [boolean]

```

## using npm
`npm i -D @ojsc/font2jscad` to get script installed.
Use `npx font2jscad -f fontname.ttf` to convert a font.

or install global: `sudo npm i -g @ojsc/font2jscad`
