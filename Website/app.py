from flask import Flask
from flask import url_for
from flask import render_template
from flask import request
from flask import send_file
import Cleaned as cleaned_code
app = Flask(__name__)

#cleaned_code.singleImage3DStl ('uploaded_file.png', 'threeDimFile.stl')


@app.route('/')
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
        f.save('uploaded_file.gay')
        cleaned_code.singleImageBFS ('uploaded_file.gay', 'twoDimFile.png')
    return send_file('twoDimFile.png')
    #return None
    #return render_template('index.html')

@app.route('/convert', methods=['GET', 'POST'])
def convert_file():
	#if request.files["file"].filename == '':
	#	return 'No selected file'
	#print ("convert_file")
	#print (request)
	file = request.data
	f = open("uploaded_file.png", "wb")
	f.write(file)
	f.close()
	#f.save('uploaded_file.png')
	cleaned_code.singleImage3DStl ('uploaded_file.png', 'threeDimFile.stl')
	return send_file('threeDimFile.stl', as_attachment=True)

with app.test_request_context():
    print(url_for('static', filename='cum.css'))

    print(url_for('static', filename='B450M Pro4-F(L5).png'))

    print(url_for('static', filename='logic.js'))

if __name__ == '__main__':
    app.run(threaded=False, host='0.0.0.0')
