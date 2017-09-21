@echo off
mode con cols=60 lines=20
title = ATools - code

:loop
echo ==================================
md "../package-code/src/app/base"
md "../package-code/src/app/box"
md "../package-code/src/app/box/code"

echo base
xcopy "src/app/base" "../package-code/src/app/base" /s /e /y
copy /y src\app\index.css ..\package-code\src\app\

copy /y src\main.js ..\package-code\src\
copy /y src\package.json ..\package-code\src\

copy /y src\app\index.html ..\package-code\src\app\
copy /y src\app\index.js ..\package-code\src\app\
copy /y src\app\loading.html ..\package-code\src\app\

echo box
xcopy "src/app/box/code" "../package-code/src/app/box/code" /s /e /y


asar pack ../package-code/src/ ../package-code/bin/resources/app.asar  --unpack-dir "{app}"

ping localhost -n 3 > nul


echo ---------------------- pack success!
pause>nul
goto loop