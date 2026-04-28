@echo off
echo Iniciando servidor...

start cmd /k npm start

timeout /t 1 >nul

start http://localhost:3000