function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[arr.length - 1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}
    function DataURIToBlob(dataURI) {
        const splitDataURI = dataURI.split(',')
        const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
        const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

        const ia = new Uint8Array(byteString.length)
        for (let i = 0; i < byteString.length; i++)
            ia[i] = byteString.charCodeAt(i)

        return new Blob([ia], { type: mimeString })
      }



const utils = new Utils('errorMessage');
const applyButton = document.getElementById('apply')
const setUpApplyButton = function () { 
    //console.log(cv)
	const imageUsed = document.getElementById('sample').getAttribute('src');
	console.log ("NIGGERNIGGERNIGGER");
	console.log(imageUsed);
    
    let pointsArray = []
    const children = document.querySelectorAll('#window_g .handle')
    console.log(children)
    children.forEach(e =>{
        const pos = e.getAttribute('transform');
        console.dir(pos)
        const point = pos.replace('translate(','').replace(')','').split(',')
        pointsArray.push(point[0])
        pointsArray.push(point[1])
    })
    console.log(pointsArray)
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
    const scaleFactor = parseInt(imageWidth / svgCropWidth)
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
	blah.src = document.getElementById("imageResult").toDataURL();
	//document.getElementById("InputBox").files = [dataURLtoFile (blah.src,'nigger.png')];
	//document.getElementById("InputBox").files = blah.src;
    },500)
    
        
}
applyButton.setAttribute('disabled','true')
applyButton.onclick = setUpApplyButton
utils.loadOpenCv(() => {
    setTimeout(function () { 
        applyButton.removeAttribute('disabled');
    },500)
});
