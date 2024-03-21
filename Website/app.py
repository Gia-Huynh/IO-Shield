from flask import Flask
from flask import url_for
from flask import render_template
from flask import request
from flask import send_file
from sys import platform
import Cleaned as cleaned_code
app = Flask(__name__)

import os

#cleaned_code.singleImage3DStl ('uploaded_file.png', 'threeDimFile.stl')
tempPath = "TempFolder/"

#placeholder, value from configuration file will be prioritized,
#these values are used only when there's no configuration file
debug_mode = 0
betterPrecision = 0
thickness = 1.5

@app.route('/', methods=['GET', 'POST'])
def hello():
    return render_template('index.html')
@app.route('/<path:path>')
def static_file(path):
    return app.send_static_file(path)

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    print (request)
    if (request.method == 'POST') or (request.method == 'GET'):
        if request.files["file"].filename == '':
            print ('No selected file')
            return 'No selected file'
        #print (request.form["InputBox"])
        f = request.files["file"]
        f.save(tempPath + str(os.getpid()) + 'uploaded.gay')
        cleaned_code.singleImageBFS (tempPath + str(os.getpid()) + 'uploaded.gay', tempPath + str(os.getpid()) + 'twoDimFile.png')
    return send_file( tempPath + str(os.getpid()) + 'twoDimFile.png')
    #return None
    #return render_template('index.html')

@app.route('/upload_adjust', methods=['GET', 'POST'])
def upload_adjust():
	if (request.method == 'POST') or (request.method == 'GET'):
		if request.files["file"].filename == '':
			print ("No file, upload_adjust")
			return 'No selected file'
		f = request.files["file"]
		file_path = tempPath + str(os.getpid()) + 'adjusting.gay'
		f.save(file_path)
		cleaned_code.singleImageBFS (file_path, tempPath + str(os.getpid()) + 'twoDimFile.png',
			left_padding = int(request.form['myNum']),
			right_padding = int(request.form['myNum2']),
			bottom_padding = int(request.form['myNum3']),
			top_padding = int(request.form['myNum4']),
			erosion = int(request.form['ErosionNum']),
                        debug_mode = debug_mode
		)
	return send_file( tempPath + str(os.getpid()) + 'twoDimFile.png')


@app.route('/convert', methods=['GET', 'POST'])
def convert_file():
	file = request.data
	f = open(tempPath + str(os.getpid()) + 'uploaded.png', "wb")
	f.write(file)
	f.close()
	cleaned_code.singleImage3DStl (tempPath + str(os.getpid()) + 'uploaded.png', tempPath + str(os.getpid()) + 'threeDimFile.stl', betterPrecision = betterPrecision, thickness = thickness)
	return send_file(tempPath + str(os.getpid()) + 'threeDimFile.stl', as_attachment=True)

with app.test_request_context():
    print(url_for('static', filename='cum.css'))

    print(url_for('static', filename='B450M Pro4-F(L5).png'))

    print(url_for('static', filename='logic.js'))

def readConfigFile (path):
	try:
		f = open(path, "r")
		global lines, debug_mode, thickness, betterPrecision
		lines = f.readlines()
		debug_mode = int (lines[6])
		thickness = float(lines[4])
		betterPrecision = int (lines[2])
		print ("Thickness: ", float(lines[4]),", betterPrecision: ", int(lines[2]),", debug mode: ", int (lines[6]))
		f.close()
	except FileNotFoundError:
		print('Config file does not exist, download it again from github, running variable with default value (should still be usable')
		
    
if __name__ == '__main__':
    readConfigFile ('running_config.txt')
    app.run(threaded=True, host='0.0.0.0', debug=True)
else:		
    readConfigFile ('running_config.txt')
    gunicorn_app = app
