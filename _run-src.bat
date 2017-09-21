@echo off
mode con cols=60 lines=20
title = ATools
cd src
:loop
echo ==================================
taskkill /F /im electron.exe
start cmd /c npm start
echo ---------------------- run success!
pause>nul
goto loop