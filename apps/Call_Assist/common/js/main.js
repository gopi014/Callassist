/* ***************************************************************** */
/*                                                                   */
/* IBM Confidential                                                  */
/*                                                                   */
/* OCO Source Materials                                              */
/*                                                                   */
/* Copyright IBM Corp. 2014                                          */
/*                                                                   */
/* The source code for this program is not published or otherwise    */
/* divested of its trade secrets, irrespective of what has been      */
/* deposited with the U.S. Copyright Office.                         */
/*                                                                   */
/* ***************************************************************** */
function wlCommonInit(){
	// Common initialization code goes here
	 
	 if (window.device) {
		//Disable direct update feature of Worklight
		 WL.iosDeviceProfileData[WL.EPField.SUPPORT_DIRECT_UPDATE_FROM_SERVER] = false;
		 WL.iphoneProfileData[WL.EPField.SUPPORT_DIRECT_UPDATE_FROM_SERVER] = false;
		 WL.ipadProfileData[WL.EPField.SUPPORT_DIRECT_UPDATE_FROM_SERVER] = false;
		 WL.androidProfileData[WL.EPField.SUPPORT_DIRECT_UPDATE_FROM_SERVER] = false;
		 //
		 
		 
		 document.addEventListener("resume", $.proxy(BonD.deviceOnResume, BonD), false);
		 document.addEventListener("online", $.proxy(BonD.deviceOnline, BonD), false);
		 document.addEventListener("offline", $.proxy(BonD.deviceOffline, BonD), false);
		 document.addEventListener("backbutton", $.proxy(BonD.deviceBackbutton, BonD), false);

		 //openCache();
		 console.log('Device model: '+device.model);
		/* if (isIOSEnv() || isAndroidEnv()) {
			 if (isSIMEnv()) {
				 window.j_os = window.device.platform;
				 console.log('window.os: ' +window.j_os);
			 } else {
				 window.plugins.getSerial.getSerial($.proxy(function(result) {
						window.j_serial = result.serial||result;
						window.j_os = window.device.platform;
						console.log('window.serial: ' +window.j_serial);
						console.log('window.os: ' +window.j_os);
				 }, window));
			 }
		 }*/
	 }  
	 //open cache info
	 //Authen.getUser();
	/* WL.App.addActionReceiver("opensettings", function (receivedActon){
		 getLocation();
		});*/
	 console.log("bluemix ajax starts >>"+ new Date());
	 datedif=new Date();
	 CallAssistance();
}

/**
 * SIM environment
 */
window.isSIMEnv = function () {
	if (!window.device) {
		return false;
	}
	//iOS Simulator
	var m = window.device.model;
	return ('x86_64' == m || 'x86_32' == m/* || 'sdk' == m*/);
};
/**
 * iOS environment
 */
window.isIOSEnv = function () {
	var env = WL.Client.getEnvironment();
	return (env == WL.Environment.IPHONE || env == WL.Environment.IPAD);
};
/**
 * Android environment
 */
window.isAndroidEnv = function () {
	var env = WL.Client.getEnvironment();
	return (env == WL.Environment.ANDROID);
};

//define shortcut functions
window.device = (window.device || null);
window.winAlert = window.alert || alert;

window.alert = function(message, alertCallback, title, buttonNames) {
	console.log('alert', title, message);
	if (!title || title.length == 0) {
		title = 'Alert';
	}
	if (!buttonNames || buttonNames.length == 0) {
		buttonNames = 'OK';
	}
	if (alertCallback) {
		alertCallback = function(i) {
			console.log("OK button was clicked, index: " + i);
			WL.Client.reloadApp();
			console.log("App logged out sucessfully" + i);
		};
	}
	//open dialog
	if (window.device) {
		navigator.notification.alert(message, alertCallback, title, buttonNames);
	} else {
		openDialog('Alert', message, alertCallback, buttonNames);
	}
};
/**
 * open a dialog
 */
window.openDialog = function(title, message, okBtnCb, buttonNames) {
	var _confirmCallback = function(i) {
		console.log("button index: " + i);
		var ok = window.device? 1: 0;
		if (i == ok) {
			okBtnCb(i);
		}
	};
	if (!okBtnCb) {
		okBtnCb = function(i) {
			console.log("OK button was clicked");
		};
	}
	if (!title || title.length == 0) {
		title = 'Confirm';
	}
	if (!buttonNames || buttonNames.length == 0) {
		buttonNames = 'OK, Cancel';
	}
	//open dialog
	if (window.device) {
		navigator.notification.confirm(message, _confirmCallback, title, buttonNames);
	} else {
		openJDialog(title, message, okBtnCb);
	}
};
/**
 * open jquery dialog
 */
window.openJDialog = function(title, message, okBtnCb) {
	var isAlert = (title == 'Alert');
	try {
		  var jcontent =  $("<div/>", { id: 'popupMsg' });
		  var msg = $("<div/>", { style : 'min-width:200px;min-height:60px;'}).appendTo(jcontent);
		  $("<h3/>", { text : title }).appendTo(msg);
		  $("<p/>", { text : message.replace(/\/n/g, '<br\/>') }).appendTo(msg);
		  var btns = $("<div/>", { style: 'text-align:center;'}).appendTo(jcontent);
		  if (isAlert) {
			  $("<button>", { text : 'OK', id: 'popupOK' }).buttonMarkup({ 'inline' : true }).appendTo(btns);
		  } else {
			  $("<button>", { text : 'Cancel', id: 'popupCancel'  }).buttonMarkup({ 'inline' : true }).appendTo(btns);
			  $("<button>", { text : 'OK', id: 'popupOK'  }).buttonMarkup({ 'inline' : true }).appendTo(btns);
		  }
		setTimeout(function(){
			$.dynamic_popup({content: jcontent})
			.bind(
				{ popupafteropen: function(e){
			        console.log('Opened the popup! ' +title +','+ message);
			        window._popupCloseCb = function(cb, e){
			        	var popId = '#popup' + $.mobile.activePage.attr('id');
						  $(popId).popup('close');
						  if (cb) cb();
					  };
					  window._popupCloseNoneCb = $.proxy(window._popupCloseCb, window, null);
					  window._popupCloseOkCb = $.proxy(window._popupCloseCb, window, okBtnCb);
					  $('#popupOK').on('tap', _popupCloseOkCb);
					  $('#popupCancel').on('tap', _popupCloseNoneCb);
			    }, popupafterclose: function(e){
			    	console.log('Closed the popup! ' +title +','+ message);
			    	$(this).remove();
			    }
			});
		}, 100);
	} catch (e) {
		console.log(e);
		if (isAlert) {
			winAlert(message);
		} else {
			if (okBtnCb && confirm(message)) {
				okBtnCb();
			}
		}
	}
};
/**
 * jquery loading indicator
 */
window.jLoading = function(show) {
	if ('show' == show) {
		var option = {
				text: Messages.loading_indicator_title,
				textVisible: true,
				theme: 'a',
				textonly: false,
				html: '' };
		$.mobile.loading( show , option);
		setTimeout(function(){
			$( 'div.ui-loader' ).loader( "fakeFixLoader" );
			$( 'div.ui-loader' ).loader( "checkLoaderPosition" );
		}, 100);
	} else {
		$.mobile.loading( show );
	}
};
/**
 * jquery change page from/to 
 */
window.changePageTo = function(uri, options) {
	var settings = $.extend({'changeHash': 'false','transition' : 'none','allowSamePageTransition' : 'true'}, options);
	$.mobile.pageContainer.pagecontainer("change", uri, settings);
};
/**
 * jquery load a page
 */
window.loadPage = function(uri, options) {
	var settings = $.extend({'role' : 'page'}, options);
	$.mobile.pageContainer.pagecontainer("load", uri, settings);
};

window.getActivePage = function() {
	var activePage = $.mobile.pageContainer.pagecontainer( "getActivePage" );
	return activePage;
};

//UI sections
$( document ).on( "pagecreate", function( event, ui ) {
	console.log('document pagecreate');
	//add a space for the status bar of ios 7 or later
	
});
$( document ).on( "pageshow", function( event, ui ) {
	console.log('document pageshow');
	if (isAndroidEnv()) {
		var activePage = getActivePage().attr("id");
		BonD.pageIdHistory.push(activePage);
	}
	
	if (window.device && parseFloat(window.device.version) >= 7.0){
	      $(".ui-header").css("padding-top", "20px");
	      $(".ui-header .ui-btn").css("margin-top", "20px");
	      $('[data-role="header"] a').css("margin-top","25px");
	      $('#do-dont').trigger('create');


	 }
	if (WL.Client.getEnvironment() == WL.Environment.IPHONE) {
		$(".ui-slider-handle").css("margin-top", "");
		$(".ui-radio label").css("margin-top", "");
	}
	// This is for moving down the search field, but
	// for now it's a temp solution as either mobileinit or 
	// ready event is not fired at all
 	$('.ui-field-contain input').off('blur');
 	$('.ui-field-contain input').on('blur', function(evt){
 		setTimeout(function(){
 			$.mobile.silentScroll(0);
 		}, 100);
 	});
});

$( document ).ready(function() {
	console.log( "ready!" );
	//append footer for the pages
	$("section[data-role='page']").each(function( i ) {
		if (this.id != 'login') {
			console.log('append the footer for the page: ' + this.id);
			var footer = '<footer id="footer" data-role="footer" data-theme="c" data-tap-toggle="false" data-position="fixed"><div class="sprite ibm ftr"></div></footer>';
			$(this).append(footer);
		}
	});
	
	//append the prefs for header of home page
	$("section[class='home'] header[data-role='header']").each(function( i ) {
		console.log('append the preferences for this header: ', i);
		var id = 'preferences'+i;
		var prefsAnchor = '<a href="#' + id + '" class="ui-btn-right ui-btn ui-btn-inline ui-mini ui-corner-all ui-btn-icon-right ui-icon-gear ui-btn-icon-notext">Preferences</a>';
		var prefs = '<div data-role="panel" id="' + id + '" class="preferences" data-position="right" data-display="overlay" data-theme="a" data-position-fixed="true">' +
						'<h3>Preferences</h3>' +
						'<form>' +
							'<ul data-role="listview" data-inset="true">' +
								'<li class="field-contain">' +
									'<label for="filters">Auto-load active charts</label>' +
									'<select name="filters" id="flip-2" data-role="slider" disabled="disabled">' +
										'<option value="off">Off</option>' +
										'<option value="on">On</option>' +
									'</select>' +
								'</li>' +
								'<li class="field-contain">' +
									'<fieldset data-role="controlgroup">' +
													'<legend>Search in</legend>' +
													'<input type="radio" name="radio1" id="radio1_0" value="IBMREQ001" onchange="changeSearchIn(this.value)" checked="checked"/>' +
													'<label for="radio1_0">Americas</label>' +
													'<input type="radio" name="radio1" id="radio1_1" value="IBMREQ002" onchange="changeSearchIn(this.value)"/>' +
													'<label for="radio1_1">EU Europe</label>' +
													'<input type="radio" name="radio1" id="radio1_2" value="IBMREQ003" onchange="changeSearchIn(this.value)"/>' +
													'<label for="radio1_2">Asia Pacific</label>' +
									'</fieldset>' +
								'</li>' +
								'<li class="field-contain"><a href="#" onclick="javascript:Authen.logout()" class="ui-btn">Logout</a></li>' +
							'</ul>' +
						'</form>' +
					'</div>';
		$(this).append(prefsAnchor);
		$(this).append(prefs);
		
		
	});
});


