@echo off
title Watcher de Sitemap - Constructora ByB
echo =========================================================
echo  Watcher de Sitemap de Constructora ByB
echo =========================================================
echo.
echo Ejecutando el script de monitoreo en tiempo real...
echo.
node generate-sitemap.js --watch
if errorlevel 1 (
    echo.
    echo Ocurrio un error al iniciar el script. Asegurese de tener Node.js instalado.
    pause
)
