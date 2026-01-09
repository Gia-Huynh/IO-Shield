import {Port_HDMI, Port_DP, Port_DSub, Port_DVI} from './konva_code/ports_shapes/video_ports.js';
import {Port_Audio_Column, Port_Audio_Optic} from './konva_code/ports_shapes/audio_ports.js';
import {Port_PS2, Port_USB, Port_USB_2x, Port_USB_TypeC} from './konva_code/ports_shapes/other_ports.js';
import {Port_Ethernet} from './konva_code/ports_shapes/ethernet_wifi_ports.js';
import {updateTextInput} from './tiny_util_functions.js'

import {addPort, get_transform_node, 
		right_click_remove_shape, left_click_show_transformer} 
		from './konva_code/shape_functions.js';
import {GRID_RES, DEFAULT_X, DEFAULT_Y} from './konva_code/konva_config.js';
var stage = null;
function Setup_konva_canvas (container_id, stage_width, stage_height){
	//Setup Stage, Layer and Transformation
	stage = new Konva.Stage({
	  container: container_id, //Bind Stage to container
	  width: stage_width,
	  height: stage_height
	});
	//DELET THIS TESTING
	stage.getContainer().style.width = stage_width + 'px';
	stage.getContainer().style.height = stage_height + 'px';
	stage.getContainer().parentNode.style.width = stage_width + 'px';
	stage.getContainer().parentNode.style.height = stage_height + 'px';
	
	const layer = new Konva.Layer();
	const tr = get_transform_node (Konva, true);
	 
	//Adding shits together.
	layer.add(tr);
	layer.on('contextmenu', (e) => right_click_remove_shape (e, stage, Konva, tr, layer));  //Delete shape on right click
	layer.draw();
	stage.add(layer);
	stage.on('mousedown', (e) => { left_click_show_transformer (e, stage, Konva, tr, layer);}); //Show transformer menu on left click

	//Bind ports to buttons.
	document.getElementById('add-ps2').onclick = () => {
	  addPort(Port_PS2, layer);
	};
	document.getElementById('add-usb').onclick = () => {
	  addPort(Port_USB, layer);
	};
	document.getElementById('add-usb2x').onclick = () => {
	  addPort(Port_USB_2x, layer);
	};
	document.getElementById('add-usbC').onclick = () => {
	  addPort(Port_USB_TypeC, layer);
	};
	document.getElementById('add-hdmi').onclick = () => {
	  addPort(Port_HDMI, layer);
	};
	document.getElementById('add-dp').onclick = () => {
	  addPort(Port_DP, layer);
	};
	document.getElementById('add-dsub').onclick = () => {
	  addPort(Port_DSub, layer);
	};
	document.getElementById('add-dvi').onclick = () => {
	  addPort(Port_DVI, layer);
	};
	document.getElementById('add-ethernet').onclick = () => {
	  addPort(Port_Ethernet, layer);
	};
	document.getElementById('add-audio-column').onclick = () => {
	  addPort(Port_Audio_Column, layer);
	};
	document.getElementById('add-audio-optic').onclick = () => {
	  addPort(Port_Audio_Optic, layer);
	};
	
	
}
//Function to copy uploaded image down to konva canvas.
function Konva_canvas_load_image (clear_canvas = false)
{
	//const dataURL = document.getElementById('imageResult').toDataURL();
	if ((stage == null) || (clear_canvas == true)){
		Setup_konva_canvas ('konva_container', 
			document.getElementById("image_cropped_perspectiveCorrected").width, 
			document.getElementById("image_cropped_perspectiveCorrected").height
		);
	}
	else
	{
		stage.width(document.getElementById("image_cropped_perspectiveCorrected").width);
		stage.height(document.getElementById("image_cropped_perspectiveCorrected").height);
	}
	document.getElementById("konva_background_image").src = document.getElementById("image_cropped_perspectiveCorrected").src;
};
export function getKonvaCanvas ()
{
	//simply return dataURL of KonvaCanvas:
	return stage.toDataURL({ 
									mimeType: 'image/png',
									backgroundColor: 'white',
									pixelRatio: 1,
									});
}
async function submitKonvasCanvas ()
{ //Vấn đề lớn nhất của hàm này là chỉ có 1-2 dòng đầu là quan trọng liên quan tới Konva, 
  //còn lại là API Post và messing around with images, không liên quan konva, need to move this back to logic.js or similar.
	const dataURL = stage.toDataURL({ 
									mimeType: 'image/png',
									backgroundColor: 'white',
									pixelRatio: 1,
									});
	
	const a = document.createElement('a');
	a.href = dataURL;
	a.download = 'aaaaaaaaaaa - Copy.png';
	a.click();
  
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
				return response.blob();
			})
		  .then((blob) => 
			{
				//document.getElementById("ImageForm_WithParameter").requestSubmit();
				document.getElementById("confirmBox").classList.remove("Hidden");
				setTimeout(function(){var elmntToView = document.getElementById("confirmBox");
				elmntToView.scrollIntoView({ behavior: "smooth"});},1000);
			});
}
//document.getElementById('send-konva-img').onclick = () => {
//	submitKonvasCanvas();
//};
document.getElementById('konva-load-image').onclick = () => {
	Konva_canvas_load_image ();
};
document.getElementById('konva-clear-canvas').onclick = () => {
	Konva_canvas_load_image (true);
};