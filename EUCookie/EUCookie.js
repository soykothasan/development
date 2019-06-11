/*

Author:	 Rob Reid
Website: http://www.strictly-software.com
Description: According to new EU law all sites that use cookies must inform their site visitors that they will be stored on their computer and offer them a choice
	     whether or not to continue with or without cookies. This code can be placed in a global footer within your site and it will run whatever page is first hit.
*/


(function(){

	EUCookie = {

		// set a message that tells the user about the EU cookie requirment
		EUMessage : "<p>In order for this website to be compliant with new EU law I need to ask you whether or not you agree to cookies (a small text file) being set by my website on your computer. Despite what you might have heard cookies in themself are not dangerous, they are not viruses or backdoors for hackers and nearly every site in the world uses them e.g so that you can login to a members area.</p><p>Whilst this site doesn't have a members area or require other uses for cookies  various plugins and scripts I use on the site might set cookies such as Google Analytics, Twitter or Share This. I use Google Analytics as it lets me know how many people visit my site and what pages are the most popular however you could use this site without these 3rd party cookies if you really wanted to by turning them off in your browser.</p><p>Most options are found under the &quot;Tools&quot; section of of the Browser e.g Chrome users can go to <strong>Settings &gt; Under the Hood &gt; Content Settings &gt; Block third-party cookies and site data.</strong><p>You can then click om the &quot;I Agree&quot; button in the safe knowledge no widget used on this site can set cookies but my site could if it needed to.</p><p>If you click on the <strong>I Agree</strong> button below, I <strong>might</strong> store cookies on your computer and you won't see this message again.</p><p>If you click on the <strong>I Don't Agree</strong> button, then I will redirect you away to another website.</p>",
		
		// name of the cookie to tell us they have accepted cookies
		CookieName : "EUCookie",
		
		// value for the cookie
		CookieValue : "Agree",

		// text for the I Agree button
		AgreeText : "I Agree", 

		// text for the I Disagree button
		DisagreeText : "I Disagree",

		// the URL to take the user to if they disagree to cookie use
		RedirectLink : "https://amrbdweb.blogspot.com",

		// width of popup
		MsgWidth : "600px",

		// height of popup
		MsgHeight : "350px",

		// if set to true will always show even if cookies cannot be set at this point in time
		AlwaysShowMsg : false, 

		// if you are really paranoid about cookies being deleted and coming back it double checks their deletion and checks for the creation of new cookies or the enabling
		// of cookies by toolbars and browsers during a page load. So if cookies were disabled by the Web Dev Toolbar and then re-enabled the popup would show once detected
		ParanoidMode : true, 

		// how many milliseconds to check for cookies to re-appear or be re-enabled in Paranoid mode
		ParanoidCheckTimer : 10000, 

		// If you want to hide scrollbars when the lightbox is shown then set it to either BODY, HTML or "" for nothing and the scrollbars will be set to auto once confirmed
		HideScroll : "BODY", 

		PageSize : {},

		// Reads a cookie
		ReadCookie : function(n){
						
			n+= "=";
			var ca = document.cookie.split(';');

			for(var i=0,l=ca.length;i<l;i++){
				var c=ca[i];
				while(c.charAt(0)==' ')c=c.substring(1,c.length);
			
				if (c.indexOf(n)==0){
			
					var r=EUCookie.Decode(c.substring(n.length,c.length));
			
					return r;
				}
			}
		},

		// Creates a cookie
		CreateCookie : function(n,v,d) {
			
			if(d){
				var date = new Date();
				date.setTime(date.getTime()+(d*24*60*60*1000));
				var expires = "; expires="+date.toGMTString();
			}else{
				var expires = "";
			}
			
			
			document.cookie=n+"="+EUCookie.Encode(v)+expires+"; path=/";
		},

		// Deletes a cookie and in Paranoid mode checks it has actually been deleted as some browsers dont until the next session
		DeleteCookie : function(n){		
			
			document.cookie = n + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;';

			// some browsers like older versions of Chrome and IE dont actually delete until the next session so check its gone
			if(EUCookie.ParanoidMode){

				var chk=EUCookie.ReadCookie(n);
				
				if (chk && chk!=""){			
	
					return false;
				}
			}
			
			return true;
		},

		// get viewport size
		GetViewportSize : function()
		{
			var width=0,height=0;

			if (typeof self.innerWidth != 'undefined') {
				width = self.innerWidth;
				height = self.innerHeight;			
			}else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0){
				width = document.documentElement.clientWidth;
				height = document.documentElement.clientHeight;			
			}else{
				width = document.getElementsByTagName('body')[0].clientWidth;
				height = document.getElementsByTagName('body')[0].clientHeight;
			
			}
			
			var size = {
				"width" : width,
				"height" : height
			}	

			return size;
		},

		
		// get scroll position
		GetScrollPosition : function(){
			var x=0,y=0;

			if( typeof( window.pageYOffset ) == 'number' ) {
				// Most browsers apart from IE
				x = window.pageXOffset;
				y = window.pageYOffset;
			} else if( typeof(document.documentElement) != 'undefined' && (document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
				//IE6 standards compliant mode and some other browsers
				x = document.documentElement.scrollLeft;
				y = document.documentElement.scrollTop;
			} else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
				//DOM compliant browsers
				x = document.body.scrollLeft;
				y = document.body.scrollTop;
			} 

			var position = {
				'x' : x,
				'y' : y
			}

			return position;
		},

		GetPageSize : function(){

			var viewport = EUCookie.GetViewportSize();
			
			if (window.innerHeight && window.scrollMaxY) {
				// Mozilla
				xScroll = document.body.scrollWidth;
				yScroll = window.innerHeight + window.scrollMaxY;				
			} else if (document.body.scrollHeight > document.body.offsetHeight){
				xScroll = document.body.scrollWidth;
				yScroll = document.body.scrollHeight;				
			} else {
				// IE 7
				xScroll = document.body.offsetWidth;
				yScroll = document.body.offsetHeight;
			}	

			// for small pages with total height less then height of the viewport
			if(yScroll < viewport.height){
				pageHeight = viewport.height;
			} else {
				pageHeight = yScroll;				
			}

			// for small pages with total width less then width of the viewport
			if(xScroll < viewport.width){
				pageWidth = viewport.width;
			} else {
				pageWidth = xScroll;
			}

			var pageSize={
				"pageWidth": parseInt(pageWidth)+"px",
				"pageHeight": parseInt(pageHeight)+"px",
				"viewportWidth": parseInt(viewport.width)+"px",
				"viewportHeight": parseInt(viewport.height)+"px"
			};
			
			return pageSize;
		},

		// Center the message box in the middle of the viewport
		CenterContent : function(){
			
			var left,top; left=top=0,
				//ViewportSize = EUCookie.ViewportSize(),
				PageSize = EUCookie.GetPageSize(),
				Scroll = EUCookie.GetScrollPosition();
			
			// if specific x,y co-ords have been passed in use them otherwise center editor

			// calculate starting position for the editor to appear centered on the screen
			var startX = ((parseInt(PageSize.viewportWidth)/2)-(parseInt(EUCookie.MsgWidth)/2))+Scroll.x;
			var startY = ((parseInt(PageSize.viewportHeight)/2)-(parseInt(EUCookie.MsgHeight)/2))+Scroll.y;

			// set editor styles to position it
			left = ((startX<0)?0:startX)+"px";
			top = ((startY<0)?0:startY)+"px";
			
			document.getElementById('EUCookieMsg').style.top=top;
			document.getElementById('EUCookieMsg').style.left=left;

			return;
		},

		// Check whether the current browser has the ability to set cookies at this point in time and in Paranoid mode set up a timer to constantly check for their 
		// appearance or re-enabling e.g web dev toolbar
		HasCookiesEnabled : function(){
			
			var self = this;

			// if the user has disabled all cookie use then we don't show the message or try setting a cookie
			if(!document.cookie && !EUCookie.ParanoidMode){			

				return false;
			}

			// paranoid mode - set, check then delete a cookie to prove they can be set
			if(EUCookie.ParanoidMode){
			
				EUCookie.CreateCookie("EUTestCookie","test",1);
				
				var chk=EUCookie.ReadCookie("EUTestCookie");

				if (chk && chk=="test"){
					
					// user has now re-enabled cookies maybe through a toolbar you could now show the message - even if the page had already loaded for X minutes
				
					// will return false if the cookie cannot be removed until the next session
					EUCookie.DeleteCookie("EUTestCookie");

					// cookies can be set				
				}else{

					// cannot be set at moment but could be through AJAX requests in lazy loaded scripts etc or if web dev toolbar is changed etc
					// so set a timer to constantly check for their appearance and display the message if they appear
					
					setTimeout(function(){
						self.CheckCookieConstantly();
						},self.ParanoidCheckTimer);		

					return false;
				}
			}

			return true;
		},

		// Constantly checks for cookies to be turned back on or for scripts to set cookies if none currently exist once the EUCookie compliance cookie has been set
		// the timer will stop checking for cookies
		CheckCookieConstantly : function()
		{
			
			var retry = false,
				self = this;

			if(!document.cookie){
				retry = true;
			}else{
				// if they have since agreed to the cookie use stop the timer
				if(self.HasEUCookie()){					
					retry = false;
				}else{
					// as they now have the ability for cookies to be set we need to show the warning
					self.ShowEUCookieRequest();	
					return;
				}
			}

			// do we try again?
			if(retry){				
				setTimeout(function(){self.CheckCookieConstantly()},self.ParanoidCheckTimer);
			}else{
				// no more retries
				return;
			}
		},

		// does the users browser already have the EU Cookie set for it
		HasEUCookie : function(){

			// check whether there is an EU Cookie already on the users PC
			var n=EUCookie.CookieName,
				chk=EUCookie.ReadCookie(n);
			
			if (chk && chk==EUCookie.CookieValue)
			{
				return true;
			}

			return false;
		},

		// Main function to decide whether or not we need to show the message by checking for a previous cookies existance 
		CheckCookie : function(){

			// if we show the warning whether cookies cannot be set at this point of time - they might later e.g web dev toolbar enable/disable cookie use
			if(EUCookie.AlwaysShowMsg || EUCookie.HasCookiesEnabled()){
				
				// user has cookies enabled check whether they have already agreed to use them
				if(EUCookie.HasEUCookie())
				{
					// the EU cookie was found so the user has read and confirmed that they want to use cookies on this site
					// reset for another 365 days
					
					// reset the cookie for another year
					EUCookie.CreateCookie(EUCookie.CookieName,EUCookie.CookieValue,365);	
				}
				else 
				{					
					// No EU cookie exists OR we so we need to ask the user whether they want to accept cookies on this site
					EUCookie.ShowEUCookieRequest();					
				}
				
			}
		
		},

		HideScrollbars : function()
		{
			// try to remove scrollbars on specified object
			
			switch(EUCookie.HideScroll)
			{
				case "":
					break;
				case "BODY":
					EUCookie.GetBody().style.overflow = "hidden";
					break;		
				case "HTML":
					document.getElementsByTagName("HTML")[0].style.overflow = "hidden";
					break;		
					
			}

			return;
		},

		// Show relevant scrollbars
		ShowScrollbars : function()
		{
			
			switch(EUCookie.HideScroll)
			{
				case "":
					break;
				case "BODY":
					EUCookie.GetBody().style.overflow = "auto";
					break;			
				case "HTML":
					document.getElementsByTagName("HTML")[0].style.overflow = "auto";
					break;		
					
			}
			
			return;
		},

		ResizeOverlay : function(){

			var height = EUCookie.PageSize.pageHeight, width = EUCookie.PageSize.pageWidth;
			
			var el = document.getElementById('EUCookieFade');
			if(el){
				// set all styles at once
				el.style.cssText = "z-index:999999; position:absolute;top:0;left:0;width:"+width+";height:"+height+";background: rgb(0, 0, 0) transparent;background: rgba(0, 0, 0, 0.6);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000000, endColorstr=#99000000);-ms-filter: \"progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000000, endColorstr=#99000000)";
			}	

			return;
		},

		// Whether to show the message box or not
		ShowEUCookieRequest : function()
		{

			// get page size and save it for future use
			EUCookie.PageSize = EUCookie.GetPageSize();

			var width = EUCookie.PageSize.pageWidth,
				height = EUCookie.PageSize.pageHeight;		

			// taken from Scott Herbert (www.scott-herbert.com)
			// quick way to lightbox a DIV that is cross browser
			var html = "<div id='EUCookieFade' ><div style='z-index:999999; position:absolute;top:0;left:0;width:"+width+";height:"+height+";background: rgb(0, 0, 0) transparent;background: rgba(0, 0, 0, 0.6);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000000, endColorstr=#99000000);-ms-filter: \"progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000000, endColorstr=#99000000)\"'>";

			// create the DIV wrapper
			html += "<div id='EUCookieMsg' style='position:absolute;padding:15px;width:" + EUCookie.MsgWidth + ";height:" + EUCookie.MsgHeight + ";background:#fff;color:#000;text-align:left;'>";

			// this is the message displayed to the user - overwrite if necessary e.g multi lingual sites 
			html += EUCookie.EUMessage;				
				
			// Displays the I agree/disagree buttons that call the relevant functions in a DOM0 event model - change if you feel its neccessary
			html += "<input type='button' value='" + EUCookie.AgreeText + "' onclick='EUCookie.AgreeToUse();' /> <input type='button' value='" + EUCookie.DisagreeText + "' onclick='window.location.href = \"" + EUCookie.RedirectLink + "\"' />";
						
			html += "</div></div></div>";
			
			var div = document.createElement("DIV");
			div.innerHTML = html;			

			EUCookie.GetBody().appendChild(div);
	
			// now center			
			EUCookie.CenterContent();

			// hide scrollbars
			EUCookie.HideScrollbars();

			// Chrome, FF, IE9, Safari, IE9
			if(window.addEventListener){
				window.addEventListener("resize",function(){					
					EUCookie.CenterContent();
					EUCookie.ResizeOverlay();
				},false);
			// skip DOM2 pre IE 8 as its rubbish go for DOM0 standard
			}else{
				var func = window["onresize"];
				if(typeof(func)=="function"){
					window.onresize = function(){												
												func();
												EUCookie.CenterContent();
												EUCookie.ResizeOverlay();
										}
				}else{
					window.onresize = function(){						
						EUCookie.CenterContent();
						EUCookie.ResizeOverlay();
					}
				}	
			}	

			return;
		},

		// Will reset the cookie for another 365 days and remove the message HTML from the DOM as well as putting back any missing scrollbars
		AgreeToUse : function(){

			EUCookie.CreateCookie(EUCookie.CookieName,EUCookie.CookieValue,365);	

			// hide msg
			var el = el = document.getElementById('EUCookieMsg').parentNode;		
			el.removeChild( el.firstChild ); 

			el = document.getElementById('EUCookieFade').parentNode;		
			el.removeChild( el.firstChild );      
			
			//Add overflow back
			EUCookie.ShowScrollbars();
			
			return true;
		},

		// utility function to decode a URL
		Decode : function(v){
			if(typeof(decodeURIComponent)=="function"){
				return decodeURIComponent(v);
			}else{
				return unescape(v);
			} 
		},

		// utility function to encode a URL
		Encode : function(v){
			if (typeof(encodeURIComponent)=="function"){
				return encodeURIComponent(v);
			}else{
				return escape(val);
			}
		},

		// utility function to ger the document body
		GetBody : function(){
			return document.getElementsByTagName("body")[0] || document.body;
		}

	}

	// call the CheckCookie function
	EUCookie.CheckCookie();


})();
