import {GRID_RES, DEFAULT_X, DEFAULT_Y} from './konva_config.js';
export function get_transform_node (Konva, rotateEnabled){
	const tr = new Konva.Transformer({
	  rotateEnabled: rotateEnabled,
		enabledAnchors: [],  
	});
	tr.nodes([]); //start detached
	return tr;
}
export function addPort(factoryFn, layer, x = DEFAULT_X, y = DEFAULT_Y) {
	const [port] = factoryFn({
		x: x,
		y: y
	});

	port.dragBoundFunc(function(pos) 
	{
		const ctrl = window.event?.ctrlKey;
		if (ctrl) return pos; //No snap-in if holding ctrl

		return {
			x: Math.round(pos.x / GRID_RES) * GRID_RES,
			y: Math.round(pos.y / GRID_RES) * GRID_RES
		};
	});
	layer.add(port);
	layer.draw();
}


export function right_click_remove_shape (e, stage, Konva, tr, layer)
// Will be assigned to a Konva layer, 
//   Behavior: 	Show Transformation layer when a shape is right clicked, 
//				else just show normal browser context menu.
{
  const target = e.target;
  if (target === stage) return; // Right-click on empty canvas -> allow browser menu
  // Otherwise, right-clicked a shape
  e.evt.preventDefault();
  const temp_group = target.getParent();
  if (!(temp_group instanceof Konva.Group)) return;
  temp_group.destroy();
  tr.nodes([]);
  layer.draw();
};


export function left_click_show_transformer  (e, stage, Konva, tr, layer)
{
	// Click on empty canvas, remove transformer
	if (e.target === stage) {
		tr.nodes([]);
		layer.draw();
		return;
	}
	// Clicked on a shape, attach transformer
	const group = e.target.getParent();
	if (!(group instanceof Konva.Group)) return;
	if (group instanceof Konva.Transformer) return; // already attached
	tr.nodes([group]);
	layer.draw();
};