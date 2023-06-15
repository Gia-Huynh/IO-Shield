# IO Shield 3D Model Generator

This repository provides a tool for generating a 3D model that can be used for 3D printing based on an image of the Io Shield from the manufacturer. The tool is designed to work specifically with images where the background color is consistent.

## Images
![](/img/Real_Life.jpg "Real life image")

## Installation

### Online version
To generate a 3D model, follow these steps:

- Visit the online version of the tool at http://ioshield.thietgia.com/.
- Upload an image of the Io Shield where the background color is consistently the same, the tool will select the color of the top left pixel of your image as the background color.
- The tool will analyze the image and generate a 2D temporal image based on the area that does not contain the background color.
- Once the temporal image is generated, you can preview it and make any necessary adjustments.
- Finally, you can download the 3D model file and use it for 3D printing.

*Note*: To reduce the online 3D model's generation time, the model's quality is compressed down so artifacts in the resulting model is expected. To get high quality version, see the Local Install section below.
### Local Install

More complex than the online way, but this allows you to modify the algorithm's parameter in the main file (Cleaned.py + running_config.txt).

To install and run the code locally on your computer:
- Install Python.
- Use pip to install meshlib, matplotlib, numpy, opencv-python, scikit-image (package names are in the file ./Website/requirements.txt).
- Edit the configuration file according to your need (a.k.a "running_config.txt").
- Run file "start.bat"
- Open any browser and type localhost:5000 to access the GUI.

### Docker Install

- Make sure you have [docker-compose](https://docs.docker.com/compose/) already installed
- Then open any command line tool you prefer and type

```bash
docker-compose up
```

- Open any browser and type localhost:5000 to access the GUI.


### Example with [GA-H61M-DS2](https://www.gigabyte.com/vn/Motherboard/GA-H61M-DS2-rev-50#ov)
![](/img/original.jpg "Original motherboard")
![](/img/cutting.jpg "Cutted the IO")
![](/img/upload.png "Upload the image")
![](/img/adjust.png "Adjusting the image")
![](/img/result_raw.png "Result without any refinement")

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.
Donate plz, computation cost ain't free.
