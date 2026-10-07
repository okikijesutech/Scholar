@echo off
title NaijaLessonPlan - Nigerian School Lesson Note Generator
echo ========================================================
echo   NaijaLessonPlan - Nigerian School Lesson Note Generator
echo   NERDC Basic & Senior Secondary Education Standard
echo ========================================================
echo.
echo Starting development server and opening browser...
cd /d "%~dp0"
call npm run dev -- --open
pause
