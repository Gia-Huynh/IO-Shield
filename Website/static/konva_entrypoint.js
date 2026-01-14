import {Port_HDMI, Port_DP, Port_DSub, Port_DVI, Port_COM,Port_Parallel} from './konva_code/ports_shapes/video_ports.js';
import {Port_Audio_Column, Port_Audio_Optic, Port_Audio_Single} from './konva_code/ports_shapes/audio_ports.js';
import {Port_PS2, Port_USB, Port_USB_2x, Port_USB_TypeC, Port_CMOS} from './konva_code/ports_shapes/other_ports.js';
import {Port_Ethernet, Port_Wifi} from './konva_code/ports_shapes/ethernet_wifi_ports.js';
import {updateTextInput} from './tiny_util_functions.js'

import {addPort, get_transform_node, 
		right_click_remove_shape, left_click_show_transformer} 
		from './konva_code/shape_functions.js';
import {GRID_RES, DEFAULT_X, DEFAULT_Y} from './konva_code/konva_config.js';
var stage = null;
var layer;
var t_h;
var t_w;
var canvas_width=3175;
var canvas_height=889;
function Setup_konva_canvas (container_id, stage_width, stage_height){
	//Setup Stage, Layer and Transformation
	stage = new Konva.Stage({
	  container: container_id, //Bind Stage to container
	  width: stage_width,
	  height: stage_height
	  //width: 3175,
	  //height: 889
	});
	//stage.scale({x: (3175/stage_width),  y: (889/stage_height)});
	stage.scale({x: (stage_width/canvas_width),  y: (stage_height/canvas_height)});
	console.log ("Canvas setting up, size (w,h):",stage_width,stage_height);
	//DELET THIS TESTING (Don't delete, probably working fine so LEAVE IT BE)
	stage.getContainer().style.width = stage_width + 'px';
	stage.getContainer().style.height = stage_height + 'px';
	stage.getContainer().parentNode.style.width = stage_width + 'px';
	stage.getContainer().parentNode.style.height = stage_height + 'px';
	
	layer = new Konva.Layer();
	const tr = get_transform_node (Konva, false);
	 
	//Adding shits together.
	layer.add(tr);
	layer.on('contextmenu', (e) => right_click_remove_shape (e, stage, Konva, tr, layer));  //Delete shape on right click
	layer.draw();
	stage.add(layer);
	stage.on('mousedown', (e) => { left_click_show_transformer (e, stage, Konva, tr, layer);}); //Show transformer menu on left click

	//Bind ports to buttons.
	document.getElementById('add-ps2').onclick = () => {
	  addPort(Port_PS2, layer, t_w/4, 30);
	};
	document.getElementById('add-usb').onclick = () => {
	  addPort(Port_USB, layer, t_w/2, 30);
	};
	document.getElementById('add-usb2x').onclick = () => {
	  addPort(Port_USB_2x, layer, t_w/2, 30);
	};
	document.getElementById('add-usbC').onclick = () => {
	  addPort(Port_USB_TypeC, layer, t_w/2, 30);
	};
	document.getElementById('add-cmos').onclick = () => {
	  addPort(Port_CMOS, layer, t_w/2, 50);
	};
	document.getElementById('add-hdmi', t_w/2, 30).onclick = () => {
	  addPort(Port_HDMI, layer);
	};
	document.getElementById('add-dp').onclick = () => {
	  addPort(Port_DP, layer, t_w/2, 30);
	};
	document.getElementById('add-dsub').onclick = () => {
	  addPort(Port_DSub, layer, t_w/2, 30);
	};
	document.getElementById('add-dvi').onclick = () => {
	  addPort(Port_DVI, layer, t_w/2, 30);
	};
	document.getElementById('add-com').onclick = () => {
	  addPort(Port_COM, layer, t_w/2, 30);
	};
	document.getElementById('add-parallel').onclick = () => {
	  addPort(Port_Parallel, layer, t_w/2, 30);
	};
	document.getElementById('add-ethernet').onclick = () => {
	  addPort(Port_Ethernet, layer, 3*t_w/4, 30);
	};
	document.getElementById('add-wifi').onclick = () => {
	  addPort(Port_Wifi, layer, 3*t_w/4, 30);
	};
	document.getElementById('add-audio-single').onclick = () => {
	  addPort(Port_Audio_Single, layer, 3*t_w/4, 30);
	};
	document.getElementById('add-audio-column').onclick = () => {
	  addPort(Port_Audio_Column, layer, 3*t_w/4, 30);
	};
	document.getElementById('add-audio-optic').onclick = () => {
	  addPort(Port_Audio_Optic, layer, 3*t_w/4, 30);
	};
}
export function Apply_AI_Port_Detect (port_dict)
{
	//Canvas setting up, size (w,h): 1639 377
	//addPort(Port_USB, layer,1585, 435); //WTF
	/*{"ethernet":     1, 1:"ethernet",
                "usb":  2, 2:"usb",
                "audio":3, 3:"audio",
                "2usb": 4, 4:"2usb",
                "ps2-wifi":     6, 6:"ps2-wifi",
                "displayport":  5, 5:"displayport",
                "dvi":7, 7:"dvi",
                "com":8, 8:"com",
                }*/
	port_dict.forEach(item => {
								var actual_x = item['centroid'][0] * 1550; //t_w;
								var actual_y = item['centroid'][1] * 400; //t_h;
								var port_ID = item['port_id'];
								var port_function;
								if (port_ID == 1)
								{port_function = Port_Ethernet}
								else if (port_ID == 2)
								{port_function = Port_USB}
								else if (port_ID == 3)
								{port_function = Port_Audio_Single}
								else if (port_ID == 4)
								{port_function = Port_USB_2x}
								else if (port_ID == 5)
								{port_function = Port_DP}
								else if (port_ID == 6)
								{port_function = Port_PS2}
								else if (port_ID == 7)
								{port_function = Port_DVI}
								else if (port_ID == 8)
								{port_function = Port_DSub}
								
								addPort(port_function, layer, 
											actual_x, 
											actual_y
										)
							});
};
//Function to copy uploaded image down to konva canvas.
export function Konva_canvas_load_image (clear_canvas = false)
{
	//const dataURL = document.getElementById('imageResult').toDataURL();
	t_h = document.getElementById("image_cropped_perspectiveCorrected").height;
	t_w = document.getElementById("image_cropped_perspectiveCorrected").width;
	if ((stage == null) || (clear_canvas == true)){
		Setup_konva_canvas ('konva_container', 
			t_w, 
			t_h
		);
	}
	else
	{
		stage.width(t_w);
		stage.height(t_h);
		
		stage.scale({x: (t_w/canvas_width),
					 y: (t_h/canvas_height)}); 
		console.log ("Canvas resized, now size (w,h):",t_w,t_h);
	}
	document.getElementById("konva_background_image").src = document.getElementById("image_cropped_perspectiveCorrected").src;
};
export function downloadKonvasCanvasPNG(filename)
{
	console.log ("downloadKonvasCanvasPNG triggered");
	const dataURL = stage.toDataURL({ 
									mimeType: 'image/png',
									backgroundColor: 'white',
									pixelRatio: 1,
									});
	const a = document.createElement('a');
	a.href = dataURL;
	a.download = filename;
	a.click();	
}
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