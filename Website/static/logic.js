import {setUpApplyButton} from './img/perspective.js'
import {Utils} from './img/utils.js'
import {SetUpPerspectiveBox} from './img/index.js'
import {updateTextInput, dataURLtoFile} from './tiny_util_functions.js'
import {getKonvaCanvas} from './konva_entrypoint.js'

document.addEventListener("DOMContentLoaded", function () {
  document.documentElement.style.setProperty('--scrollbar-width', (window.innerWidth - document.documentElement.clientWidth) + "px");
  
 }, false);


let CropValueChange = false;
function ModifyCropValue () //Will be called by the slider (in html, lol).
{
	if (CropValueChange == false)
	{
		CropValueChange = true;
	};
};
function CropTopChecking ()
{
	if (CropValueChange == true)
	{
		cropImage();
		CropValueChange = false;
	};
};
setInterval(CropTopChecking, 100);
//Drag N Drop Image
let dropContainer = document.getElementById("dropContainer");
const InputBox = document.getElementById("InputBox");
const InputBox2 = document.getElementById("InputBox2");
let userUploadedImage;
dropContainer.ondragover = dropContainer.ondragenter = function(evt) {
  evt.preventDefault();
};
function AllowDownloadImageButton (eventDtTransferFile, fileName){ //evt.dataTransfer.files[0], userUploadedImage[0].name
	const dlBtn = document.getElementById("downloadBtn");
	dlBtn.href = URL.createObjectURL(eventDtTransferFile);
	dlBtn.download = fileName.replace(/\.[^/.]+$/, "") + ".png";
	dlBtn.style.display = "inline-block";
}
dropContainer.ondrop = function(evt) {
  evt.preventDefault();
  
  //userUploadedImage = evt.dataTransfer.files;
  //InputBox.files = evt.dataTransfer.files;
  //InputBox2.files = evt.dataTransfer.files;

  // If you want to use some of the dropped files
  const dT = new DataTransfer();
  dT.items.add(evt.dataTransfer.files[0]);
  
  userUploadedImage = dT.files;
  UpdateDisplayingImages(evt.dataTransfer.files[0]);  
  InputBox.files = dT.files;
  InputBox2.files = dT.files;
  AllowDownloadImageButton(evt.dataTransfer.files[0], userUploadedImage[0].name);
  
  evt.preventDefault();
  document.getElementsByClassName ("ShowAfterShrink")[0].style.display = "block";
  document.getElementsByClassName ("RemoveAfterShrink")[0].style.display = "none";
  document.getElementById("Review_Image").classList.remove("Hidden");
  var elmntToView = document.getElementById("CropRotateForm");
  elmntToView.scrollIntoView({ behavior: "smooth", block: "center" });
};
//Drag N Drop Overlay (Copy pasted from above)
dropContainer = document.getElementById("overlay_drop_container");
dropContainer.ondragover = dropContainer.ondragenter = function(evt) {
  evt.preventDefault();
};
dropContainer.ondrop = function(evt) {
  console.log ("DragNDrop Overlay");
  evt.preventDefault();
  overlayImg.src = URL.createObjectURL(evt.dataTransfer.files[0]);
}

InputBox.onchange = evt => {
  const [file] = InputBox.files;
  InputBox2.files = InputBox.files;
  if (file) {
	UpdateDisplayingImages(file);
	AllowDownloadImageButton(evt.dataTransfer.files[0], userUploadedImage[0].name);
  }
  document.getElementsByClassName ("ShowAfterShrink")[0].style.display = "block";
  document.getElementsByClassName ("RemoveAfterShrink")[0].style.display = "none";
  document.getElementById("Review_Image").classList.remove("Hidden");
  var elmntToView = document.getElementById("AdjustmentBox");
  elmntToView.scrollIntoView({ behavior: "smooth"}); 
};

function UpdateDisplayingImages(inputFile)
{	
	image_cropped_perspectiveCorrected.src = URL.createObjectURL(inputFile);
	document.getElementById("image_cropped_PerspectiveCorrecting").src =  image_cropped_perspectiveCorrected.src;
	document.getElementById("image_uploaded_cropping").src = image_cropped_perspectiveCorrected.src;
}
function rotateImage ()
{
	const canvas = document.getElementById("tempCanvas");
	const ctx = canvas.getContext("2d");
	var img = new Image();
	img.src = URL.createObjectURL(userUploadedImage[0]);
	img.onload = function () {
		// Rotate 90 degrees clockwise
		canvas.width = img.height;
		canvas.height = img.width;

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.save();
		ctx.translate(0, canvas.height);
		ctx.rotate(-1 * Math.PI / 2);
		ctx.drawImage(img, 0, 0);
		ctx.restore();
		
		canvas.toBlob(blob => {
			const rotatedFile = new File([blob], userUploadedImage[0].name, { type: userUploadedImage[0].type });
			const dt = new DataTransfer();
			dt.items.add(rotatedFile);
															
			UpdateDisplayingImages(rotatedFile);		
			userUploadedImage = dt.files;	
			InputBox.files = dt.files;
			InputBox2.files = dt.files;	
			AllowDownloadImageButton(rotatedFile, userUploadedImage[0].name);
		});
	};
}
function cropImage() {
	const canvas = document.getElementById("tempCanvas");
	const ctx = canvas.getContext("2d");
	const img = new Image();

	const cropLeft = parseInt(document.getElementById("CropLeftNum").value);
	const cropRight = parseInt(document.getElementById("CropRightNum").value);
	const cropTop = parseInt(document.getElementById("CropTopNum").value);
	const cropBot = parseInt(document.getElementById("CropBotNum").value);

	img.src = URL.createObjectURL(userUploadedImage[0]);
	img.onload = function () {
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
			const croppedFile = new File([blob], userUploadedImage[0].name, { type: userUploadedImage[0].type });
			const dt = new DataTransfer();
			dt.items.add(croppedFile);
			
			UpdateDisplayingImages(croppedFile);	
			InputBox.files = dt.files;
			InputBox2.files = dt.files;
			AllowDownloadImageButton(croppedFile, userUploadedImage[0].name);
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

var currentBlobImage;
function changeImage(blobImage) {
 const urlCreator = window.URL || window.webkitURL;
 currentBlobImage = blobImage;
 document.getElementById('resultImg').src = urlCreator.createObjectURL(blobImage);
}

document.querySelector("#ImageForm").addEventListener("submit", function(e){
        e.preventDefault();    //stop form from submitting, this just stops the 400 Bad Request submission
});
function submitWithParam ()
{
		const myForm = document.forms['ImageForm'];
		fetch(document.forms['ImageForm'].action, {method:'post', body: new FormData(myForm)})
				.then((response) => {
			if (!response.ok) {
			  throw new Error("HTTP error: ${response.status}");
			}
            let spacingData = JSON.parse(response.headers.get("Spacing")); // Extract metadata
            console.log("Spacing Data: ", spacingData);
			updateTextInput(spacingData.left, 'myNum');
			updateTextInput(spacingData.right, 'myNum2');
			updateTextInput(spacingData.bottom, 'myNum3');
			updateTextInput(spacingData.top, 'myNum4');
			return response.blob();
		  })
		  .then((blob) => {changeImage (blob); 
			document.getElementById("ImageForm2").requestSubmit();
			document.getElementById("confirmBox").classList.remove("Hidden");
			setTimeout(function(){var elmntToView = document.getElementById("confirmBox");
			elmntToView.scrollIntoView({ behavior: "smooth"});},1000);
  });
};
function submitOnly ()
{
			const myForm = document.forms['ImageForm'];
		fetch(document.forms['ImageForm'].action, {method:'post', body: new FormData(myForm)})
				.then((response) => {
			if (!response.ok) {
			  throw new Error("HTTP error: ${response.status}");
			}
			return response.blob();
		  })
		  .then((blob) => {
			changeImage (blob); 
			document.getElementById("ImageForm2").requestSubmit();
			document.getElementById("confirmBox").classList.remove("Hidden");
			setTimeout(function(){var elmntToView = document.getElementById("confirmBox");
			elmntToView.scrollIntoView({ behavior: "smooth"});},1000);
  });
}
document.querySelector("#ImageForm2").addEventListener("submit", function(e){
        e.preventDefault();    //stop form from submitting
		const myForm2 = document.forms['ImageForm2'];
		
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
	
		fetch(document.forms['ImageForm2'].action, {method:'post', body: new FormData(myForm2)})
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
	const myForm2 = document.forms['ImageForm2'];
	var FilePostfix = "" + filename.replace(/\.[^/.]+$/, "").replace(" - Copy", "") + " [" + myForm2["myNum"].value + '-' + myForm2["myNum2"].value + '-' + myForm2["myNum3"].value + '-' + myForm2["myNum4"].value + "].stl";
	console.log (FilePostfix);
	document.getElementById('PostFixTextBox').value = FilePostfix;
}
document.querySelector("#LastButton").addEventListener("click", function(e){
	disableLastButton();
	generateFilePostfix();
  fetch('/convert', {method:"POST", body:currentBlobImage})
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
	SetUpPerspectiveBox ();
	const applyButton = document.getElementById('apply');
	applyButton.setAttribute('disabled','true');
	applyButton.onclick = () => setUpApplyButton(utils);
	console.log ("Apply Button assigned but disabled");
}

document.getElementById("image_cropped_PerspectiveCorrecting").addEventListener("load", () => {
	SetUpPerspectiveBox ();
});

utils.loadOpenCv(() => {
    setTimeout(function () { 
        document.getElementById('apply').removeAttribute('disabled');
		console.log ("Apply Button enabled");
    },500)
});

//Bind functions to buttons.
document.getElementById('submitWithParam').onclick = () => {
  submitWithParam();
};
document.getElementById('submitOnly').onclick = () => {
  submitOnly();
};
document.getElementById('overlayingButton').onclick = () => {
  overlayImg.src = document.getElementById("imageResult").toDataURL();
};
document.getElementById('rotateImage').onclick = () => {
  rotateImage();
};
document.getElementById('cropImage').onclick = () => {
  cropImage();
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



async function submitKonvasCanvas ()
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
				document.getElementById("ImageForm2").requestSubmit();
				document.getElementById("confirmBox").classList.remove("Hidden");
				setTimeout(function(){var elmntToView = document.getElementById("confirmBox");
				elmntToView.scrollIntoView({ behavior: "smooth"});},1000);
			});
}
document.getElementById('send-konva-img').onclick = () => {
	submitKonvasCanvas();
};
