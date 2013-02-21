/**
 * class Mouse
 * 
 */

Butterfly.Mouse = {
	// get the position of the mouse 
	setMouseOffset : function(item, evt)
	{
	   evt = evt || window.event;
	   var mousePos = Butterfly.Mouse.getMousePosition(evt);
	   var x = mousePos.x - item.offsetLeft + Butterfly.getScrollLeft();
	   var y = mousePos.y - item.offsetTop + Butterfly.getScrollTop();
	   this.mouseOffset = {'x' : x, 'y' : y};
	},
	
	getMousePosition : function(evt)
	{
	  evt = evt || window.event;
	  var x,y;
	  x = parseInt(evt.clientX);
	  y = parseInt(evt.clientY);
	  return {'x' : x, 'y' : y};
	},
	
	mouseOffset : {}
};
