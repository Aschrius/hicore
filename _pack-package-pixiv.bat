@echo off
mode con cols=60 lines=20
title = ATools - code

:loop
echo ==================================
md "../package-pixiv"
md "../package-pixiv/src"
md "../package-pixiv/src/app"
md "../package-pixiv/src/app/base"
md "../package-pixiv/src/app/box"
md "../package-pixiv/src/app/box/pixiv"

echo base
xcopy "src/app/base" "../package-pixiv/src/app/base" /s /e /y
copy /y src\app\index.css ..\package-pixiv\src\app\

copy /y src\main.js ..\package-pixiv\src\
copy /y src\package.json ..\package-pixiv\src\

copy /y src\app\index.html ..\package-pixiv\src\app\
copy /y src\app\index.js ..\package-pixiv\src\app\
copy /y src\app\loading.html ..\package-pixiv\src\app\

echo box
xcopy "src/app/box/pixiv" "../package-pixiv/src/app/box/pixiv" /s /e /y


asar pack ../package-pixiv/src/ ../package-pixiv/bin/resources/app.asar  --unpack-dir "{app}"

ping localhost -n 3 > nul


echo ---------------------- pack success!
pause>nul
goto loop