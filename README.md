# masnoterun `npm install` to install dependencies#wget http://fontawesome.io/assets/font-awesome-4.7.0.zipnpm install electron-config##electron-packager . masnote --platform=win32 --electron-version=1.3.5 --overwritecp -r masnote-win32-x64 /media/sf_myshareDebianMain/## building with nodegit BUILD_ONLY=true ELECTRON_VERSION=1.3.5 npm install nodegit -Dnpm rebuild --runtime=electron --target=1.3.5 --disturl=https://atom.io/download/atom-shell --build-from-source --abi=49## should not need npm rebuild --runtime=electron --target=1.3.5 --disturl=https://atom.io/download/atom-shell --abi=49