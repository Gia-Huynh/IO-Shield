import {FILL_COLOR, STROKE_COLOR, STROKE_WIDTH} from '../konva_config.js';

export function Port_HDMI({
  x = 150,
  y = 100
} = {}) {
	// ---- shape ----
	const shape = new Konva.Group({
	  x: x,	  y: y,	  draggable: true
	});
	var body_height = 140;
	var body_width = 330;
	var AlignLine_y_offset_ratio = 0.5;
	// main rectangle
	const body = new Konva.Rect({
	  x: x,
	  y: y,	  
	  width: body_width,	  height: body_height,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,	
	  cornerRadius: [18,18,72,72]
	});
	const Bot_AlignLine = new Konva.Rect({
	  x: x+Math.floor (body_width/3), //integer division
	  y: y+Math.floor(AlignLine_y_offset_ratio*body_height),	  
	  width: Math.floor (body_width/3),	  height: 2,
	  stroke: STROKE_COLOR,	  strokeWidth: 3,	
	});
	shape.add(body);
	shape.add(Bot_AlignLine);
	
  return [shape];
}
export function Port_DP ({
  x = 150,
  y = 100
} = {}) {
	// ---- shape ----
	const shape = new Konva.Group({
	  x: x,	  y: y,	  draggable: true
	});
	// main rectangle
	const body = new Konva.Rect({
	  x: x,
	  y: y,	  
	  width: 390,	  height: 160,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,	
	  cornerRadius: [36,36,36,84]
	});
	shape.add(body);
	
  return [shape];
}
function Port_D_subminiature ({
  x = 150,
  y = 100,
  bulge_width = 120,
  bulge_height = 160,
  body_width = 550,
  body_height = 220,
  AlignLine_x_offset_ratio = 0.05
} = {}) {
	// ---- shape ----
	const shape = new Konva.Group({
	  x: x,	  y: y,	  draggable: true
	});
	var bulge_y_offset = Math.floor((body_height - bulge_height)/2);
	var AlignLine_x_offset = Math.floor(AlignLine_x_offset_ratio * body_width);
	
	// main rectangle
	// I SWEAR TO GOD THIS BODY IS PERFECT, STOP MESSING WITH IT
	const Left_bulge = new Konva.Rect({
	  x: x,     
	  y: y+bulge_y_offset,
	  width: bulge_width,
	  height: bulge_height,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,
	  cornerRadius: [18,0,0,18]
	}); 
	const body = new Konva.Rect({
	  x: x+bulge_width,     // attached to right side
	  y: y,	  
	  width: body_width,	  height: body_height,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,	cornerRadius: 15
	});
	shape.add(body);
	
	// bulge
	const Right_bulge = new Konva.Rect({
	  x: x+(body_width+bulge_width),     // attached to right side
	  y: y+bulge_y_offset,
	  width: bulge_width,
	  height: bulge_height,
	  fill: FILL_COLOR,	  stroke: STROKE_COLOR,	  strokeWidth: STROKE_WIDTH,
	  cornerRadius: [0,18,18,0]
	});
	shape.add(Right_bulge);
	shape.add(Left_bulge);
	
	const Right_AlignLine = new Konva.Rect({
	  x: x+body_width+bulge_width-AlignLine_x_offset, 
	  y: y,	  
	  width: 3,	  height: 75,
	  stroke: STROKE_COLOR,	  strokeWidth: 3,	
	});
	const Left_AlignLine = new Konva.Rect({
	  x: x+bulge_width+AlignLine_x_offset,
	  y: y,	  
	  width: 3,	  height: 75,
	  stroke: STROKE_COLOR,	  strokeWidth: 3,	
	});
	const Bot_AlignLine = new Konva.Rect({
	  x: x+bulge_width,
	  y: y+Math.floor(0.5*body_height),	  
	  width: body_width,	  height: 2,
	  stroke: STROKE_COLOR,	  strokeWidth: 3,	
	});
	shape.add(Bot_AlignLine);
	shape.add(Right_AlignLine);
	shape.add(Left_AlignLine);

  return [shape];
}
export function Port_DVI({
  x = 150,
  y = 100
} = {}) {
	var ey = Port_D_subminiature ({
	  x : x,
	  y : y,
	  bulge_width : 120,
	  bulge_height : 160,
	  body_width : 550,
	  body_height : 220,
	  AlignLine_x_offset_ratio : 0.05
	});
	return ey;
};
export function Port_DSub({
  x = 150,
  y = 100
} = {}) {
	var ey = Port_D_subminiature ({
	  x : x,
	  y : y,
	  bulge_width : 135,
	  bulge_height : 155,
	  body_width : 385,
	  body_height : 200,
	  AlignLine_x_offset_ratio : 0.07
	});
	return ey;
};

export function Port_COM({
  x = 150,
  y = 100
} = {}) {
	var ey = Port_D_subminiature ({
	  x : x,
	  y : y,
	  bulge_width : 120,
	  bulge_height : 170,
	  body_width : 400,
	  body_height : 230,
	  AlignLine_x_offset_ratio : 0.04
	});
	return ey;
};
export function Port_Parallel({
  x = 150,
  y = 100
} = {}) {
	var ey = Port_D_subminiature ({
	  x : x,
	  y : y,
	  bulge_width : 120,
	  bulge_height : 160,
	  body_width : 1000,
	  body_height : 220,
	  AlignLine_x_offset_ratio : 0.05
	});
	return ey;
};