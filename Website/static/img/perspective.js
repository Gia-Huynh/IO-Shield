export function setUpApplyButton_WithPerspective (utils) 
{  //Setup cai perspective correction algorithm
	console.log ("setUpApplyButton_WithPerspective called");
	const imageUsed = document.getElementById('image_cropped_PerspectiveCorrecting').getAttribute('src');
    let pointsArray = []
    const children = document.querySelectorAll('#window_g .handle')
    //console.log(children)
    children.forEach(e => {
        const pos = e.getAttribute('transform');
        //console.dir(pos)
        const point = pos.replace('translate(','').replace(')','').split(',')
        pointsArray.push(point[0])
        pointsArray.push(point[1])
    })
    //console.log(pointsArray)
    utils.loadImageToCanvas(imageUsed, 'imageInit', document.querySelector('#background svg').getBoundingClientRect().width, document.querySelector('#background svg').getBoundingClientRect().height);
    setTimeout(()=>{
		
		const svgCropHeight =  document.querySelector('#background svg').getAttribute('height');// why
		const svgCropWidth =  document.querySelector('#background svg').getAttribute('width');// why
		const imageHeight = document.querySelector('#background svg').getBoundingClientRect().height;
		const imageWidth = document.querySelector('#background svg').getBoundingClientRect().width;
		//const imageHeight = document.getElementById('imageInit').getBoundingClientRect().height;
		//const imageWidth = document.getElementById('imageInit').getBoundingClientRect().width;
		//const svgCropHeight =  document.querySelector('#background svg').getAttribute('height') - 80;// why
		//const svgCropWidth =  document.querySelector('#background svg').getAttribute('width') - 80;// why
		const scaleFactor = Math.ceil(imageWidth / svgCropWidth)
		console.log (imageWidth + " " + svgCropWidth + " " + imageWidth / svgCropWidth + " " + parseInt(imageWidth / svgCropWidth) + " " + scaleFactor);
		//debugger
		pointsArray = pointsArray.map( e => {
			const num = parseInt((parseInt(e))/scaleFactor)
			return num
		})
		//document.getElementById('imageInit').style.width = imageWidth;
		//document.getElementById('imageInit').style.height = imageHeight;
		document.getElementById('imageResult').style.width = imageWidth;
		document.getElementById('imageResult').style.height = 0;
		let src = cv.imread('imageInit');
		let dst = new cv.Mat();
		let dsize = new cv.Size(imageWidth, imageHeight);
		let srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, pointsArray);
		//let dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, imageHeight, 0, imageHeight, imageWidth, 0, imageWidth]);
		let dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, imageWidth, 0, imageWidth, imageHeight , 0, imageHeight]);
		console.log ("array size comparison");
		console.log (pointsArray);
		console.log ([0, 0, imageWidth, 0, imageWidth, imageHeight , 0, imageHeight]);
		let M = cv.getPerspectiveTransform(srcTri, dstTri);
		cv.warpPerspective(src, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
		document.getElementById('imageInit').style.display = "none";
		cv.imshow('imageResult', dst);
		src.delete(); dst.delete(); M.delete(); srcTri.delete(); dstTri.delete();
		image_cropped_perspectiveCorrected.src = document.getElementById("imageResult").toDataURL();
	
		const dlBtn = document.getElementById("downloadBtn");
		dlBtn.href = document.getElementById("imageResult").toDataURL();
		//document.getElementById("InputBox").files = [dataURLtoFile (image_cropped_perspectiveCorrected.src,'nigger.png')];
    },1000)
	setTimeout(()=>{document.getElementById("Review_Image").scrollIntoView({ behavior: 'smooth', block: 'center'})}, 1500);
}
export function UtilsPerspective(errorOutputId) { // eslint-disable-line no-unused-vars
    let self = this;
    this.errorOutput = document.getElementById(errorOutputId);

    const OPENCV_URL = './img/opencv.js';
    this.loadOpenCv = function(onloadCallback) {
        let script = document.createElement('script');
        script.setAttribute('async', '');
        script.setAttribute('type', 'text/javascript');
        script.addEventListener('load', () => {
            //console.log(cv.getBuildInformation()); //OpenCv Printing logs
			console.log ("OpenCv loaded");
            onloadCallback();
        });
        script.addEventListener('error', () => {
            self.printError('Failed to load ' + OPENCV_URL);
        });
        script.src = OPENCV_URL;
        let node = document.getElementsByTagName('script')[0];
        node.parentNode.insertBefore(script, node);
    };

    this.loadImageToCanvas = function(url, cavansId, width, height) {
        let canvas = document.getElementById(cavansId);
        let ctx = canvas.getContext('2d');
        let img = new Image();
        img.onload = function() {
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
        };
        img.src = url;
    };
};
