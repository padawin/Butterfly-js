/**
 * Drag and Drop classe Draggable
 * Version 1.2.1IE
 *
 */
if (!Butterfly.DragnDrop) {
    Butterfly.DragnDrop = {};
}

Butterfly.DragnDrop.Draggable = {

    /**
     *
     * creation of the draggable object
     *
     * @param id
     *            element's id
     * @param config array of config settings
     *          attached : true/false - has a shadow and can be dropped in a droppable
     *          fixed : horizontal/vertical/none // later
     *          handle : idOfTheHandle - can be grab from a special part only -- DONE
     *          prisoner : idOfTheBox - cant be out of the specified box
     */
    init : function(id, config)
    {
        var item = $id(id);
        // if the element exists
        if (item) {

            this.makeConfig(item,config);

            //defining events
            if(item.handle){
                Butterfly.addEvent($id(item.handle),'mousedown', this.mouseDownDraggable);
                Butterfly.addClass($id(item.handle),'handle');
            }
            else {
                Butterfly.addEvent(item,'mousedown', this.mouseDownDraggable);
                Butterfly.addClass(item,'handle');
                Butterfly.addClass(item,'draggable');
                Butterfly.addClass(item,'drag');
            }

            // adding in the draggables list
            this.listDraggables.push(item);
        }
    },

    /**
     * Function called when "onmousedown" event is fired on a draggable item
     * Creation of the current Dragged object "onmousemove" event added to the
     * document
     *
     */
    mouseDownDraggable : function(evt)
    {
        evt = evt || window.event;
        var target = evt.target || evt.srcElement;

        if (Butterfly.DragnDrop.Draggable.lastDragged) {
            Butterfly.DragnDrop.Draggable.lastDragged.style.zIndex = 98;
        }

        // setting the current dragged object
        Butterfly.DragnDrop.Draggable.dragObject = Butterfly.DragnDrop.Draggable.getDraggableInParents(target);

        Butterfly.DragnDrop.Draggable.lastDragged = Butterfly.DragnDrop.Draggable.dragObject;
        Butterfly.DragnDrop.Draggable.lastDragged.style.zIndex = 99;

        Butterfly.DragnDrop.Draggable.dragObject.style.left = Butterfly.getOffset(Butterfly.DragnDrop.Draggable.dragObject,'left') - Butterfly.getStyleValue(Butterfly.DragnDrop.Draggable.dragObject,'margin-left') + "px";
        Butterfly.DragnDrop.Draggable.dragObject.style.top = Butterfly.getOffset(Butterfly.DragnDrop.Draggable.dragObject,'top') - Butterfly.getStyleValue(Butterfly.DragnDrop.Draggable.dragObject,'margin-top') + "px";

        Butterfly.replaceClass(Butterfly.DragnDrop.Draggable.dragObject,'draggable', 'dragged', true);

        Butterfly.Mouse.setMouseOffset(Butterfly.DragnDrop.Draggable.dragObject, evt);

        // adding event to the document
        Butterfly.addEvent(document, 'mousemove', Butterfly.DragnDrop.Draggable.mouseMove);
        Butterfly.addEvent(window, 'mouseup', Butterfly.DragnDrop.Draggable.mouseUpDraggable);

        // if the item has to be dropped in a box
        if(Butterfly.DragnDrop.Draggable.dragObject.attached){
            Butterfly.DragnDrop.Draggable.initShadow();
        }

        if (evt.preventDefault) {
            evt.preventDefault();
        } else {
            evt.returnValue = false;
        }
        return false;
    },



    /**
     * Function called when "onmousemove" event is fired on a draggable item
     * Coordinates of Dragged object are updated
     * The position of the shadow is allthough updated
     *
     */
    mouseMove : function(evt)
    {
        if (!Butterfly.DragnDrop.Draggable.dragObject){
            return;
        }
        evt = evt || window.event;
        mousePos = Butterfly.Mouse.getMousePosition(evt);

        //check if dragObject is prisoner, if yes, move it only if mouse is in his prison
        if(Butterfly.DragnDrop.Draggable.dragObject.prison){
            var offsetDrag = Butterfly.getOffset(Butterfly.DragnDrop.Draggable.dragObject);
            var scrollLeft = Butterfly.getScrollLeft();
            var scrollTop = Butterfly.getScrollTop();
            var inPrison = offsetDrag['left'] <= Butterfly.DragnDrop.Draggable.dragObject.prison['left'] - scrollLeft &&
                offsetDrag['right'] > Butterfly.DragnDrop.Draggable.dragObject.prison['right'] - scrollLeft &&
                offsetDrag['top'] < Butterfly.DragnDrop.Draggable.dragObject.prison['top'] - scrollTop &&
                offsetDrag['bottom'] > Butterfly.DragnDrop.Draggable.dragObject.prison['bottom'] - scrollTop &&
                mousePos.x > Butterfly.DragnDrop.Draggable.dragObject.prison['left'] - scrollLeft &&
                mousePos.x < Butterfly.DragnDrop.Draggable.dragObject.prison['right'] - scrollLeft &&
                mousePos.y > Butterfly.DragnDrop.Draggable.dragObject.prison['top'] - scrollTop &&
                mousePos.y < Butterfly.DragnDrop.Draggable.dragObject.prison['bottom'] - scrollTop;
        }
        if((Butterfly.DragnDrop.Draggable.dragObject.prison && inPrison == true) || !Butterfly.DragnDrop.Draggable.dragObject.prison){
            // moving dragged object
            if (!Butterfly.DragnDrop.Draggable.dragObject.way || Butterfly.DragnDrop.Draggable.dragObject.way == 'y') {
                Butterfly.DragnDrop.Draggable.dragObject.style.top = Butterfly.getScrollTop() + mousePos.y - Butterfly.Mouse.mouseOffset.y - Butterfly.getStyleValue(Butterfly.DragnDrop.Draggable.dragObject, 'margin-top') + 10 + "px";
            }
            if (!Butterfly.DragnDrop.Draggable.dragObject.way || Butterfly.DragnDrop.Draggable.dragObject.way == 'x') {
                Butterfly.DragnDrop.Draggable.dragObject.style.left = Butterfly.getScrollLeft() + mousePos.x - Butterfly.Mouse.mouseOffset.x - Butterfly.getStyleValue(Butterfly.DragnDrop.Draggable.dragObject, 'margin-left') + 10 + "px";
            }
        }

        // if the item has to be dropped in a box
        if(Butterfly.DragnDrop.Draggable.dragObject.attached){
            Butterfly.DragnDrop.Draggable.updateShadow(mousePos);
        }

        if (evt.preventDefault) {
            evt.preventDefault();
        } else {
            evt.returnValue = false;
        }
        return false;
    },

    /**
     * Function called when "onmouseup" event is fired on a draggable item
     *
     */
    mouseUpDraggable : function(evt)
    {
        if (!Butterfly.DragnDrop.Draggable.dragObject) {
            return;
        }

        Butterfly.removeEvent(Butterfly.DragnDrop.Draggable.dragObject, 'mouseup', this.mouseUpDraggable);
        Butterfly.replaceClass(Butterfly.DragnDrop.Draggable.dragObject,'dragged', 'draggable', true);

        // if the item has to be dropped in a box
        if(Butterfly.DragnDrop.Draggable.dragObject.attached){
            Butterfly.DragnDrop.Draggable.dropDragObject();
        }
        else if(Butterfly.getStyle(Butterfly.DragnDrop.Draggable.dragObject,'position') != 'absolute'){
            Butterfly.DragnDrop.Draggable.dragObject.style.position = 'absolute';
        }

        Butterfly.DragnDrop.Draggable.dragObject = null;

        Butterfly.removeEvent(document, 'mousemove', Butterfly.DragnDrop.Draggable.mouseMove);
        Butterfly.removeEvent(window, 'mouseup', Butterfly.DragnDrop.Draggable.mouseUpDraggable);

        if (evt.preventDefault) {
            evt.preventDefault();
        } else {
            evt.returnValue = false;
        }
        return false;
    },

    /**
     *
     * To know if item is a child of a draggable
     * recursive call
     */
    getDraggableInParents : function(item)
    {
        if (Butterfly.DragnDrop.Draggable.listDraggables.indexOf(item) != -1) {
            return item;
        } else {
            return Butterfly.DragnDrop.Draggable.getDraggableInParents(item.parentNode);
        }
    },

    makeConfig : function(item,config)
    {
        //attached
        if(config.attached){
            item.attached = config.attached;
        }
        //fixed
        if(config.fixed && config.fixed != 'none'){
            item.fixed = config.fixed;
        }
        //handle
        if(config.handle && $id(config.handle)){
            item.handle = config.handle;
        }
        //prison
        if(config.prison && $id(config.prison)){
            item.prison = config.prison;
        }
        //way
        if(config.way && (config.way == 'y' || config.way == 'x')){
            item.way = config.way;
        }

    },

    initShadow : function()
    {
        Butterfly.DragnDrop.Draggable.dragObject.parentNode.insertBefore(Butterfly.DragnDrop.Draggable.shadow,Butterfly.DragnDrop.Draggable.dragObject);
        // settings of the shadow
        Butterfly.DragnDrop.Draggable.shadow.style.height = Butterfly.DragnDrop.Draggable.dragObject.offsetHeight -
            Butterfly.getStyleValue(Butterfly.DragnDrop.Draggable.shadow,'border-top-width') -
            Butterfly.getStyleValue(Butterfly.DragnDrop.Draggable.shadow,'border-bottom-width') + "px";

        Butterfly.DragnDrop.Draggable.shadow.style.width = Butterfly.DragnDrop.Draggable.dragObject.offsetWidth -
            Butterfly.getStyleValue(Butterfly.DragnDrop.Draggable.shadow,'border-left-width') -
            Butterfly.getStyleValue(Butterfly.DragnDrop.Draggable.shadow,'border-right-width') + "px";

        Butterfly.DragnDrop.Draggable.shadow.style.marginLeft = Butterfly.getStyle(Butterfly.DragnDrop.Draggable.dragObject,'margin-left');
        Butterfly.DragnDrop.Draggable.shadow.style.marginRight = Butterfly.getStyle(Butterfly.DragnDrop.Draggable.dragObject,'margin-right');
        Butterfly.DragnDrop.Draggable.shadow.style.marginTop = Butterfly.getStyle(Butterfly.DragnDrop.Draggable.dragObject,'margin-top');
        Butterfly.DragnDrop.Draggable.shadow.style.marginBottom = Butterfly.getStyle(Butterfly.DragnDrop.Draggable.dragObject,'margin-bottom');
    },

    updateShadow : function(mousePos)
    {
        var inDrop = Butterfly.DragnDrop.Droppable.mouseIn(mousePos);
        // if mouse is above a droppable
        if (inDrop != null) {
            inDrop.appendChild(Butterfly.DragnDrop.Draggable.shadow);
            inDrag = Butterfly.DragnDrop.Droppable.mouseOverDrag(mousePos, inDrop);
            // if mouse is above a draggable child of inDrop
            if (inDrag != null) {
                inDrop.insertBefore(Butterfly.DragnDrop.Draggable.shadow, inDrag);
            }
        }
    },

    dropDragObject : function()
    {
        var oldDrop = Butterfly.DragnDrop.Draggable.dragObject.parentNode;
        Butterfly.DragnDrop.Draggable.shadow.parentNode.insertBefore(Butterfly.DragnDrop.Draggable.dragObject,
                Butterfly.DragnDrop.Draggable.shadow);
        Butterfly.DragnDrop.Draggable.shadow.parentNode.removeChild(Butterfly.DragnDrop.Draggable.shadow);

        if (Butterfly.DragnDrop.Draggable.dragObject.parentNode.ondrop) {
            var event = {
                'drag': Butterfly.DragnDrop.Draggable.dragObject,
                'oldDrop': oldDrop,
                'newDrop': Butterfly.DragnDrop.Draggable.dragObject.parentNode
            };
            funct = Butterfly.DragnDrop.Draggable.dragObject.parentNode.ondrop(event);
        }
    },

    // Creation of the shadow used when an item is moved
    shadow : Butterfly.create('div', {
        'id' : 'shadow'
    }),

    listDraggables : new Array(),

    dragObject : null,

    lastDragged : null
};
