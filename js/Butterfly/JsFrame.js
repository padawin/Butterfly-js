(function(){
	var B=window.B;
	if (!B) throw 'B is needed to use JsFrame';
	if (!B.Ajax) throw 'B.Ajax is needed to use JsFrame';

	var div='div'
		,h=window.scrollMaxY+window.innerHeight
		,framesContainer=B.create(div, {id:'jsframes'}, document.body)
		,framesBackground=B.create(div,{class:'jsframe-background jsframe-closed',style:'height:'+h+'px'},framesContainer);


	function open(f){
		framesContainer.style.width = framesContainer.style.height = '100%';

		B.removeClass(f.frame,'jsframe-closed');
		B.removeClass(framesBackground,'jsframe-closed');
		B.addEvent(framesBackground,'click',close,{skipEvent:true,scope:f},[f]);

		var url=B.exists(f.target.getAttribute('alt')) && f.target.getAttribute('alt') || null;

		var alt=f.target.alt
			,parent=f.frame.children[0]
			,childrenNumber=this.albumIndex!=null?2:0
			,img;

		if(!B.exists(url) || url=='')
			throw 'No content specified';
		//if the frame has never been displayed before, load the content
		//2 if next and previous
		//0 else
		else if(f.frame.children[0].children.length!=childrenNumber){
			parent.children[0].style.height=null;
			B.JsFrame.resizePicture(parent);
		}
		else{
			var loading=B.create(div,{class:'jsframe-loading'});
			this.frame.children[0].insertBefore(loading,this.frame.children[0].firstChild);

			url=url.split('|');

			var content, image=false;
			//image to be displayed
			if(url.length==1 || url[0]=='image'){
				content=B.create('img',{alt:alt});
				B.Ajax.request(url,{},{},'GET',{},{async:false});
				content.src=url;
				timeout=setInterval(
					function(){
						if(content.complete){
							clearInterval(timeout);
							if(parent.firstChild)
								parent.removeChild(parent.firstChild);
							parent.insertBefore(content,parent.firstChild);
							B.JsFrame.resizePicture(parent);
						}
					},100
				);
				image=true;
			}
			//html to be displayed
			else{
				content = B.create(div);
				B.Ajax.update(content,url[1],true);
				if(parent.firstChild)
					parent.removeChild(parent.firstChild);
				parent.insertBefore(content, parent.firstChild);
				parent.style.width='100%';
				parent.style.height='auto';
			}
		}

		//keyboard events
		if(!document.all && this.target.getAttribute('rel')!='')
			B.addEvent(window,'keypress',B.JsFrame.changeFrameWithKeyboard,{'scope':this});
	}

	var frame=function(target){
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
		this.target=B.$id(target);
		if(!this.target)throw 'Unknown target to create the JsFrame';

		this.frame=B.create(div,{class:'jsframe jsframe-closed'},framesContainer);
		var click='click'
			,frameImg=B.create(div,{class:'jsframe-content'},this.frame)
			,frameControls=B.create(div,{class:'jsframe-controls'},this.frame)
			,closeText=B.create('span',{text:'fermer',class:'jsframe-close'},frameControls);

		//events to open and close the frame
		B.addEvent(closeText,click,this.close,{skipEvent:true,scope:this});
		B.addEvent(this.target,click,open,{skipEvent:true,scope:this},[this]);

		//collection of frames
		if(B.exists(this.target.getAttribute('rel')) && this.target.getAttribute('rel')!='') {
			var rel=this.target.getAttribute('rel');
			if(B.JsFrame.albums==null) B.JsFrame.albums={};
			if(B.JsFrame.albums[rel]==null) B.JsFrame.albums[rel]=[];
			B.JsFrame.albums[rel][B.JsFrame.albums[rel].length]=this;

			this.albumIndex=B.JsFrame.albums[rel].length - 1;
			var framePrevious=B.create(div,{class:'jsframe-previous'},frameImg);
			var frameNext=B.create(div,{class:'jsframe-next'},frameImg);
			B.addEvent(framePrevious,click,this.previous,{skipEvent:true,scope:this});
			B.addEvent(frameNext,click,this.next,{skipEvent:true,scope:this});
		}
	};

	B.JsFrame=frame;
})();
