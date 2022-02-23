const {existsSync, mkdirSync, readdirSync, rmSync, copyFileSync} = require("fs"); 
const { execSync } = require("child_process");
const { resolve } = require("path");

const kavaDirPath = resolve(__dirname, '..', 'kava'); 
const docDestinationPath = resolve(__dirname, '..', 'pages', 'modules');


// resolves to a module spec sub dir inside the kava reop 
const moduleSpecFolderPath = (moduleName) => resolve(kavaDirPath, 'x', moduleName, 'spec'); 

// resolves to a module spec file inside the kava repo 
const moduleSpecFilePath = (moduleName, file) => resolve(kavaDirPath, 'x', moduleName, 'spec', file); 

// clones the main kava repository 
function cloneKavaRepo(){
    // ensure that it doesn't exist first, which it shoudn't unless the process didn't exit gracefully on the last run and post.js wasn't ran or pre.js failed 
    existsSync(kavaDirPath) && rmSync(kavaDirPath, {recursive: true}); 

    // runs a command in a child process in this case a git command 
    execSync('git clone https://github.com/Kava-Labs/kava.git', {cwd: resolve(__dirname, '..')});
};


function extractDocsFromKavaRepo(){
    const modulePaths = readdirSync(resolve(kavaDirPath, 'x'));

    if (!existsSync(docDestinationPath)){
        mkdirSync(docDestinationPath); 
    } else {
        // stale docs 
        // usually happens when the proccess didn't exit gracefully
        // in that case remove and remake an empty dir 
        rmSync(docDestinationPath, {recursive : true});
        mkdirSync(docDestinationPath); 
    }

    for (const moduleName of modulePaths){
        // if the module contains a subdir with name spec then it contains documentaion we would want to copy 
        if (existsSync(moduleSpecFolderPath(moduleName))){

            // make a directory matching the module name in our destination folder 
            mkdirSync(resolve(docDestinationPath, moduleName));

            // traverse the files inside the module spec looking for markdown files 
            readdirSync(moduleSpecFolderPath(moduleName)).forEach((file)=>{
            
                // if the current subdir file ends with an .md let's copy it and paste it inside our destination subdir named after our module 
                if (file.endsWith(".md")){
                    copyFileSync(moduleSpecFilePath(moduleName, file), resolve(docDestinationPath, moduleName, file));
                };

            });
        };

    };

}; 


// removes the kava repo once we are done extracting the docs from it
// ensure it exists before removing to avoid errors
//(it should exist but just incase... usually happens when the proccess didn't exit gracefully) and post.js wasn't ran
function rmKavaRepo(){
    existsSync(kavaDirPath) && rmSync(kavaDirPath, { recursive : true}); 
}; 



(
    function(){
        cloneKavaRepo();
        extractDocsFromKavaRepo();
        rmKavaRepo();
    }
)();