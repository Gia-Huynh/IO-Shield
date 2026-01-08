@echo off 
echo "Use your browser and go to 'localhost:6969' or '127.0.0.1:6969'"
set FLASK_APP=app.py
set FLASK_ENV=development
py -m flask run -p 6969
pause