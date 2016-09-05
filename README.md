## addcopyright

Concatenate files via the command line



## Install

```bash
$ npm install -g addcopyright
```



## Usage

Pass the files to concatenate (-f or --files parameter) to the tool, and optionally and destination file (-o or --output parameter):

```bash
$ addcopyright -f folder/*.php
```
Concatinator will create the bundle.js file, if it doesn't exists, and dump the content of all the passed files into that one. If you don't provide an output file, the tool will concatenate everything into a file called 'all', with the correct extension.
