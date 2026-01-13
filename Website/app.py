from flask import Flask
from flask import url_for
from flask import render_template
from flask import request
from flask import jsonify, send_file
from sys import platform
import Cleaned as cleaned_code
import TemplateMatching
import glob, json
import sys
import os
import base64
app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True

if getattr(sys, 'frozen', False) and hasattr(sys, '_MEIPASS'):
    print ("yeeeee")
    print (sys._MEIPASS)
    os.chdir(sys._MEIPASS)

tempPath = "TempFolder/"
if not os.path.exists(tempPath):
    os.makedirs(tempPath)

files = glob.glob(tempPath+'*')
for f in files:
    os.remove(f)
	

#placeholder, value from configuration file will be prioritized,
#these values are used only when there's no configuration file
debug_mode = 0
betterPrecision = 0
thickness = 0.9

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
        f.save(tempPath + str(os.getpid()) + 'uploaded.png')
        #spacing = {'left':x, 'right':visited.shape[1] - (x+w), 'bottom':visited.shape[0]-(y+h), 'top':y}
        spacing = cleaned_code.singleImageBFS (tempPath + str(os.getpid()) + 'uploaded.png', tempPath + str(os.getpid()) + 'twoDimFile.png')
    #return send_file(tempPath + str(os.getpid()) + 'twoDimFile.png')
    response = send_file(tempPath + str(os.getpid()) + 'twoDimFile.png', mimetype='image/png')
    response.headers["Spacing"] = json.dumps(spacing) #jsonify(spacing).get_data(as_text=True)
    return response
    #return render_template('index.html')

@app.route('/upload_adjust', methods=['GET', 'POST'])
def upload_adjust():
	if (request.method == 'POST') or (request.method == 'GET'):
		if request.files["file"].filename == '':
			print ("No file uploaded, API upload_adjust")
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
                        blur_ratio = float (request.form['BlurRatio']),
                        debug_mode = debug_mode
		)
	return send_file( tempPath + str(os.getpid()) + 'twoDimFile.png')

@app.route('/upload_png', methods=['POST'])
def upload_png():
    if request.content_type != 'image/png':
        return 'Invalid content type', 400
    data = request.data  # raw bytes
    if not data:
        return 'No image data', 400
    #path = f"{tempPath}{os.getpid()}_uploaded.png"
    with open(tempPath + str(os.getpid()) + 'uploaded.png', 'wb') as f:
        f.write(data)
    spacing = cleaned_code.singleImageBFS (tempPath + str(os.getpid()) + 'uploaded.png', tempPath + str(os.getpid()) + 'twoDimFile.png')
    response = send_file(tempPath + str(os.getpid()) + 'twoDimFile.png', mimetype='image/png')
    response.headers["Spacing"] = json.dumps(spacing)
    return response

@app.route('/upload_png_AI_DETECTION', methods=['POST'])
def upload_png_AI_DETECTION():
    if request.content_type != 'image/png':
        return 'Invalid content type', 400
    data = request.data  # raw bytes
    if not data:
        return 'No image data', 400
    #path = f"{tempPath}{os.getpid()}_uploaded.png"
    #with open(tempPath + str(os.getpid()) + 'uploaded.png', 'wb') as f:
    #    f.write(data)
    if data.startswith(b"data:image"):
        data = data.split(b",")[1]

    image_bytes = base64.b64decode(data)

    with open(tempPath + str(os.getpid()) + 'uploaded.png', "wb") as f:
        f.write(image_bytes)

    #data.save(tempPath + str(os.getpid()) + 'uploaded.png')
    #spacing = cleaned_code.singleImageBFS (tempPath + str(os.getpid()) + 'uploaded.png', tempPath + str(os.getpid()) + 'twoDimFile.png')
    port_dict, result_text_overlayed_img, result_mask = TemplateMatching.show_Canny(tempPath + str(os.getpid()) + 'uploaded.png')
    import cv2
    cv2.imwrite (tempPath + str(os.getpid()) + '-result_text_overlayed_img.png', result_text_overlayed_img)
    cv2.imwrite (tempPath + str(os.getpid()) + '-result_mask.png', result_mask)
    response = send_file(tempPath + str(os.getpid()) + 'uploaded.png', mimetype='image/png')
    response.headers["port_dict"] = json.dumps(port_dict)
    return response

@app.route('/convert', methods=['GET', 'POST'])
def convert_file():
	file = request.data
	f = open(tempPath + str(os.getpid()) + 'uploaded.png', "wb")
	f.write(file)
	f.close()
	cleaned_code.singleImage3DStl (tempPath + str(os.getpid()) + 'uploaded.png',
                                       tempPath + str(os.getpid()) + 'threeDimFile.stl',
                                       betterPrecision = betterPrecision,
                                       thickness = thickness)
	return send_file(tempPath + str(os.getpid()) + 'threeDimFile.stl', as_attachment=True, download_name="3D_Model.stl")

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
    print ("Running from __main__")
    app.run(threaded=True, host='0.0.0.0', debug=True)
else:		
    readConfigFile ('running_config.txt')
    print ("Running from gunicorn")
    gunicorn_app = app
