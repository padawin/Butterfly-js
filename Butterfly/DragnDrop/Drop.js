/**
 * Drag and Drop classe Droppable
 * Version 1.2.1IE
 *
 */
if (!Butterfly.DragnDrop) {
    Butterfly.DragnDrop = {};
}

Butterfly.DragnDrop.Droppable = {
    init : function(id, ondrop)
    {
        var item = $id(id);
        item.ondrop = ondrop;
        this.listDroppables.push(item);
    },

    mouseIn : function(mouse){
        var trouve = null;
        var offset;
        for(var i = 0 ; i < Butterfly.DragnDrop.Droppable.listDroppables.length ; i ++){
            offset = Butterfly.getOffset(Butterfly.DragnDrop.Droppable.listDroppables[i]);
            if(
                mouse.x > offset['left'] - Butterfly.getScrollLeft() &&
                mouse.x < offset['right'] - Butterfly.getScrollLeft() &&
                mouse.y > offset['top'] - Butterfly.getScrollTop() &&
                mouse.y < offset['bottom'] - Butterfly.getScrollTop() &&
                (trouve == null || offset['left'] > Butterfly.getOffset(trouve)['left'])
            ){
                trouve = Butterfly.DragnDrop.Droppable.listDroppables[i];
                break;
            }
        }
        return trouve;
    },

    mouseOverDrag : function(mouse,drop){
        var trouve = null;
        var childrenDrop = Butterfly.getElementsByClassName('drag',drop);
        if(childrenDrop != null){
            for(var i = 0 ; i < childrenDrop.length ; i ++){
                if(childrenDrop[i] != Butterfly.DragnDrop.Draggable.dragObject){
                    offset = Butterfly.getOffset(childrenDrop[i]);
                    if(
                        mouse.x > offset['left'] - 2 - Butterfly.getScrollLeft() &&
                        mouse.x < offset['right'] + 2 - Butterfly.getScrollLeft() &&
                        mouse.y > offset['top'] - 2 - Butterfly.getScrollTop() &&
                        mouse.y < offset['bottom'] + 2 - Butterfly.getScrollTop()
                    ){
                        trouve = childrenDrop[i];
                        break;
                    }
                }
            }
        }
        //if dragged object is above the shadow
        if(trouve === null && Butterfly.DragnDrop.Draggable.shadow !== null && Butterfly.DragnDrop.Draggable.shadow != undefined){
            offsetshadow = Butterfly.getOffset(Butterfly.DragnDrop.Draggable.shadow);
            if(
                mouse.x > offsetshadow['left'] - Butterfly.getScrollLeft() &&
                mouse.x < offsetshadow['right'] - Butterfly.getScrollLeft() &&
                mouse.y > offsetshadow['top'] - Butterfly.getScrollTop() &&
                mouse.y < offsetshadow['bottom']-Butterfly.getScrollTop()
            ){
                trouve = Butterfly.DragnDrop.Draggable.shadow;
            }
        }
        return trouve;
    },

    isDroppable : function(item)
    {
        return (this.listDroppables.indexOf(item) != -1);
    },

    listDroppables : new Array()
}
