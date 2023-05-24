from flask import Flask
from flask import url_for
from flask import render_template
from flask import request
from flask import send_file
import Cleaned as cleaned_code
app = Flask(__name__)

import os

#cleaned_code.singleImage3DStl ('uploaded_file.png', 'threeDimFile.stl')
tempPath = "TempFolder/"

@app.route('/', methods=['GET', 'POST'])
def hello():
    url_for('static', filename='cum.css')
    url_for('static', filename='B450M Pro4-F(L5).png')
    url_for('static', filename='logic.js')
    return render_template('index.html')

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if (request.method == 'POST') or (request.method == 'GET'):
        if request.files["file"].filename == '':
            return 'No selected file'
        #print (request)
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
		try:
			gae = int(request.form['myNum'])
			print (gae)
			print (type(gae))
			gae = int(request.form['myRange'])
			print (gae)
			print (type(gae))
		except Exception as e:
			print(e)
		file_path = tempPath + str(os.getpid()) + 'adjusting.gay'
		f.save(file_path)
		cleaned_code.singleImageBFS (file_path, tempPath + str(os.getpid()) + 'twoDimFile.png',
			left_padding = int(request.form['myNum']), right_padding = int(request.form['myNum2']), bottom_padding = int(request.form['myNum3'])
		)
	return send_file( tempPath + str(os.getpid()) + 'twoDimFile.png')


@app.route('/convert', methods=['GET', 'POST'])
def convert_file():
	file = request.data
	f = open(tempPath + str(os.getpid()) + 'uploaded.png', "wb")
	f.write(file)
	f.close()
	cleaned_code.singleImage3DStl (tempPath + str(os.getpid()) + 'uploaded.png', tempPath + str(os.getpid()) + 'threeDimFile.stl')
	return send_file(tempPath + str(os.getpid()) + 'threeDimFile.stl', as_attachment=True)

with app.test_request_context():
    print(url_for('static', filename='cum.css'))

    print(url_for('static', filename='B450M Pro4-F(L5).png'))

    print(url_for('static', filename='logic.js'))

if __name__ == '__main__':
    app.run(threaded=True, host='0.0.0.0', debug=False)
else:
	gunicorn_app = app
