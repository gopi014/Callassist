
var userInfo={};

/*
 function watchLocation() {
        // Throw an error if no update is received every 30 seconds
        var options = { timeout: 30000 };
        watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
    }

    // onSuccess Geolocation
    //
    function onSuccess(position) {
        var element = document.getElementById('demo');
        element.innerHTML = 'Latitude: '  + position.coords.latitude      + '<br />' +
                            'Longitude: ' + position.coords.longitude     + '<br />' +
                            '<hr />'      + element.innerHTML;
    }

        // onError Callback receives a PositionError object
        //
        function onError(error) {
            alert('code: '    + error.code    + '\n' +
                  'message: ' + error.message + '\n');
        }*/



 var element = document.getElementById('demo');
 var nearestCityDetails={};
 var cityResultset1={};
 var options={
         enableHighAccuracy: true
         ,timeout : 15000
};
 
 function getCurrLocation() { 
	
	 if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(onSuccess, locationError,options);
	 }else {
	    	console.log("not supp geo");
	    	element.innerHTML= "Geolocation is not supported.";
	        
	    }
    }

    
    function onSuccess(position) {
       
        element.innerHTML = 'Latitude: '           + position.coords.latitude              + '<br />' +
                            'Longitude: '          + position.coords.longitude             + '<br />' +
                            'Altitude: '           + position.coords.altitude              + '<br />' +
                            'Accuracy: '           + position.coords.accuracy              + '<br />' +
                            'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
                            'Heading: '            + position.coords.heading               + '<br />' +
                            'Speed: '              + position.coords.speed                 + '<br />' +
                            'Timestamp: '          + position.timestamp                    + '<br />';
    }

    
    function locationError(error) {
    	BonD.busierHide('login');
       console.log(' Error code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
        alert(Messages.EnableGPS, null, Messages.application_title);
        $(".locationtry").show();
    }
    
    
    function getLocationDetails(){
    	//var cname=""; var rescount=0;
    	  servicePIds="";
          needtoFindNo=[];
          rescount=0;
          nearestCityDetails={};
          cityResultset1={};
    	
    	
    	
    	
    	if (navigator.geolocation) {
    	    navigator.geolocation.getCurrentPosition(function (position) {
    	    //	if(type=="currentLoc"){
    	    		
    	    		userInfo.curcoordinates=position;
    	    //	}
    	    	//else{
    	        //GET USER CURRENT LOCATION
    	        var locCurrent = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    	        //CHECK IF THE USERS GEOLOCATION IS IN AUSTRALIA
    	        var geocoder = new google.maps.Geocoder();
    	            geocoder.geocode({ 'latLng': locCurrent }, function (results, status) {
    	            	//console.log(JSON.stringify(results));
    	                var locItemCount = results.length;
    	              //  if(type=="countryCode"){
	    	                var locCountryNameCount = locItemCount - 1;
	    	                var locCountryName = results[locCountryNameCount].address_components[0].short_name;
	    	                userInfo.countryCode= locCountryName;
    	              //  }else if(type=="country"){
	    	                var locCountryNameCount = locItemCount - 1;
	    	                var locCountryName = results[locCountryNameCount].formatted_address;
	    	                userInfo.country= locCountryName.toLowerCase();
    	             //   }else if(type=="city"){
    	                	var locCountryNameCount = locItemCount - 4;
 	    	                var locCountryName = results[locCountryNameCount].formatted_address.split(",")[0];
 	    	                userInfo.city= locCountryName.toLowerCase();
 	    	                
 	    	               $(".locationtry").hide();
    	             //   }
    	                
    	              //  return cname;
    	        });
    	   // }
    	            setTimeout(function(){ getNearest(); }, 800);
    				
    	    },locationError,options);
    	    
    	}else {
    		BonD.busierHide('login');
	    	 console.log("not supp geo");
	    	 alert("Geolocation is not supported", null, Messages.application_title);
	    	 $(".locationtry").show();
	    	// return cname;
	        
	    }
    	
    	 
    }
    
    
    function getNearest(){
    	
    	if(userInfo.countryCode){
    		
    		
            var invocationData = {
                    adapter : 'PocketServiceSQL',
                    procedure : 'getCities',
                    parameters : [userInfo.countryCode]
            };

            WL.Client.invokeProcedure(invocationData, {
                onSuccess : getPocketCitySuccess,
                onFailure : getPocketCityFailure
            });
        	
    		
    	}else{
    		BonD.busierHide('login');
    		//console.log(Messages.EnableGPS+"or\n"+Messages.please_check_connection);
    		alert(Messages.please_check_connection, null, Messages.application_title,"OK");
    		 $(".locationtry").show();
    	}
    	
    	
    }

    function getPocketCitySuccess(result){
    	BonD.busierHide('login');
    	console.log("city result " +JSON.stringify(result));
    	 var distances=[];
    	 var currlocCoords={};
    	 currlocCoords.latitude=userInfo.curcoordinates.coords.latitude;
    	 currlocCoords.longitude=userInfo.curcoordinates.coords.longitude;
    	if(result.invocationResult.resultSet){
    		var cityResultset=result.invocationResult.resultSet;
    		 cityResultset1=result;
    		$(cityResultset).each(function( index ,item) {
    			var citiesCoord={};
    			citiesCoord.latitude=parseFloat(item.LATITUDE);
    			citiesCoord.longitude=parseFloat(item.LONGITUDE);
    			/*console.log("coords 1" +JSON.stringify(citiesCoord));
    			console.log("coords 2" +JSON.stringify(currlocCoords));*/
    			var distres=WL.Geo.getDistanceBetweenCoordinates(currlocCoords, citiesCoord);
    			distances.push(distres);
    		 	console.log("city dist result for  "+item.LOC_NM +" is=" +distres);
    			
    		});
    		
    		var mindistIndex=indexOfSmallest(distances);
    		 nearestCityDetails=cityResultset[mindistIndex];
    		console.log("nearest city "+nearestCityDetails.LOC_NM);
    		getPhoneNumberDetails(parseInt(nearestCityDetails.LOC_ID));
    		cityResultset1.invocationResult.resultSet.splice(mindistIndex, 1);
    		
    	}
    }

    function getPocketCityFailure(result){
    	BonD.busierHide('login');
    //	createcmnCollpPage(staticData.myPocketData[0].getstarted);
    	alert(Messages.please_check_connection, null, Messages.application_title,"OK");
    	 $(".locationtry").show();
    	//alert("Fail");
    }
    
    
    function indexOfSmallest(a) {
    	 return a.indexOf(Math.min.apply(Math, a));
    	}
    
    
    function getPhoneNumberDetails(locid){
    	BonD.busierShow('login');
    	//locid="1";
    	//alert(locid, null, Messages.application_title,"OK");
    	
    	 var invocationData = {
                 adapter : 'PocketServiceSQL',
                 procedure : 'getPhoneNumbers',
                 parameters : [locid]
         };

         WL.Client.invokeProcedure(invocationData, {
             onSuccess : getPhoneNumberSuccess,
             onFailure : getPhoneNumberFailure
         });
    	
    	
    	
    }
    
    
    var rescount=0;
    var servicePIds="";
    var needtoFindNo=[];
    function getPhoneNumberSuccess(result){
    	
    	BonD.busierHide('login');
    	console.log("phone result result " +JSON.stringify(result));
    	
    	if(rescount == 0){
    	  $("#conferenceCallList").empty();
    	}
       /* var phonenolisthtml='<li data-role="list-divider" class="locnameli">'+nearestCityDetails.LOC_NM+'</li>';
        $("#conferenceCallList").append( phonenolisthtml );
        */
        var phonenolisthtml='';
       
        try {
             
       
        
    	if(result.invocationResult.resultSet.length){
    		var phoneResultset=result.invocationResult.resultSet;
    		
    		 
    		$(phoneResultset).each(function( pindex ,phoneitem) {
    			
    			if(needtoFindNo.length || rescount >= 3){
    				
    				
    				$(needtoFindNo).each(function(phoin ,phoitem) {
    					
    					if(phoitem==phoneitem.SP_ID){
    						rescount++;
    						needtoFindNo.splice(phoin, 1);
    						servicePIds+=phoneitem.SP_ID.toString();
    						phonenolisthtml= '<li>\
    	    		            <p class="collicon">'+phoneitem.SRV_DESC+'</p>\
    	    				      <h2>'+phoneitem.DIALIN_NUM+'</h2>\
    	    				    <p class="ui-li-aside"><a href="tel:'+phoneitem.DIALIN_NUM+'"><button class="ui-btn callbutton">Call Now</button></a></p>\
    	    		           </li>';
    	    			
    	    			 $("#conferenceCallList").append( phonenolisthtml );
    						
    				 	 }
    					
    				});
    				
    			}else{
    			
    			rescount++;
    			
    			servicePIds+=phoneitem.SP_ID.toString();
    			phonenolisthtml= '<li>\
    		            <p class="collicon">'+phoneitem.SRV_DESC+'</p>\
    				      <h2>'+phoneitem.DIALIN_NUM+'</h2>\
    				    <p class="ui-li-aside"><a href="tel:'+phoneitem.DIALIN_NUM+'"><button class="ui-btn callbutton">Call Now</button></a></p>\
    		           </li>';
    			
    			 $("#conferenceCallList").append( phonenolisthtml );
    			 
    			}
    		});
    		
    		 $("#conferenceCallList").listview('refresh');
    		 
    		 if(rescount <= 2){
    			 needtoFindNo=[];
    			 console.log("servicePIds "+servicePIds);
    			 if(servicePIds.indexOf("1") < 0){
    				 needtoFindNo.push(1);
    			 }
    			 if(servicePIds.indexOf("2") < 0){
    				 needtoFindNo.push(2);
    			 }
    			 if(servicePIds.indexOf("3") < 0){
    				 needtoFindNo.push(3);
    			 }
    			 
    			// alert("Finding others No's "+nearestCityDetails.LOC_NM, null, Messages.application_title,"OK");
    			 console.log("need sp no "+needtoFindNo);
    			 getPocketCitySuccess(cityResultset1);
    			 
    			 
    			 
    		 }else{
    			 
    			 rescount=0;
    			 servicePIds="";
    			 needtoFindNo=[];
    		 }
    		 
    		
    	}else{
    		
    		 
    		  var conf=confirm( "No Phone numbers found. Select OK to get other than the city "+nearestCityDetails.LOC_NM  );
    			
    			if(conf==true){
    				//userInfo.countryCode=getLocationDetails("countryCode"); //1 for country name
    				getPocketCitySuccess(cityResultset1);
    				//getPhoneNumberDetails(20);
    			}
    	}
        }
        catch(err) {
            document.getElementById("demo").innerHTML = err.message;
        }
    }

    function getPhoneNumberFailure(result){
    	BonD.busierHide('login');
    	alert(Messages.please_check_connection, null, Messages.application_title,"OK");
    	 
    }
    
    
    
    //county
    
    /*
    function getCurCuntry(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(cuntrySuccess,locationError,options);
    }else{
	    	console.log("not supp geo");
	    	//element.innerHTML= "Geolocation is not supported by this browser.";
    }
    }
    
   
    
    
    function cuntrySuccess(position) {
        $.getJSON('http://ws.geonames.org/countryCode', {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            type: 'JSON'
        }, function(result) {
        	console.log("result json" +JSON.stringify(result));
            alert(result.countryName);
        });
    }
      */
   /* function getCities(cid){
    	
    	var listCity=[];
    	if(cid=="IN"){
    		
    		listCity=[
    		          
    		          {
    		        	"LOC_NM":"BANGALORE",
    		        	"LOC_ID":"1",
    		        	"CNTRY_ID":"IN"
    		        	
    		          },
    		          {
      		        	"LOC_NM":"CHENNAI",
      		        	"LOC_ID":"2",
      		        	"CNTRY_ID":"IN"
      		        	
      		          },
    		          {
      		        	"LOC_NM":"HYDERABAD",
      		        	"LOC_ID":"3",
      		        	"CNTRY_ID":"IN"
      		        	
      		          },
    		          {
      		        	"LOC_NM":"KOLKATA",
      		        	"LOC_ID":"4",
      		        	"CNTRY_ID":"IN"
      		        	
      		          },
    		          {
      		        	"LOC_NM":"MUMBAI",
      		        	"LOC_ID":"5",
      		        	"CNTRY_ID":"IN"
      		        	
      		          }];
    				
    				
    				
    		
    		
    	}
    	
    	return listCity;
    	
    	
    }*/