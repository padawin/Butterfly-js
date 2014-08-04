(function(window, document){
	if (!window.B) throw 'B is needed to use JsFrame';
	if (!window.B.Ajax) throw 'B.Ajax is needed to use JsFrame';

	var B=window.B,
		div='div'
		,create = 'create'
		,h = window.scrollMaxY + window.innerHeight
		,framesContainer = B[create](div, {id:'jsframes'}, document.body)
		,framesBackground = B[create](div, {'class':'jsframe-background jsframe-closed', style:'height:'+h+'px'}, framesContainer)
		,albums = {}

		,eventOptions = {skipEvent:true,scope:this}

		,firstChild = 'firstChild'
		,addEvent = 'addEvent'
		,removeChild = 'removeChild'
		,insertBefore = 'insertBefore'
		,style = 'style'
		,children = 'children'
		,classJsFrameClosed = 'jsframe-closed'

	,frame = function(target) {
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
		framesContainer.parentNode || document.body.appendChild(framesContainer);

		this.target=B.$id(target);
		if(!this.target)throw 'Unknown target to create the JsFrame';

		this.frame=B[create](div,{'class':'jsframe jsframe-closed'},framesContainer);
		var click='click'
			,frameImg=B[create](div,{'class':'jsframe-content'},this.frame)
			,frameControls=B[create](div,{'class':'jsframe-controls'},this.frame)
			,closeText=B[create]('span',{text:'fermer','class':'jsframe-close'},frameControls),
			rel, framePrevious, frameNext;

		//events to open and close the frame
		B[addEvent](closeText,click,this.close,eventOptions);
		B[addEvent](this.target,click,open,eventOptions);

		//collection of frames
		if(B.exists(this.target.getAttribute('rel')) && this.target.getAttribute('rel')!='') {
			rel=this.target.getAttribute('rel');
			if(albums[rel]==null) albums[rel]=[];
			albums[rel][albums[rel].length]=this;

			this.albumIndex=albums[rel].length - 1;
			framePrevious=B[create](div,{'class':'jsframe-previous'},frameImg);
			frameNext=B[create](div,{'class':'jsframe-next'},frameImg);
			B[addEvent](framePrevious,click,previous.bind(this),eventOptions);
			B[addEvent](frameNext,click,next.bind(this),eventOptions);
		}
	}

	,resizePicture = function(parent) {
		if (parent[children][0].offsetHeight > window.innerHeight) {
			parent[children][0][style].height = window.innerHeight - 100 + 'px';
		}
		parent.parentNode[style].width = parent[children][0].offsetWidth + 'px';
		parent[style].height = parent[children][0].offsetHeight + 'px';

		var height;
		if (window.scrollMaxY) {
			height = window.scrollMaxY + window.innerHeight;
		}
		else {
			height = document.documentElement.clientHeight;
		}
		framesBackground[style].height = height + 'px';
	}

	,close = function() {
		framesContainer[style].width = '0px';
		framesContainer[style].height = '0px';
		B.addClass(this.frame, classJsFrameClosed);
		B.addClass(framesBackground, classJsFrameClosed);

		if (!document.all && this.target.getAttribute('rel') != '') {
			//keyboard events
			B.removeEvent(window, 'keypress', changeFrameWithKeyboard.bind(this), {'scope' : this});
		}
	}

	,changeFrameWithKeyboard = function(event) {
		event = event || window.event;
		var actions = {37: previous, 39: next};
		actions[event.keyCode] && actions[event.keyCode].apply(this);
	}

	,next = function(total) {
		changeFrame.apply(this, [1]);
	},

	previous = function() {
		changeFrame.apply(this, [-1]);
	}

	,changeFrame = function(way, index, total) {
		total = albums[this.target.getAttribute('rel')].length;
		close.apply(this);
		albums[this.target.getAttribute('rel')][(total + this.albumIndex + way) % total].open();

	};

	frame.prototype.open = function(){
		framesContainer[style].width = framesContainer[style].height = '100%';

		B.removeClass(this.frame,classJsFrameClosed);
		B.removeClass(framesBackground,classJsFrameClosed);
		B[addEvent](framesBackground,'click',close,eventOptions);

		var url=B.exists(this.target.getAttribute('alt')) && this.target.getAttribute('alt') || null,
			alt=this.target.alt
			,parent=this.frame[children][0]
			,childrenNumber=this.albumIndex!=null?2:0
			,loading
			,timeout
			,content, image = false;

		if(!B.exists(url) || url=='')
			throw 'No content specified';
		//if the frame has never been displayed before, load the content
		//2 if next and previous
		//0 else
		else if(this.frame[children][0][children].length!=childrenNumber){
			parent[children][0][style].height=null;
			resizePicture(parent);
		}
		else{
			loading=B[create](div,{'class':'jsframe-loading'});
			this.frame[children][0][insertBefore](loading,this.frame[children][0][firstChild]);

			url=url.split('|');
			//image to be displayed

			if(url.length==1 || url[0]=='image'){
				content=B[create]('img',{alt:alt});
				B.Ajax.request(url,{},{},'GET',{},{async:false});
				content.src=url;
				timeout=setInterval(
					function(){
						if(content.complete){
							clearInterval(timeout);
							if(parent[firstChild])
								parent[removeChild](parent[firstChild]);
							parent[insertBefore](content,parent[firstChild]);
							resizePicture.apply(this, [parent]);
						}
					},100
				);
				image=true;
			}
			//html to be displayed
			else{
				content = B[create](div);
				B.Ajax.update(content,url[1],true);
				if(parent[firstChild])
					parent[removeChild](parent[firstChild]);
				parent[insertBefore](content, parent[firstChild]);
				parent[style].width='100%';
				parent[style].height='auto';
			}
		}

		//keyboard events
		if(!document.all && this.target.getAttribute('rel')!='')
			B[addEvent](window,'keypress',changeFrameWithKeyboard.bind(this),{'scope':this});
	};

	B.JsFrame=frame;
})(window, document);
