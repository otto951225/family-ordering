@echo off
cd /d "%~dp0"
set "PATH=C:\Users\otto9\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;C:\Users\otto9\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin;%PATH%"
"C:\Users\otto9\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" ".\node_modules\next\dist\bin\next" dev -H 0.0.0.0 -p 3000
