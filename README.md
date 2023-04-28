# IO Shield 3D Model Generator

Generate 3D model to 3d print from image of Io Shield from manufacturer.   <br>
Only work with image that the background has the same color.   <br>
The online version is running at: http://ioshield.thietgia.com/   <br>
<h2> Installation & Usage </h2>   
<h3> Local Install </h3>   
More complex than the docker way, but this allows you to modify the algorithm's parameter in the main file (Cleaned.py).   <br>
To install and run the code locally on your computer:   <br>
     -  Install python.      <br>
     -  Use pip to install meshlib, matplotlib, numpy, opencv-python, scikit-image (package names are in the file ./Website/requirements.txt).   <br>
     -  Add your image to the Data folder.   <br>
     -  Run file Cleaned.py with your python interpreter   <br>
<h3> Docker Install </h3>   
Use cmd (or terminal if you are a linux fanboy), cd to the "Website" folder, run these 2 command:   <br> 
___________   <br>
docker build -t io_shield .   <br>
docker run -p 5000:5000 io_shield   <br>
___________   <br>      
Use your browser (I.E. Chrome, Firefox), type in localhost:5000 and you are all set.   <br>
