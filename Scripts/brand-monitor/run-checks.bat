@echo off
REM Runs both brand-monitor scripts and appends timestamped output to logs\.
REM Intended to be registered as a recurring Windows Task Scheduler task (e.g.
REM "ZHELEZO-BrandMonitor", daily) — see README.md for what each script actually
REM checks and its honest limits, and for exact `schtasks` setup instructions.
REM Tested manually end-to-end 2026-07-21; scheduling it is a separate manual step.

setlocal
set SCRIPT_DIR=%~dp0
set LOG_FILE=%SCRIPT_DIR%logs\monitor.log

if not exist "%SCRIPT_DIR%logs" mkdir "%SCRIPT_DIR%logs"

echo. >> "%LOG_FILE%"
echo ===== %date% %time% ===== >> "%LOG_FILE%"

echo --- site-health-check.mjs --- >> "%LOG_FILE%"
node "%SCRIPT_DIR%site-health-check.mjs" >> "%LOG_FILE%" 2>&1
set HEALTH_EXIT=%ERRORLEVEL%

echo --- check-mentions.mjs --- >> "%LOG_FILE%"
node "%SCRIPT_DIR%check-mentions.mjs" >> "%LOG_FILE%" 2>&1

echo ===== done (site-health exit=%HEALTH_EXIT%) ===== >> "%LOG_FILE%"

REM Propagate site-health-check's exit code so Task Scheduler's own history/alerting
REM (if the user configures it) can see broken-link runs as a failed task.
exit /b %HEALTH_EXIT%
