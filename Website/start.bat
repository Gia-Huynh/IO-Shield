@echo off 
echo "Use your browser and go to 'localhost:5000' or '127.0.0.1:5000'"
TIMEOUT /T 0
py -m flask run
pause