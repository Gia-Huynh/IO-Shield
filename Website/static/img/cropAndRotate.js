import {UpdateDisplayingImages, UpdateUploadedFiles} from "../logic.js"
import {AllowDownloadImageButton, updateTextInput} from '../tiny_util_functions.js'
export function rotateImage(OG_Image_URL) //Non-pure function, but I tried to keep it's context within boundary.
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
			//const rotatedFile = new File([blob], userUploaded_OG_Image[0].name, { type: userUploaded_OG_Image[0].type });
			const rotatedFile = new File([blob], OG_Image_URL.name, { type: OG_Image_URL.type });
			const dt = new DataTransfer();
			dt.items.add(rotatedFile);
			
			UpdateUploadedFiles (dt, true);
			UpdateDisplayingImages(rotatedFile);
			AllowDownloadImageButton(rotatedFile, OG_Image_URL.name);
		});
	};
}
export function resetCropSliderValue (){
	updateTextInput(0, 'CropLeftRange');
	updateTextInput(0, 'CropLeftNum'); 
	updateTextInput(0, 'CropRightRange');
	updateTextInput(0, 'CropRightNum'); 
	updateTextInput(0, 'CropBotRange');
	updateTextInput(0, 'CropBotNum'); 
	updateTextInput(0, 'CropTopRange');
	updateTextInput(0, 'CropTopNum'); 
}
export function cropImage(OG_Image_URL) {
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
			const croppedFile = new File([blob], OG_Image_URL.name, { type: OG_Image_URL.type });
			const dt = new DataTransfer();
			dt.items.add(croppedFile);
			
			UpdateUploadedFiles (dt, false);
			UpdateDisplayingImages(croppedFile);	
			AllowDownloadImageButton(croppedFile, OG_Image_URL.name);
		});
	};
}
let CropValueChange = false;
export function ModifyCropValue() //Will be called by the slider (in html, lol).
{
	if (CropValueChange == false)
	{
		CropValueChange = true;
	};
};
export function CropTopChecking(userUploaded_OG_Image)
{
	if (CropValueChange == true)
	{
		cropImage(userUploaded_OG_Image[0]);
		CropValueChange = false;
	};
};