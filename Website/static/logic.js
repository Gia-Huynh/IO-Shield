import {setUpApplyButton} from './img/perspective.js'
import {Utils} from './img/utils.js'
import {SetUpPerspectiveBox} from './img/index.js'
import {updateTextInput, dataURLtoFile} from './tiny_util_functions.js'
import {getKonvaCanvas} from './konva_entrypoint.js'

document.addEventListener("DOMContentLoaded", function() {
  document.documentElement.style.setProperty('--scrollbar-width', (window.innerWidth - document.documentElement.clientWidth) + "px");
  
 }, false);


let CropValueChange = false;
function ModifyCropValue() //Will be called by the slider (in html, lol).
{
	if (CropValueChange == false)
	{
		CropValueChange = true;
	};
};
function CropTopChecking()
{
	if (CropValueChange == true)
	{
		cropImage(userUploaded_OG_Image[0]);
		CropValueChange = false;
	};
};
setInterval(CropTopChecking, 100);
//Drag N Drop Image
const InputBox = document.getElementById("InputBox");
const InputBox2 = document.getElementById("InputBox2");
let userUploaded_OG_Image;
function AllowDownloadImageButton (eventDtTransferFile, fileName){ //evt.dataTransfer.files[0], userUploaded_OG_Image[0].name
	const dlBtn = document.getElementById("downloadBtn");
	dlBtn.href = URL.createObjectURL(eventDtTransferFile);
	dlBtn.download = fileName.replace(/\.[^/.]+$/, "") + ".png";
	dlBtn.style.display = "inline-block";
}
let dropContainer = document.getElementById("dropContainer");
dropContainer.ondragover = dropContainer.ondragenter = function(evt) {
  evt.preventDefault();
};
dropContainer.ondrop = function(evt) {
  evt.preventDefault();
  

  const dT = new DataTransfer();
  dT.items.add(evt.dataTransfer.files[0]);
  
  userUploaded_OG_Image = dT.files;
  UpdateDisplayingImages(evt.dataTransfer.files[0]);  
  InputBox.files = dT.files;
  //InputBox2.files = dT.files;
  AllowDownloadImageButton(evt.dataTransfer.files[0], userUploaded_OG_Image[0].name);
  
  evt.preventDefault();
  document.getElementsByClassName ("ShowAfterShrink")[0].style.display = "block";
  document.getElementsByClassName ("RemoveAfterShrink")[0].style.display = "none";
  document.getElementById("Review_Image").classList.remove("Hidden");
  var elmntToView = document.getElementById("CropRotateForm");
  elmntToView.scrollIntoView({ behavior: "smooth", block: "center", inline: "center"  });
};

//Drag N Drop only for the adjustment part's overlay image (Copy pasted from above)
let overlayDropContainer = document.getElementById("overlay_drop_container");
overlayDropContainer.ondragover = overlayDropContainer.ondragenter = function(evt) {
  evt.preventDefault();
};
overlayDropContainer.ondrop = function(evt) {
  console.log ("DragNDrop Overlay");
  evt.preventDefault();
  overlayImg.src = URL.createObjectURL(evt.dataTransfer.files[0]);
}

InputBox.onchange = evt => {
  const [file] = InputBox.files;
  //InputBox2.files = InputBox.files;
  if (file) {
	UpdateDisplayingImages(file);
	AllowDownloadImageButton(evt.dataTransfer.files[0], userUploaded_OG_Image[0].name);
  }
  document.getElementsByClassName ("ShowAfterShrink")[0].style.display = "block";
  document.getElementsByClassName ("RemoveAfterShrink")[0].style.display = "none";
  document.getElementById("Review_Image").classList.remove("Hidden");
  var elmntToView = document.getElementById("AdjustmentBox");
  elmntToView.scrollIntoView({ behavior: "smooth", inline: "center"}); 
};

function UpdateDisplayingImages(inputFile)
{	
	image_cropped_perspectiveCorrected.src = URL.createObjectURL(inputFile);
	document.getElementById("image_cropped_PerspectiveCorrecting").src =  image_cropped_perspectiveCorrected.src;
	document.getElementById("image_uploaded_cropping").src = image_cropped_perspectiveCorrected.src;
}
function rotateImage(OG_Image_URL) //Non-pure function, but I tried to keep it's context within boundary.
{
	const canvas = document.getElementById("tempCanvas");
	const ctx = canvas.getContext("2d");
	var img = new Image();
	img.src = URL.createObjectURL(OG_Image_URL);
	img.onload = function() {
		// Rotate 90 degrees clockwise
		canvas.width = img.height;
		canvas.height = img.width;

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.save();
		ctx.translate(0, canvas.height);
		ctx.rotate(-1 * Math.PI / 2);
		ctx.drawImage(img, 0, 0);
		ctx.restore();

		canvas.toBlob(blob => { //Unacceptable, not pure function, this is ass.
			const rotatedFile = new File([blob], userUploaded_OG_Image[0].name, { type: userUploaded_OG_Image[0].type });
			const dt = new DataTransfer();
			dt.items.add(rotatedFile);
			
			UpdateDisplayingImages(rotatedFile);
			userUploaded_OG_Image = dt.files;	
			InputBox.files = dt.files;
			//InputBox2.files = dt.files;	
			AllowDownloadImageButton(rotatedFile, userUploaded_OG_Image[0].name);
		});
	};
}
function resetCropSliderValue (){
	updateTextInput(0, 'CropLeftRange');
	updateTextInput(0, 'CropLeftNum'); 
	updateTextInput(0, 'CropRightRange');
	updateTextInput(0, 'CropRightNum'); 
	updateTextInput(0, 'CropBotRange');
	updateTextInput(0, 'CropBotNum'); 
	updateTextInput(0, 'CropTopRange');
	updateTextInput(0, 'CropTopNum'); 
}
function cropImage(OG_Image_URL) {
	const canvas = document.getElementById("tempCanvas");
	const ctx = canvas.getContext("2d");
	const img = new Image();

	const cropLeft = parseInt(document.getElementById("CropLeftNum").value);
	const cropRight = parseInt(document.getElementById("CropRightNum").value);
	const cropTop = parseInt(document.getElementById("CropTopNum").value);
	const cropBot = parseInt(document.getElementById("CropBotNum").value);

	img.src = URL.createObjectURL(OG_Image_URL);
	img.onload = function() {
		const cropWidth = img.width - cropLeft - cropRight;
		const cropHeight = img.height - cropTop - cropBot;

		canvas.width = cropWidth;
		canvas.height = cropHeight;

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(
			img,
			cropLeft, cropTop,           // start x,y on source
			cropWidth, cropHeight,       // source width/height
			0, 0,                         // draw at top-left on canvas
			cropWidth, cropHeight        // draw size
		);

		canvas.toBlob(blob => {
			const croppedFile = new File([blob], userUploaded_OG_Image[0].name, { type: userUploaded_OG_Image[0].type });
			const dt = new DataTransfer();
			dt.items.add(croppedFile);
			
			UpdateDisplayingImages(croppedFile);	
			InputBox.files = dt.files;
			AllowDownloadImageButton(croppedFile, userUploaded_OG_Image[0].name);
		});
	};
}

const InputBoxOverlay = document.getElementById("InputBoxOverlay");
InputBoxOverlay.onchange = evt => {
  const [file] = InputBoxOverlay.files;
  if (file) {
    overlayImg.src = URL.createObjectURL(file)
  }
}

var serverReturned_BlobImage;
function changeImage(blobImage) {
 const urlCreator = window.URL || window.webkitURL;
 serverReturned_BlobImage = blobImage;
 document.getElementById('resultImg').src = urlCreator.createObjectURL(blobImage);
}

function submitImage (withParam = false)
{
		const myForm = document.forms['ImageForm_NoParameter'];
		fetch('/upload', {method:'post', body: new FormData(myForm)})
				.then((response) => {
			if (!response.ok) {
			  throw new Error("HTTP error: ${response.status}");
			}
            let spacingData = JSON.parse(response.headers.get("Spacing")); // Extract metadata
			if  (withParam == true){
				updateTextInput(spacingData.left, 'myNum');
				updateTextInput(spacingData.right, 'myNum2');
				updateTextInput(spacingData.bottom, 'myNum3');
				updateTextInput(spacingData.top, 'myNum4');
			}
			return response.blob();
		  })
		  .then((blob) => {
			changeImage(blob); 
			document.getElementById("ImageForm_WithParameter").requestSubmit();
			document.getElementById("confirmBox").classList.remove("Hidden");
			setTimeout(function(){var elmntToView = document.getElementById("confirmBox");
			elmntToView.scrollIntoView({ behavior: "smooth", block:"center", inline: "center"});},1000);
  });
};
document.querySelector("#ImageForm_WithParameter").addEventListener("submit", function(e){
        e.preventDefault();    //stop form from submitting
		const myForm2 = document.forms['ImageForm_WithParameter'];
		InputBox2.files = InputBox.files;
		// Default values
		const defaultValues = {
			"myNum": "0",
			"myNum2": "0",
			"myNum3": "0",
			"myNum4": "0",
			"BlurRatio": "0",
			"ErosionNum": "0",
		};
		
		// Loop through the default values and set the field value if empty
		Object.keys(defaultValues).forEach(fieldName => {
			const field = myForm2[fieldName];
			if (field && field.value.trim() === "") {
				field.value = defaultValues[fieldName]; 
			}
		});
	
		fetch(document.forms['ImageForm_WithParameter'].action, {method:'post', body: new FormData(myForm2)})
				.then((response) => {
			if (!response.ok) {
			  throw new Error("HTTP error: ${response.status}");
			}
			return response.blob();
		  })
		  .then((blob) => {changeImage (blob); 
  });
});
function disableLastButton(){
      document.getElementById("LastButton").disabled = true;
      setTimeout(function(){document.getElementById("LastButton").disabled = false;},20000);
  }
function generateFilePostfix(){
	var filename = document.getElementById('InputBox').files[0].name;
	const myForm2 = document.forms['ImageForm_WithParameter'];
	var FilePostfix = "" + filename.replace(/\.[^/.]+$/, "").replace(" - Copy", "") + " [" + myForm2["myNum"].value + '-' + myForm2["myNum2"].value + '-' + myForm2["myNum3"].value + '-' + myForm2["myNum4"].value + "].stl";
	console.log (FilePostfix);
	document.getElementById('PostFixTextBox').value = FilePostfix;
}

document.querySelector("#LastButton").addEventListener("click", function(e){
	disableLastButton();
	generateFilePostfix();
  fetch('/convert', {method:"POST", body:serverReturned_BlobImage})
                .then(response  => {
			if (!response.ok) {
			  throw new Error("HTTP error: ${response.status}");
			}
			return response.blob();
		  })
		  .then((blob) => {
					var file = window.URL.createObjectURL(blob);
					window.location.assign(file);
					});
});

const utils = new Utils('errorMessage');
window.onload = function() {
	SetUpPerspectiveBox();
	const applyButton = document.getElementById('apply');
	applyButton.setAttribute('disabled','true');
	applyButton.onclick =() => setUpApplyButton(utils);
	console.log ("Apply Button assigned but disabled");
}

document.getElementById("image_cropped_PerspectiveCorrecting").addEventListener("load",() => {
	SetUpPerspectiveBox();
});

utils.loadOpenCv(() => {
    setTimeout(function() { 
        document.getElementById('apply').removeAttribute('disabled');
		console.log ("Apply Button enabled");
    },500)
});

//Bind functions to buttons.
document.getElementById('submitWithParam').onclick =() => {
  submitImage(true);
};
document.getElementById('submitOnly').onclick =() => {
  submitImage(false);
};
document.getElementById('overlayingButton').onclick =() => {
  overlayImg.src = document.getElementById("imageResult").toDataURL();
};
document.getElementById('rotateImage').onclick =() => {
  rotateImage(userUploaded_OG_Image[0]);
};
document.getElementById('cropImage').onclick =() => {
  cropImage(userUploaded_OG_Image[0]);
};
document.getElementById('resetCropValue').onclick =() => {
  resetCropSliderValue();
  cropImage(userUploaded_OG_Image[0]);
};
document.getElementById('CropLeftNum').onchange = (e) => {
  updateTextInput(e.target.value, 'CropLeftRange');
};
document.getElementById('CropLeftRange').oninput = (e) => {
  updateTextInput(e.target.value, 'CropLeftNum'); 
  ModifyCropValue();
};
document.getElementById('CropRightNum').onchange = (e) => {
  updateTextInput(e.target.value, 'CropRightRange');
};
document.getElementById('CropRightRange').oninput = (e) => {
  updateTextInput(e.target.value, 'CropRightNum'); 
  ModifyCropValue();
};
document.getElementById('CropBotNum').onchange = (e) => {
  updateTextInput(e.target.value, 'CropBotRange');
};
document.getElementById('CropBotRange').oninput = (e) => {
  updateTextInput(e.target.value, 'CropBotNum'); 
  ModifyCropValue();
};
document.getElementById('CropTopNum').onchange = (e) => {
  updateTextInput(e.target.value, 'CropTopRange');
};
document.getElementById('CropTopRange').oninput = (e) => {
  updateTextInput(e.target.value, 'CropTopNum'); 
  ModifyCropValue();
};



async function submitKonvasCanvas()
{ 	const dataURL = getKonvaCanvas();
	const blob = await (await fetch(dataURL)).blob();
	fetch('/upload_png', {
	  method: 'POST',
	  headers: {
		'Content-Type': 'image/png'
	  },
	  body: blob
	}).then((response) => 
			{
				if (!response.ok) 
				{
				  throw new Error("HTTP error: ${response.status}");
				}
				let spacingData = JSON.parse(response.headers.get("Spacing")); // Extract metadata
				//console.log("Spacing Data: ", spacingData);
				updateTextInput(spacingData.left, 'myNum');
				updateTextInput(spacingData.right, 'myNum2');
				updateTextInput(spacingData.bottom, 'myNum3');
				updateTextInput(spacingData.top, 'myNum4');
				
				let temp_file_list = new DataTransfer();
				temp_file_list.items.add(dataURLtoFile (dataURL, 'nigger.png'));
				document.getElementById("InputBox").files = temp_file_list.files;
				document.getElementById("InputBox2").files = temp_file_list.files;

				return response.blob();
			})
		  .then((blob) => 
			{
				changeImage (blob); 
				document.getElementById("ImageForm_WithParameter").requestSubmit();
				document.getElementById("confirmBox").classList.remove("Hidden");
				setTimeout(function(){var elmntToView = document.getElementById("confirmBox");
				elmntToView.scrollIntoView({ behavior: "smooth", block:"center"});},1000);
			});
}
document.getElementById('send-konva-img').onclick =() => {
	submitKonvasCanvas();
};
