# masnote
* Notebook App using Git(nodegit) for synchronization
* Built with Electron with using node 6.3.1

## Notes 
* list installed packages 
```
npm list -g --depth=0
```
* using font awesome
```
wget http://fontawesome.io/assets/font-awesome-4.7.0.zip  
```


## Testing
https://github.com/davidzfu/proj0.git


## building
* In .npmrc : runtime = electron target = 1.3.5 target_arch = x64 disturl = https://atom.io/download/atom-shell
* see scripts for building 

```
npm install 
npm install ajv@5.0.4-beta.3
// switch below between plateforms 
npm i nodegit --target_platform=win32
npm i nodegit --target_platform=linux

```

