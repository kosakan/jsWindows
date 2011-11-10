var APP_PATH = 'apps/';
var APP_W_TOP = 0;
var APP_W_LEFT = 0;

var APP_W_VSTEP = 50;
var APP_W_HSTEP = 50;

var APP_IN_FOCUS;
var APP_Z_INDEX = 10;


function appLauncher(){
	this.appClasses = {};
	this.addAppClass = function(type){
		if(!this.appClasses[type]) this.appClasses[type] = new appClass(type);
		return this.appClasses[type]
	}
}


function appClass(options){
	
	switch( typeof(options) ){
		case 'string':
			this.options = {class: options};
			break;
		case 'object':
			this.options = options;
			break;
		default:
			this.options = {}
	}
	
	this.class = this.options.class || 'default';
	delete this.options.class;
	
	this.path = APP_PATH+this.class+'/';
	this.apps = {};
	
	this.css = document.createElement('link');
	var head = document.getElementsByTagName('head')[0];
	
	this.css.setAttribute('rel','stylesheet');
	this.css.setAttribute('type','text/css');
	this.css.setAttribute('href',this.path+'css/style.css');
	
	this.js = document.createElement('script');
	this.js.setAttribute('type','text/javascript');
	this.js.setAttribute('src',this.path+'js/script.js');
	
	head.appendChild(this.css);
	head.appendChild(this.js);
	
	this.addApp = function(){
		var newApp  = new app(this);
		return this.apps[newApp.id] = newApp;
	}
}


function app(classObject) {
	this.classObject = typeof(classObject) == 'object' ? classObject : {};
	
	this.id = this.classObject.class+'_'+Date.now().toString()+Math.floor(Math.random()*1000).toString();
	
	this.JQObject;
	this.jQuery = this.$ = jQuery;
	this.loaded = false;
	this.inFocus = false;
	this.state = 0;
	
	this.headerTemplate = '<div class="appHeader"><h2></h2><a class="appClose" href="javascript:;" rel="close">x</a><a class="appMinimize" href="javascript:;" rel="minimize">_</a><a class="appRestore" href="javascript:;" rel="show">&Pi;</a></div>';
	
	var self = this;
	
	this.load = function(params){ // Load app
		if(!document.getElementById(this.id)) {
			
			this.container = document.createElement('div');
			this.container.id = this.id;
			this.container.setAttribute('class', 'appWindow ' + this.classObject.class);
			this.container.innerHTML = this.headerTemplate;
			
			params = params || new Object();
			params.containerID = this.id
			jQuery.ajax({
						url: this.classObject.path,
						data: params,
						dataType: "html",
						context: this.container,
						async: false,
						error: function(){
							this.innerHTML += 'Application is not loaded.'
						},
						success: function(html){
							this.innerHTML += html;
						}
			});
			
			this.JQObject = this.jQuery(document.body.appendChild(this.container));
					
			this.jQuery.noConflict();
			
			this.$ = function(selector){ return new jQuery.fn.init(selector, this.JQObject ); };
			this.$.fn = this.$.prototype = jQuery.fn;
			
			this.jQuery.extend(this.$, jQuery);
			this.loaded = true;
			
			this.$('.appHeader h2').html(this.$('appcode headertext').html());
			
			this.$('.appHeader a').click(function(){ eval('self.'+this.rel+'()') });
			
			this.JQObject
				.click(function(event){
									if(!self.inFocus){
										self.setFocus();
										return false
									}
								})
				.draggable({
					cancel: '.appHide, .appClose',
					scroll: false,
					handle: '.appHeader',
					start: function(i) { self.setFocus() }
				})
				.resizable();
			
			eval(this.id+'=this');
			
			this.show(this.classObject.options.showing);
			var callBack = text2func( this.$('appcode init').text() )
			
			return callBack ? callBack.call(this) : true
		} else return false
	}
	
	this.close = function(){	// Unload app
		if(document.getElementById(this.id)) {
			var callBack = text2func( this.$('appcode destruct').text() );
			var success = true;
			if(callBack) success = callBack.call(this);

			if(success) {
				if(this.inFocus) APP_IN_FOCUS=null;
				this.inFocus = false;
				
				document.body.removeChild(this.container);
				this.JQObject = null;
				this.loaded = false;
				this.jQuery = this.$ = jQuery;
				
				APP_W_TOP = (APP_W_TOP - APP_W_VSTEP)>=0 ? (APP_W_TOP - APP_W_VSTEP) : 0;
				APP_W_LEFT = (APP_W_LEFT - APP_W_HSTEP)>=0 ? (APP_W_LEFT -= APP_W_HSTEP) : 0;
				
				delete this.classObject.apps[this.id];
			}
			return success
			
		} else return false
	}
	
	this.show = function(param,callback){		// Show app window if app loaded
		if(this.JQObject && this.loaded) {
			if(this.state==0) {
				var positions = this.JQObject.position();
				this.top = positions.top || (APP_W_TOP += APP_W_VSTEP);
				this.left = positions.left || (APP_W_LEFT += APP_W_HSTEP);
				this.JQObject.css({top:this.top,left:this.left});
				this.setFocus();
				this.JQObject.show();
			} else {
				this.$('.appHeader h2').width('auto');
				this.$('.appHeader a').toggle();
				this.JQObject.animate({width : this.width, height : this.height},100);
			}
			this.state = 1;
		}
	}
	
	this.minimize = function(param,callback){		// Hide app window if app loaded
		if(this.JQObject && this.loaded) {
			
			//this.JQObject.hide(param || this.classObject.options.hidding, callback);
			this.width = this.JQObject.width();
			this.height = this.JQObject.height();
			
			this.$('.appHeader h2').width(110);
			this.$('.appHeader a').toggle();
			this.JQObject.animate({width : 150, height : 25},100);
			this.state = 2;
		}
	}
	
	this.setFocus = function(){
		if(!this.inFocus && this.loaded){
			if(APP_IN_FOCUS) {
				APP_IN_FOCUS.JQObject.removeClass('inFocus');
				APP_IN_FOCUS.inFocus = false;
				APP_IN_FOCUS.JQObject.zIndex(this.JQObject.zIndex())
			}
			
			this.inFocus = true;
			this.JQObject.addClass('inFocus');
			this.JQObject.zIndex(APP_Z_INDEX);
			APP_IN_FOCUS = this;
		}
	}
	
}


function text2func(text){
return text ? eval('function(){'+text+'}') : null;
}