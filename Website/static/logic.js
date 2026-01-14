import {updateTextInput, dataURLtoFile, disableLastButton, generateFilePostfix, show_hide_shrink_stuff, AllowDownloadImageButton, imageToUri} from './tiny_util_functions.js'
import {getKonvaCanvas, downloadKonvasCanvasPNG, Apply_AI_Port_Detect, Konva_canvas_load_image} from './konva_entrypoint.js'

import {setUpApplyButton_WithPerspective, UtilsPerspective} from './img/perspective.js'
//import {} from './img/utilsPerspective.js'
import {SetUpPerspectiveBox} from './img/index.js'
import {rotateImage, resetCropSliderValue, cropImage, ModifyCropValue, CropTopChecking} from './img/cropAndRotate.js'


//Global variable, keep them in check
var serverReturned_BlobImage;
var userEntered_Filename;
let userUploaded_OG_Image;
//Setter for Global variable
export function UpdateDisplayingImages(inputFile)
{	
	image_cropped_perspectiveCorrected.src = URL.createObjectURL(inputFile);
	document.getElementById("image_cropped_PerspectiveCorrecting").src =  image_cropped_perspectiveCorrected.src;
	document.getElementById("image_uploaded_cropping").src = image_cropped_perspectiveCorrected.src;
}
export function UpdateEnteredFilename(newName) //Result File Naming
{
	if (newName === undefined  || newName.trim() === "")//If user did not suplement the name (A.k.a function called without any input variable)
	{
		if (userEntered_Filename === undefined)
		{
			console.log ("User not entered file name, auto generating from", userUploaded_OG_Image[0].name);
			userEntered_Filename = userUploaded_OG_Image[0].name; //Auto generate filename from input file.
		}
		else
		{
			//console.log ("Filename already generated, not regenerating..."); //Gonna get spammed a lot when doing cropping so don't print this.
		};
	}
	else{
		console.log ("User entered file name:", newName);
		userEntered_Filename = newName; //asign file name from user input
	}
	//console.log("inside UpdateEnteredFilename:", userEntered_Filename);
	return userEntered_Filename;
}
export function getFileNameFromInputTextBox ()
{
	UpdateEnteredFilename(document.getElementById("filename-input").value);
};

export function UpdateUploadedFiles(dt, OG_Image = false) //DataTransfer Object
{
	if (OG_Image == true)
	{
		userUploaded_OG_Image = dt.files;
	}
	InputBox.files = dt.files;
}

// Set Interval for crop checking.
setInterval(function(){CropTopChecking(userUploaded_OG_Image)}, 100);
// Set up perspective box everytime there is a cropping event
document.getElementById("image_cropped_PerspectiveCorrecting").addEventListener("load",() => {
	//SetUpPerspectiveBox();
	//This causes too much performance issue, so moving this down to 'scrollToPerspective'
});

//Drag N Drop the first Image
const InputBox = document.getElementById("InputBox");
let dropContainer = document.getElementById("dropContainer");
dropContainer.ondragover = dropContainer.ondragenter = function(evt) {
  evt.preventDefault();
};
dropContainer.ondrop = function(evt) {
	evt.preventDefault();
	const dT = new DataTransfer();
	dT.items.add(evt.dataTransfer.files[0]);

	UpdateUploadedFiles(dT, true);
	UpdateDisplayingImages(evt.dataTransfer.files[0]);
	const temp_filename = UpdateEnteredFilename();//Use this to await the result filename
	console.log("after call (temp_filename and userEntered_Filename):", temp_filename, userEntered_Filename);
	AllowDownloadImageButton(evt.dataTransfer.files[0], temp_filename);
	show_hide_shrink_stuff();
	//document.getElementById("NameInputSection").style.backgroundColor = "#2e62b2";
	document.getElementById("NameInputSection").scrollIntoView({ behavior: "smooth", block: "center", inline: "center"  }); //Scroll into next part
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

// On-Change binding, and set Interval binding
InputBox.onchange = evt => {
  const [file] = InputBox.files;			
  if (file) {
	UpdateDisplayingImages(file);
	UpdateEnteredFilename();
	const temp_filename = UpdateEnteredFilename(); //Use this to await the result filename
	AllowDownloadImageButton(evt.dataTransfer.files[0], temp_filename);
  };
  show_hide_shrink_stuff();
  document.getElementById("CropRotateForm").scrollIntoView({ behavior: "smooth", inline: "center"}); //Scroll into next part
};
document.getElementById("InputBoxOverlay").onchange = evt => {
  const [file] = document.getElementById("InputBoxOverlay").files;
  if (file) {
    overlayImg.src = URL.createObjectURL(file);
  }
}
	
function changeImageFromBlob(blobImage) { //From server blob to displaying image
 serverReturned_BlobImage = blobImage; //Global Variable Editing
 document.getElementById('resultImg').src = (window.URL || window.webkitURL).createObjectURL(blobImage);
}

// Non-adjust image submission
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
			changeImageFromBlob(blob); 
			document.getElementById("ImageForm_WithParameter").requestSubmit();
			document.getElementById("confirmBox").classList.remove("Hidden");
			setTimeout(function(){var elmntToView = document.getElementById("confirmBox");
			elmntToView.scrollIntoView({ behavior: "smooth", block:"center", inline: "center"});},500);
  });
};
// AI Port detection submission
async function submitImage_AI_Port_Detect ()
{ 	const dataURL =  document.getElementById("image_cropped_perspectiveCorrected").src;
	return imageToUri(dataURL).then(uri =>
							fetch('/upload_png_AI_DETECTION', {
							  method: 'POST',
							  headers: {
								'Content-Type': 'image/png'
							  },
							  body: uri
							}).then((response) => 
									{
										if (!response.ok) 
										{
										  throw new Error("HTTP error: ${response.status}");
										}
										let port_dict = JSON.parse(response.headers.get("port_dict"));
										console.log("port_dict: ", port_dict)
										return port_dict;
									}) //);
								  .then((port_dict) => 
									{
										Apply_AI_Port_Detect(port_dict);										
									}) );
}
window.submitImage_AI_Port_Detect = submitImage_AI_Port_Detect; //DEBUG ONLY!!!!!!!!
//const result = await submitImage_AI_Port_Detect();
//console.log(result);
// Adjusted Image Submission
document.querySelector("#ImageForm_WithParameter").addEventListener("submit", function(e){
        e.preventDefault();    //stop form from submitting
		const myForm2 = document.forms['ImageForm_WithParameter'];
		document.getElementById("InputBox2").files = InputBox.files;
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
		  .then((blob) => {changeImageFromBlob (blob); 
							});
});
// Final button submission
document.querySelector("#LastButton").addEventListener("click", function(e){
	disableLastButton();
	generateFilePostfix(userEntered_Filename, document.forms['ImageForm_WithParameter']);
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
// Konvas Canvas submission
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
				temp_file_list.items.add(dataURLtoFile (dataURL, userEntered_Filename));
				document.getElementById("InputBox").files = temp_file_list.files;
				document.getElementById("InputBox2").files = temp_file_list.files;

				return response.blob();
			})
		  .then((blob) => 
			{
				changeImageFromBlob (blob); 
				document.getElementById("ImageForm_WithParameter").requestSubmit();
				document.getElementById("confirmBox").classList.remove("Hidden");
				setTimeout(function(){var elmntToView = document.getElementById("confirmBox");
				elmntToView.scrollIntoView({ behavior: "smooth", block:"center"});},1000);
			});
}
//Setup Perspective Correction
const utilsPerspective = new UtilsPerspective('errorMessage');
window.onload = function() {
	SetUpPerspectiveBox();
	document.getElementById('apply').setAttribute('disabled','true');
	document.getElementById('apply').onclick =() => setUpApplyButton_WithPerspective(utilsPerspective);
	console.log ("Apply Button assigned but disabled");
}
utilsPerspective.loadOpenCv(() => {
    setTimeout(function() { 
        document.getElementById('apply').removeAttribute('disabled');
		console.log ("Apply Button enabled");
    },150)
});
//Bind functions to buttons.
document.getElementById('submitWithParam').onclick =() => {
  submitImage(true);
};
document.getElementById('submitOnly').onclick =() => {
  submitImage(false);
};
document.getElementById('overlayingCanvasResultButton').onclick =() => {
  overlayImg.src = document.getElementById("imageResult").toDataURL();
};
document.getElementById('overlayingUploadedImageButton').onclick =() => {
  overlayImg.src = document.getElementById("image_cropped_PerspectiveCorrecting").src;
};
document.getElementById('rotateImage').onclick =() => {
  resetCropSliderValue();
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
  ModifyCropValue();
};
document.getElementById('CropLeftRange').oninput = (e) => {
  updateTextInput(e.target.value, 'CropLeftNum'); 
  ModifyCropValue();
};
document.getElementById('CropRightNum').onchange = (e) => {
  updateTextInput(e.target.value, 'CropRightRange');
  ModifyCropValue();
};
document.getElementById('CropRightRange').oninput = (e) => {
  updateTextInput(e.target.value, 'CropRightNum'); 
  ModifyCropValue();
};
document.getElementById('CropBotNum').onchange = (e) => {
  updateTextInput(e.target.value, 'CropBotRange');
  ModifyCropValue();
};
document.getElementById('CropBotRange').oninput = (e) => {
  updateTextInput(e.target.value, 'CropBotNum'); 
  ModifyCropValue();
};
document.getElementById('CropTopNum').onchange = (e) => {
  updateTextInput(e.target.value, 'CropTopRange');
  ModifyCropValue();
};
document.getElementById('CropTopRange').oninput = (e) => {
  updateTextInput(e.target.value, 'CropTopNum'); 
  ModifyCropValue();
};
document.getElementById('send-konva-img').onclick =() => {
	submitKonvasCanvas();
};
document.getElementById('download-konva-img').onclick =() => {
	downloadKonvasCanvasPNG(userEntered_Filename);
};
document.getElementById('set-filename').onclick =() => {
	getFileNameFromInputTextBox();
	document.getElementById("CroppingBoxGuide").scrollIntoView({ behavior: "smooth", block: "center", inline: "center"  });
};
document.getElementById('AI-port-detection').onclick =() => {
	submitImage_AI_Port_Detect();
};
document.getElementById('scrollToPerspective').onclick =() => {
	SetUpPerspectiveBox();
	document.getElementById("PerspectiveCorrectionBox").scrollIntoView({ behavior: "smooth", block: "center", inline: "center"  });
};
document.getElementById('scrollToKonvas').onclick =() => {
	Konva_canvas_load_image (true);
	document.getElementById("konva_container_container").scrollIntoView({ behavior: "smooth", block: "center", inline: "center"  });
	overlayImg.src = document.getElementById("imageResult").toDataURL();
	
};
document.getElementById('konva-load-image').onclick = () => {
	Konva_canvas_load_image ();
	document.getElementById("konva_container_container").scrollIntoView({ behavior: "smooth", block: "center", inline: "center"  });
};
document.getElementById('konva-clear-canvas').onclick = () => {
	Konva_canvas_load_image (true);
	document.getElementById("konva_container_container").scrollIntoView({ behavior: "smooth", block: "center", inline: "center"  });
};


//document.addEventListener("DOMContentLoaded", function() {
//  document.documentElement.style.setProperty('--scrollbar-width', (window.innerWidth - document.documentElement.clientWidth) + "px"); }, false);
