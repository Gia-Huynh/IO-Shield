from flask import Flask
from flask import url_for
from flask import render_template
from flask import request
app = Flask(__name__)



@app.route('/')
def hello():
    url_for('static', filename='cum.css')
    url_for('static', filename='B450M Pro4-F(L5).png')
    url_for('static', filename='logic.js')
    return render_template('index.html')

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        f = request.files["InputBox"]
        f.save('uploaded_file')
    return render_template('index.html')
        
with app.test_request_context():
    print(url_for('static', filename='cum.css'))

    print(url_for('static', filename='B450M Pro4-F(L5).png'))

    print(url_for('static', filename='logic.js'))
