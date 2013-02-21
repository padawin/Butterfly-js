/**
 * Butterfly.js file
 * Version 1.2.1IE
 *
 */

/**
 * Return the element of ID id, null if doesn't exist
 *
 * @return HTMLELement
 */
function $id(id) {
    return Butterfly.$id(id);
}

/**
 * @TODO : alias de getElementsByClassName
 */
function $class(c,node) {
    return Butterfly.getElementsByClassName(c,node);
}

/**
 * Butterfly Class
 *
 */
var Butterfly = {};

/**
 * Return the element of ID id, null if doesn't exist
 *
 */
Butterfly.$id = function(id)
{
    if (typeof id == "string" && id != '') {
        return document.getElementById(id);
    } else if (id === '' || ! Butterfly.exists(id)) {
        return null;
    } else {
        return id;
    }
}

/**
 * Return the index or the key of searchedValue in this if searchedValue is
 * in item, -1 else
 *
 */
Butterfly.indexOf = function(arr, searchedValue)
{
    var index = -1;
    for ( var i in arr) {
        if (arr[i] == searchedValue) {
            index = i;
            break;
        }
    }
    return index;
}

/**
 * Create an element name with attributes given in params if parent is
 * defined, the created element is appended into parent
 */
Butterfly.create = function(name, attributes, parent)
{
    var elem;
    if (name == 'text') {
        elem = document.createTextNode(attributes['value']);
    } else {
        elem = document.createElement(name);
        for ( var cle in attributes) {
            switch (cle) {
            default:
                elem.setAttribute(cle, attributes[cle]);
                break;
            case 'id':
                if ($id(attributes[cle]) == null
                        || $id(attributes[cle]) == undefined) {
                    elem.setAttribute('id', attributes[cle]);
                }
                break;
            case 'style':
            case 'cssText':
                // doesn't seem to work with IE
                elem.setAttribute('cssText', attributes[cle]);
                elem.setAttribute('style', attributes[cle]);
                break;
            case 'class':
            case 'className':
                Butterfly.setClass(elem, attributes[cle]);
                break;
            case 'text':
                elem.appendChild(document.createTextNode(attributes[cle]));
                break;
            }
        }
    }

    //@TODO rewrite this part
    //if the parent is given, the created node will be put in it
    if (Butterfly.exists($id(parent)) || parent && Butterfly.exists($id(parent.element))) {
        if (Butterfly.exists(parent.element)) {

            //if the elem has to be inserted before an element
            if (Butterfly.exists($id(parent.before))) {
                $id(parent.element).insertBefore(elem, $id(parent.before));
            }

            //else if it has to be inserted after an element
            else if (Butterfly.exists($id(parent.after)) && Butterfly.exists($id(parent.after).nextSibling)) {
                $id(parent.element).insertBefore($id(parent.after).nextSibling);
            }

            //else append
            else {
                $id(parent.element).appendChild(elem);
            }
        }
        else {
            $id(parent).appendChild(elem);
        }
    }
    return elem;
}

/**
 * Append all the elements of the array children in item
 *
 */
Butterfly.appendChildren = function(item, children)
{
    var lC = children.length;
    var item = $id(item);
    for ( var i = 0; i < lC; i++) {
        item.appendChild(children[i]);
    }
}

/**
 * Add an event to item. The event is fired on 'event' and execute 'action'
 * option can have the following keyes :
 *  - skipEvent : if the called function does not need the event in the args
 *  - scope : if the scope used must be changed
 *  - propagate : boolean, to set the value in addEventListener Args are the called function's args
 *
 * Add management for specials events such as DOMMouseScroll <=> onmousewheel
 */
Butterfly.addEvent = function(item, event, action, options, args)
{
    var opt = options || {};
    var args = args || new Array();
    var fct = function(evt) {
        if (opt['skipEvent'] == null || opt['skipEvent'] == undefined
                || opt['skipEvent'] == false) {
            action.apply(opt['scope'], args.concat( [ evt ]));
        } else {
            action.apply(opt['scope'], args);
        }
    };

    item[event + action] = fct;

    if (item.addEventListener) {
        var propagate = false;
        if ((opt['propagate'] == null || opt['propagate'] == undefined)
                && opt['propagate'] == true) {
            propagate = true;
        }
        item.addEventListener(event, item[event + action], propagate);
    }
    else if (item.attachEvent) {
        item.attachEvent('on' + event, item[event + action]);
    }

}

/**
 * Remove the action 'action' from the events of item fired on 'event'
 * option can have the following keyes : - skipEvent : if the called
 * function does not need the event in the args - scope : if the scope used
 * must be changed - propagate : boolean, to set the value in
 * removeEventListener Args are the called function's args
 *
 */
Butterfly.removeEvent = function(item, event, action, options, args)
{
    var opt = options || {};
    var args = args || new Array();
    var fct = function(evt) {
        if (opt['skipEvent'] == null || opt['skipEvent'] == undefined
                || opt['skipEvent'] == false) {
            action.apply(opt['scope'], args.concat( [ evt ]));
        } else {
            action.apply(opt['scope'], args);
        }
    };

    if (item.removeEventListener) {
        var propagate = false;
        if ((opt['propagate'] == null || opt['propagate'] == undefined)
                && opt['propagate'] == true) {
            propagate = true;
        }
        item.removeEventListener(event, item[event + action], propagate);
    }
    else if (item.detachEvent) {
        item.detachEvent('on' + event, item[event + action]);
    }

    delete item[event + action];
}

/**
 * Return the scroll distance from the top of the page
 */
Butterfly.getScrollTop = function()
{
    return (document.body.scrollTop > 0 ? document.body.scrollTop
            : document.documentElement.scrollTop);
}

/**
 * Return the scroll distance from the left of the page
 */
Butterfly.getScrollLeft = function()
{
    return (document.body.scrollLeft > 0 ? document.body.scrollLeft
            : document.documentElement.scrollLeft);
}

/**
 * Return true if the coordinates are in the offset. offset MUST be
 * associative array with keys : left, right, top, bottom or object with
 * properties left, right, top, bottom. coordinates MUST be associative
 * array with keys : x and y or object with properties x and y
 *
 */
Butterfly.inOffset = function(coordinates, offset, margin)
{
    var margin = (margin ? margin : 0);
    return coordinates['x'] > offset['left'] - margin
            && coordinates['x'] < offset['right'] + margin
            && coordinates['y'] > offset['top'] - margin
            && coordinates['y'] < offset['bottom'] + margin;
}

/**
 * Return the style property styleProp of item
 *
 */
Butterfly.getStyle = function(item, styleProp)
{
    if (item.currentStyle) {
        styleProp = styleProp.replace(/\-(\w)/g, function(strMatch, p1) {
            return p1.toUpperCase();
        });
        var y = item.currentStyle[styleProp];
    } else if (window.getComputedStyle) {
        styleProp = styleProp.replace(/([A-Z])/g, function(strMatch, p1) {
            return "-" + p1.toLowerCase();
        });
        var y = document.defaultView.getComputedStyle(item, null)
                .getPropertyValue(styleProp);
    }
    return y;
}

/**
 * Return the numeric value of the style styleProp (eg : '1px' will return
 * '1') Work only with px
 *
 */
Butterfly.getStyleValue = function(item, styleProp)
{
    return Butterfly.getStyle(item, styleProp).replace(new RegExp('(px)$'),
            '');
}

/**
 * Return the four edges of an element.
 *
 * @TODO some other tests
 *
 */
Butterfly.getOffset = function(item, side)
{
    var minX = minY = 0;
    item = $id(item);

    var obj = item;

    do {
        minX += obj.offsetLeft;
        minY += obj.offsetTop;
    } while (obj = obj.offsetParent);

    var maxX = minX + item.offsetWidth;
    var maxY = minY + item.offsetHeight;

    var offsets = {
        'left' : minX,
        'right' : maxX,
        'top' : minY,
        'bottom' : maxY
    };
    if (side != null && side != undefined) {
        return offsets[side];
    } else {
        return offsets;
    }
}

/**
 * Return true if item has c in his css classes
 *
 */
Butterfly.hasClass = function(item, c)
{
    var item = $id(item);

    if (Butterfly.exists(item) && item.getAttribute('class')) {
        return item.getAttribute('class').match(new RegExp(
                '(?:\\s|^)' + c + '(?:\\s|$)'));
    } else {
        return false;
    }
}

/**
 * Add the css class c to item if item hasn't it
 *
 */
Butterfly.addClass = function(item, c)
{
    if (!this.hasClass(item, c)) {
        var className = item.getAttribute((document.all ? 'className'
                : 'class')) || '';
        item.setAttribute('class', className + ' ' + c);
        item.setAttribute('className', className + ' ' + c);
    }
}

/**
 * Remove the class c from item
 *
 */
Butterfly.removeClass = function(item, c) {
    var item = $id(item);
    if (item != null && item != undefined) {
        var className = item.getAttribute(
                (document.all ? 'className' : 'class')).replace(
                new RegExp('(?:\\s|^)' + c + '(?:\\s|$)'), ' ');
        item.setAttribute('class', className);
        item.setAttribute('className', className);
    }
}

/**
 * Replace the class cOld from item to cNew If append is true and cOld
 * doesn't exist in item, cNew will be added to it
 *
 */
Butterfly.replaceClass = function(item, cOld, cNew, append)
{
    var item = $id(item);
    if (item != null && item != undefined) {
        var className = item.getAttribute((document.all ? 'className'
                : 'class'));
        if (this.hasClass(item, cOld)) {
            className = className.replace(new RegExp(
                    '(?:\\s|^)' + cOld + '(?:\\s|$)'), ' ' + cNew + ' ');
            item.setAttribute('class', className);
            item.setAttribute('className', className);
        } else if (append == true) {
            this.addClass(item, cNew);
        }
    }
}

/**
 * Define c as item's css class
 *
 */
Butterfly.setClass = function(item, c)
{
    var item = $id(item);
    if (item != null && item != undefined) {
        item.setAttribute('class', c);
        item.setAttribute('className', c);
    }
}

/**
 * Return a collection of node which have a cdd class c
 *
 */
Butterfly.getElementsByClassName = function(c, node)
{
    if (!node) {
        var node = document;
    } else if (typeof (node) == 'string') {
        var node = $id(node);
    }

    if (node != null && node != undefined) {
        var result = new Array();
        // IE
        if (document.all) {
            if (node.hasChildNodes()) {
                var list = node.childNodes;
                for ( var i = 0; i < list.length; i++) {
                    if (list[i].getAttribute('className').match(
                            new RegExp('(?:\\s|^)' + c + '(?:\\s|$)')) != null) {
                        result.push(list[i]);
                    }
                    result = result.concat(Butterfly
                            .getElementsByClassName(c, list[i]));
                }
            }
        }
        // other browsers
        else {
            var elements = document.evaluate((node == document ? '//' : '')
                    + '*[contains(concat(" ",@class," ")," ' + c + ' ")]',
                    node, null, XPathResult.ANY_TYPE, null);
            while (element = elements.iterateNext()) {
                result.push(element);
            }
        }
        return result;
    } else {
        return null;
    }
}

Butterfly.exists = function(variable)
{
    return variable != null && variable != undefined;
}

Butterfly.stringToXml = function(str)
{
    if (window.ActiveXObject){
        var xml = new ActiveXObject('Microsoft.XMLDOM');
        xml.async='false';
        xml.loadXML(str);
    }
    else {
        var parser = new DOMParser();
        var xml = parser.parseFromString(str,'text/xml');
    }

    return xml.childNodes;
};

Function.prototype.bind = function(obj)
{
    var slice = [].slice;
    args = slice.call(arguments, 1);
    self = this;
    nop = function(){};
    bound = function()
    {
        return self.apply(
            this instanceof nop ? this : ( obj || {} ),
            args.concat(slice.call(arguments))
        );
    };

    nop.prototype = self.prototype;
    bound.prototype = new nop();
    return bound;
};
