@echo off 
echo "Use your browser and go to 'localhost:6969' or '127.0.0.1:6969'"
TIMEOUT /T 0
py -m flask run -p 6969
pause