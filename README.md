# masnote## Notes * list installed packages ```npm list -g --depth=0```* using font awesome```wget http://fontawesome.io/assets/font-awesome-4.7.0.zip  ```## building* In .npmrc : runtime = electron target = 1.3.5 target_arch = x64 disturl = https://atom.io/download/atom-shell* see scripts for building ```npm install npm install ajv@5.0.4-beta.3// switch below between plateforms npm i nodegit --target_platform=win32npm i nodegit --target_platform=linux```## recycle ```zip -r dist/testwin.zip dist/win-unpackedmv dist/testwin.zip /media/sf_myshareDebianMain/cp dist/masnote\ Setup\ 0.0.1.exe /media/sf_myshareDebianMain/```  "movewin": "rm -rf /media/sf_myshareDebianMain/dist && rm /media/sf_myshareDebianMain/testwin.zip && zip -r dist/testwin.zip dist/win-unpacked && mv dist/testwin.zip /media/             sf_myshareDebianMain/",BUILD_ONLY=true ELECTRON_VERSION=1.3.5 npm install nodegit npm rebuild --runtime=electron --target=1.3.5 --disturl=https://atom.io/download/atom-shell --arch=x64 --build-from-source --abi=49npm rebuild --runtime=electron --target=1.3.5 --disturl=https://atom.io/download/atom-shell --arch=x64 --target_platform=win32 --abi=49electron-packager . masnote --platform=win32 --electron-version=1.3.5 --overwritecp -r masnote-win32-x64 /media/sf_myshareDebianMain/npm rebuild --runtime=electron --target=1.3.5 --disturl=https://atom.io/download/atom-shell --abi=49