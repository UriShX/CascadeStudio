/**
 * Copy folder and contents recursively, then edit module file and remove exports.
 * Node.js CLI utility.
 * 
 * Uri Shani, 11.11.2020
 * 
 * Copy files recursivley from: https://stackoverflow.com/questions/13786160/copy-folder-recursively-in-node-js#answer-26038979
 */
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const args = require('minimist')(process.argv.slice(2), {
    string: [ 'src' ],
    string: [ 'dest' ],
    boolen: [ 'disable_module' ],
    string: [ 'module_name' ],
    alias: { s: 'src', d: 'dest' , m: 'disable_module', n: 'module_name' },
    default: {
        src: './node_modules/opencascade.js/dist/',
        dest: './js/CADWorker/required/opencascade.js/',
        disable_module: false,
        module_name: 'opencascade.wasm.js'
    },
    '--': true,
    stopEarly: true, /* populate _ with first non-option */
    unknown: function () { console.log('Unknown parameters, view source for details'); } /* invoked on unknown param */
});
// console.log(args);

const packageSource = path.resolve(__dirname, args['src']);
const packageDest = path.resolve(__dirname, args['dest']);
const modFile = path.resolve(packageDest, path.basename(args['src']), args['module_name'])

console.log(`Copying ${packageSource} to ${packageDest}`);

copyFolderRecursiveSync(packageSource, packageDest);

if (args['disable_module']) {
    const re = /^export.*[^{]$/g
    
    console.log(`Editing ${modFile}`);

    const tempModName = path.resolve(packageDest, path.basename(args['src']), '#' + args['module_name']);
    
    fs.rename(modFile, tempModName, (error) => { 
        if (error) {   
          // Show the error  
          console.error(error); 
        }
    });

    const rl = readline.createInterface({
        input: fs.createReadStream(tempModName),
        output: process.stdout,
        terminal: false
    });
    
    rl.on('line', (line) => {
        // console.log(line);
        if (!line.match(re)) fs.appendFileSync(modFile, line + '\n')
    });

    rl.on('close', () => {
        rl.close();
        fs.unlinkSync(tempModName, (error) => { 
            if (error) {   
              // Show the error  
              console.error(error); 
            }
        });
    })
}

function copyFileSync( source, target ) {

    var targetFile = target;

    // If target is a directory, a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync( source, target ) {
    var files = [];

    // Check if target folder exists and if not, crete it
    var targetFolder = target;
    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder );
    }
    // Check if folder needs to be created or integrated
    targetFolder = path.join( target, path.basename( source ) );
    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder );
    }

    // Copy
    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function ( file ) {
            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursiveSync( curSource, targetFolder );
            } else {
                copyFileSync( curSource, targetFolder );
            }
        } );
    }
}