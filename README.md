# masnotenpm list -g --depth=0## building from sourcerun to install dependencies```npm install```wget http://fontawesome.io/assets/font-awesome-4.7.0.zip### building with nodegit BUILD_ONLY=true ELECTRON_VERSION=1.3.5 npm install nodegit npm rebuild --runtime=electron --target=1.3.5 --disturl=https://atom.io/download/atom-shell --build-from-source --abi=49## build for windows```zip -r dist/testwin.zip dist/win-unpackedcp dist/testwin.zip /media/sf_myshareDebianMain/```cp dist/masnote\ Setup\ 0.0.1.exe /media/sf_myshareDebianMain/## recycle electron-packager . masnote --platform=win32 --electron-version=1.3.5 --overwritecp -r masnote-win32-x64 /media/sf_myshareDebianMain/npm rebuild --runtime=electron --target=1.3.5 --disturl=https://atom.io/download/atom-shell --abi=49