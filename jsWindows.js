var APP_PATH = 'apps/';	// Local path to APP folder

var APP_W_TOP = 0;		// Cascade GUI top start position
var APP_W_LEFT = 0;		// Cascade GUI left start position

var APP_W_VSTEP = 50;	// Cascade GUI grid vertical step
var APP_W_HSTEP = 50;	// Cascade GUI grid horisontal step

var APP_W_MIN_WIDTH = 150;	// APP Window minimized width
var APP_W_ANIMATION_SPEED = 100 // APP Window animation speed (for jQuery effects)

var APP_IN_FOCUS;		// APP-object in focus
var APP_Z_INDEX = 10;		// z-index CSS value for APP-object no focus
var APP_FOCUS_Z_INDEX = 20;	// z-index CSS value for APP-object in focus


/*
* APP Launcher Object
* Contains the objects of Classes of APPs
*/
function appLauncher(){
	this.appClasses = {};	// Classes container
	
	// Method addAppClass
	//@param class: name of APP class (string)
	this.addAppClass = function(class){	
		if(!this.appClasses[class]) 
			this.appClasses[class] = new appClass(class);	// Create an new APP class object...
		return this.appClasses[class]						// ...and store this in the own container
	}
}
/* End of APP Launcher object */



/*
* APP Class Object
* Contains the objects of APPs
*/

// Constructor
// @param: options (object / string), if string will use as class name
//				class:	class name of APP
//				other options - TO DO...
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
	
	this.class = this.options.class || 'default';			// APP class name, 'default' if empty
	delete this.options.class;
	
	this.path = APP_PATH+this.class+'/';					// The path to APP folder
	this.apps = {};											// APPs object container (for exemplars)
	
	var head = document.getElementsByTagName('head')[0];	// Get a DOM head object
	
	this.css = document.createElement('link');				// Create a DOM css object for APP class
	this.css.setAttribute('rel','stylesheet');
	this.css.setAttribute('type','text/css');
	this.css.setAttribute('href',this.path+'css/style.css');
	
	this.js = document.createElement('script');				// Create a DOM script object for APP class
	this.js.setAttribute('type','text/javascript');
	this.js.setAttribute('src',this.path+'js/script.js');
	
	head.appendChild(this.css);								// Append the created DOM objects to document HEAD
	head.appendChild(this.js);
	
	
	// Method addApp
	// Create a new exemplar of APP object and store this in the own APPs container
	this.addApp = function(){
		var newApp  = new app(this);			// create and transfer self as parent object
		return this.apps[newApp.id] = newApp;	// add created object to container
	}
}
/* End of APP Classes object */



/*
* APP Object
*/

// Constructor
// @param: calssObject (object) - the APP Class object (parent)
//
function app(classObject) {
	this.classObject = typeof(classObject) == 'object' ? classObject : {};
	
	// Create an object ID <className_timeStampRandomNumber(0...1000): string>
	this.id = this.classObject.class+'_'+Date.now().toString()+Math.floor(Math.random()*1000).toString();
	
	this.JQObject;						// APP Window as jQuery selector
	this.jQuery = this.$ = jQuery;		// APP jQuery object local exemplar
	this.loaded = false;				// APP loaded flag
	this.inFocus = false;				// APP inFocus flag

	this.state = 0;						// APP Window state: 
										//		0 - not loaded/hidden
										//		1 - showed
										//		2 - minimized
	
	// APP Window Header template (with a header text, minimize, restore and close button)
	this.headerTemplate = '<div class="appHeader"><h2></h2><a class="appClose" href="javascript:;" rel="close">x</a><a class="appMinimize" href="javascript:;" rel="minimize">_</a><a class="appRestore" href="javascript:;" rel="show">&Pi;</a></div>';
	
	var self = this;		// self link to this (to use in the internal functions)
	
	// Method load
	// Load an APP from a source file
	//@param:	params (object), parameter for AJAX, will transfer through GET into a APP source
	this.load = function(params){
		if(!document.getElementById(this.id)) {		// if no DOM elements with a similar ID exists
			
			this.container = document.createElement('div');		// Create a APP container
			this.container.id = this.id;						// Assign id and class attributes
			this.container.setAttribute('class', 'appWindow ' + this.classObject.class);
			this.container.innerHTML = this.headerTemplate;		// Append a APP header to the container's contents
			
			params = params || new Object();
			params.containerID = this.id;						// Add an containerID parameter
			
			jQuery.ajax({										// Call AJAX query
						url: this.classObject.path,
						data: params,
						dataType: "html",
						context: this.container,				// use an APP container as context
						async: false,
						error: function(){
							this.innerHTML += 'Application is not loaded.'
						},
						success: function(html){
							this.innerHTML += html;		// Append the response html to the container's contents
						}
			});
			
			// Define an JQObject (see above)
			this.JQObject = this.jQuery(document.body.appendChild(this.container));
			
			// Extend the jQuery object with a JQObject context - all calls of this.$ will use this context
			this.$ = function(selector){ return new jQuery.fn.init(selector, this.JQObject ); };
			this.$.fn = this.$.prototype = jQuery.fn;
			this.jQuery.extend(this.$, jQuery);
			
			this.loaded = true;		// Set loaded flag
			
			this.$('.appHeader h2').html(this.$('appcode headertext').html());			// Fill APP header html
			this.$('.appHeader a').click(function(){ eval('self.'+this.rel+'()') });	// Delegate a click event to the header buttons
			
			this.JQObject
				.click(function(event){						// define a click hander for the Window (set focus)
									if(!self.inFocus){
										self.setFocus();
										return false
									}
								})
				.draggable({								// Make the Window darggable (jQuery UI) 
					cancel: '.appHide, .appClose',
					scroll: false,
					handle: '.appHeader',
					start: function(i) { self.setFocus() }
				})
				.resizable();								// Make the Window resizable (jQuery UI)
			
			eval(this.id+'=this');	// Define a global variable with a this ID name and with a self contents
									// for use in APP
			
			this.show(this.classObject.options.showing);				// Call show method
			
			// Call callback function (from APP init section)
			var callBack = text2func( this.$('appcode init').text() );
			
			return callBack ? callBack.call(this) : true // return callback return value or true if no callback
		} else return false	// return false - DOM object already exists
	}
	
	// Method close
	// Close (unload) an APP
	this.close = function(){
		if(document.getElementById(this.id)) {		// if DOM element exists
			var callBack = text2func( this.$('appcode destruct').text() ); // Compile a callback function
			var success = true;	// Define a success flag
			// if callback defined, call this and assign success flag with a returned value 
			if(callBack) success = callBack.call(this);		

			if(success) {	// if succes - close Window
				if(this.inFocus) APP_IN_FOCUS=null;	// if the Window in focus, empty a global variable
				this.inFocus = false;				// remove inFocus flag
				
				document.body.removeChild(this.container);		// remove DOM element
				this.JQObject = null;							// reset all properties and flags
				this.loaded = false;
				this.jQuery = this.$ = jQuery;
				
				// Change global cascade position variables
				APP_W_TOP = (APP_W_TOP - APP_W_VSTEP)>=0 ? (APP_W_TOP - APP_W_VSTEP) : 0;
				APP_W_LEFT = (APP_W_LEFT - APP_W_HSTEP)>=0 ? (APP_W_LEFT -= APP_W_HSTEP) : 0;
				
				delete this.classObject.apps[this.id];	// Delete this from a parent object
			}
			return success
			
		} else return false	// return false - not loaded
	}
	
	
	// Method show
	// Show or resore APP Window if this loaded
	//@params:	param - parameters for jQuery show function
	//			callback
	this.show = function(param,callback){
		if(this.JQObject && this.loaded) { // if JQObject exists and APP loaded
			if(this.state==0) {		// if not showed
				var positions = this.JQObject.position();		// get and initialize Window positions
				this.top = positions.top || (APP_W_TOP += APP_W_VSTEP);
				this.left = positions.left || (APP_W_LEFT += APP_W_HSTEP);
				
				this.JQObject.css({top:this.top,left:this.left});	// set Window positions
				this.setFocus();									// set focus
				this.JQObject.show(param);							// show Window
				
			} else if(this.state==2) {		// if minimized		
				this.$('.appHeader h2').width('auto');				// restore a header size
				this.$('.appHeader a').toggle();					// toggle header buttons
				
				// restore a Window with a animation
				this.JQObject.animate({width : this.width, height : this.height},APP_W_ANIMATION_SPEED);
			}
			if(callback) callback.call(this);		// call a callback function if set
			this.state = 1;							// set state
		}
	}
	
	// Method minimize
	// Minimize APP Window if this loaded and showed
	//@params:	param - parameters for jQuery show function
	//			callback
	this.minimize = function(param,callback){
		if(this.JQObject && this.loaded && this.state==1) { // if JQObject exists, APP loaded and showed
			
			this.width = this.JQObject.width();				// Store Window sizes
			this.height = this.JQObject.height();
			
			this.$('.appHeader h2').width(APP_W_MIN_WIDTH*.7); // Minimize Header (70% from Window minimized width)
			this.$('.appHeader a').toggle();	// toggle header buttons
			this.JQObject.animate({width : APP_W_MIN_WIDTH, height : this.$('.appHeader h2').height()+5},APP_W_ANIMATION_SPEED);	// Minimize Window
			
			if(callback) callback.call(this);		// Call a callback function if set
			this.state = 2;							// Set state
		}
	}
	
	
	// Method setFocus
	// Supply focus to a APP Window if this loaded
	//@params:	callback
	this.setFocus = function(callback){
		if(!this.inFocus && this.loaded){	// if loaded and not in focus
			if(APP_IN_FOCUS)				// if another Window has focus
				APP_IN_FOCUS.loseFocus();	// call loseFocus
			
			this.inFocus = true;				// Set this inFocus flag
			this.JQObject.addClass('inFocus');	// Add inFocus css class
			this.JQObject.zIndex(APP_FOCUS_Z_INDEX);	// Aplly a focused z-index attribute
			APP_IN_FOCUS = this;					// Set a global variable
			if(callback) callback.call(this);		// Call a callback function if set
		}
	}
	
	
	// Method loseFocus
	// Remove focus from a APP Window if this loaded and has focus
	//@params:	callback
	this.loseFocus = function(callback){
		if(this.inFocus && this.loaded){		// if loaded and has focus
			this.JQObject.removeClass('inFocus');	// Remove css class
			this.inFocus = false;					// Clear inFocus Flag
			this.JQObject.zIndex(APP_Z_INDEX)		// Aplly a normal z-index attribute
			APP_IN_FOCUS = null;					// Clear a global variable
			if(callback) callback.call(this);		// Call a callback function if set
		}
	}
	
}
/* End of APP object */



// Function text2func (helper)
// Compile a text into a function
//@params:	text - javascript source code
function text2func(text){
return text ? eval('function(){'+text+'}') : null; // return compiled function or null if empty parameter
}