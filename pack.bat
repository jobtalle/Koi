call build.bat
call electron-packager . koi --platform=win32 --arch=x64 --overwrite --ignore="^/js|^/css|^/\.idea|pack\.bat|build\.bat|index\.html|README\.md"
