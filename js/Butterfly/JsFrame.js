/**
 * Construct
 */
Butterfly.JsFrame = function(target)
{
    //if no frame exists yet
    //Create it
    if (!Butterfly.JsFrame.frames) {
        var height = window.scrollMaxY + window.innerHeight;
        Butterfly.JsFrame.frames = Butterfly.create('div', {id: 'jsframes'}, document.body);
        Butterfly.JsFrame.framesBackground = Butterfly.create(
            'div',
            {
                'class': 'jsframe-background jsframe-closed',
                style: 'height:' + height + 'px'
            },
            Butterfly.JsFrame.frames
        );
    }

    /*
     * Creation of the frame
     *
     * <div class="jsframe">
            <div class="jsframe-img"></div>
            <div class="jsframe-controls">
            </div>
            <div class="jsframe-previous"></div>
            <div class="jsframe-next"></div>
        </div>
     *
     *
     */
    this.target = target;
    this.frame = Butterfly.create('div', {'class': 'jsframe jsframe-closed'}, Butterfly.JsFrame.frames);
    var frameImg = Butterfly.create('div', {'class': 'jsframe-content'}, this.frame);
    var frameControls = Butterfly.create('div', {'class': 'jsframe-controls'}, this.frame);
    var closeText = Butterfly.create('span', {text: 'fermer', 'class': 'jsframe-close'}, frameControls);

    //events to open and close the frame
    Butterfly.addEvent(closeText, 'click', this.close, {skipEvent: true, scope: this});
    Butterfly.addEvent(this.target, 'click', this.open, {skipEvent: true, scope: this});

    //collection of frames
    if (target.getAttribute('rel') != '' && target.getAttribute('rel') != undefined && target.getAttribute('rel') != null) {
        var rel = target.getAttribute('rel');
        if (Butterfly.JsFrame.albums == null ) {
            Butterfly.JsFrame.albums = {};
        }
        if (Butterfly.JsFrame.albums[rel] == null) {
            Butterfly.JsFrame.albums[rel] = [];
        }
        Butterfly.JsFrame.albums[rel][Butterfly.JsFrame.albums[rel].length] = this;

        this.albumIndex = Butterfly.JsFrame.albums[rel].length - 1;
        var framePrevious = Butterfly.create('div', {'class': 'jsframe-previous'}, frameImg);
        var frameNext = Butterfly.create('div', {'class': 'jsframe-next'}, frameImg);
        Butterfly.addEvent(framePrevious, 'click', this.previous, {skipEvent: true, scope: this});
        Butterfly.addEvent(frameNext, 'click', this.next, {skipEvent: true, scope: this});
    }
}

/**
 *
 * Method called when a frame is to be displayed
 *
 */
Butterfly.JsFrame.prototype.open = function()
{
    Butterfly.JsFrame.frames.style.width = '100%';
    Butterfly.JsFrame.frames.style.height = '100%';

    Butterfly.removeClass(this.frame, 'jsframe-closed');
    Butterfly.removeClass(Butterfly.JsFrame.framesBackground, 'jsframe-closed');
    Butterfly.addEvent(Butterfly.JsFrame.framesBackground, 'click', this.close, {skipEvent: true, scope: this});

    var url;
    if (Butterfly.exists(this.target.getAttribute('alt'))) {
        url = this.target.getAttribute('alt');
    }

    var alt = this.target.alt;
    var parent = this.frame.children[0];
    var img;

    var childrenNumber = this.albumIndex != null ? 2 : 0;

    if (url == '' || url == undefined || url == null) {
        alert('No content specified');
    }
    //if the frame has never been displayed before, load the content
    //2 if next and previous
    //0 else
    else if (this.frame.children[0].children.length == childrenNumber) {
        var loading = Butterfly.create('div', {'class': 'jsframe-loading'});
        this.frame.children[0].insertBefore(loading, this.frame.children[0].firstChild);

        url = url.split('|');

        var content;
        var image = false;
        //image to be displayed
        if (url.length == 1 || url[0] == 'image') {
            content = Butterfly.create('img', {alt: alt});
            Butterfly.Ajax.request(url, {}, {}, 'GET', {}, {async: false});
            content.src = url;
            timeout = setInterval(
                function()
                {
                    if (content.complete) {
                        clearInterval(timeout);
                        if (parent.firstChild) {
                            parent.removeChild(parent.firstChild);
                        }
                        parent.insertBefore(content, parent.firstChild);
                        Butterfly.JsFrame.resizePicture(parent);
                    }
                },
                100
            );
            image = true;
        }
        //html to be displayed
        else {
            content = Butterfly.create('div');
            Butterfly.Ajax.update(content, url[1], true);
            if (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }
            parent.insertBefore(content, parent.firstChild);
            parent.style.width = '100%';
            parent.style.height = 'auto';
        }
    }
    else {
        parent.children[0].style.height = null;

        Butterfly.JsFrame.resizePicture(parent);
    }

    if (!document.all && this.target.getAttribute('rel') != '') {
        //keyboard events
        Butterfly.addEvent(window, 'keypress', Butterfly.JsFrame.changeFrameWithKeyboard, {'scope' : this});
    }
}

Butterfly.JsFrame.resizePicture = function(parent)
{
    if (parent.children[0].offsetHeight > window.innerHeight) {
        parent.children[0].style.height = window.innerHeight - 100 + 'px';
    }
    parent.parentNode.style.width = parent.children[0].offsetWidth + 'px';
    parent.style.height = parent.children[0].offsetHeight + 'px';

    if (window.scrollMaxY) {
        var height = window.scrollMaxY + window.innerHeight;
    }
    else {
        var height = document.documentElement.clientHeight;
    }
    Butterfly.JsFrame.framesBackground.style.height = height + 'px';
};

Butterfly.JsFrame.prototype.close = function()
{
    Butterfly.JsFrame.frames.style.width = '0px';
    Butterfly.JsFrame.frames.style.height = '0px';
    Butterfly.addClass(this.frame, 'jsframe-closed');
    Butterfly.addClass(Butterfly.JsFrame.framesBackground, 'jsframe-closed');

    if (!document.all && this.target.getAttribute('rel') != '') {
        //keyboard events
        Butterfly.removeEvent(window, 'keypress', Butterfly.JsFrame.changeFrameWithKeyboard, {'scope' : this});
    }
}


Butterfly.JsFrame.prototype.next = function()
{
    var index = this.albumIndex == Butterfly.JsFrame.albums[this.target.getAttribute('rel')].length - 1 ? 0 : this.albumIndex + 1;
    this.close();
    Butterfly.JsFrame.albums[this.target.getAttribute('rel')][index].open();
}

Butterfly.JsFrame.prototype.previous = function()
{
    var index = this.albumIndex == 0 ? Butterfly.JsFrame.albums[this.target.getAttribute('rel')].length - 1 : this.albumIndex - 1;
    this.close();
    Butterfly.JsFrame.albums[this.target.getAttribute('rel')][index].open();
}

Butterfly.JsFrame.changeFrameWithKeyboard = function(event)
{
    event = event || window.event;

    //previous
    if (event.keyCode == 37) {
        this.previous();
    }
    //next
    else if (event.keyCode == 39) {
        this.next();
    }
}
