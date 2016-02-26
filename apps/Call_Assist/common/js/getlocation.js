var countryname;
var cityname;
var latitude='';
var longitude;
var countryname1;
var cityname1;
var latitude1='';
var longitude1;
var stdcode="";
var citycd="21";
var stdcode1="";
var loadgps="";
var country="";
var country1="";
var script = document.createElement('script');
var options={
        enableHighAccuracy: true
        ,timeout : 10000
};
function getLocation() {
	busy = new WL.BusyIndicator ();
	busy.show();
	$.ajax({
	    type: "GET",  
	   
	    url: "http://freegeoip.net/json/",
	    
	    success: function(result){  
	        
	    	 getcountry(result);
	    	
	    },
	    error: function(XMLHttpRequest, textStatus, errorThrown) { 
	    	alert(errorThrown);
	    }       
	});
}
	function getcountry(result){
	country = result.country_code;
		
	if(country=="IN" || country=="NZ"){
		$.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyBaKx9iQrPQuOmAc2DkMRgjFdT0_XTdbmE&sensor=false&v=3&libraries=geometry", function(){
		    
			 if (navigator.geolocation) {
			    	console.log("location starts >>"+(new Date()));
			    	datedif=new Date();
			        navigator.geolocation.getCurrentPosition(showPosition, showError,options);
			    } else { 
			        alert( "Geolocation is not supported");}
		});
		
	}
	else{
		countryname=country;
		localStorage.setItem("countryname" ,countryname );
		$("#countrySelectdo option:first-child").prop("selected", false);
		$("#countrySelectdo option[value='"+countryname+"']").prop("selected", true);
		
		$("#countrySelectdo").selectmenu("refresh", true);
	
		$.ajax({
		    type: "GET",  
		   
		    url: servicehost+"dosanddonts.php",
		    data: {
		    	 
		    	CNTRY_CD:countryname
		    	
		    } ,
		    success: function(result){  
		        
		    	 
		    	dosuccess(result);
		    },
		    error: function(XMLHttpRequest, textStatus, errorThrown) { 
		    	dofail(errorThrown);
		    }       
		});
		
	}
	}  
    
function showPosition(pos) {
	
	var geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
	latitude=pos.coords.latitude;
	longitude=pos.coords.longitude;
	localStorage.setItem("latitude" ,latitude );
	localStorage.setItem("longitude" ,longitude );
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
    	if (status == google.maps.GeocoderStatus.OK) {
        	var addresscomponent=results[0].address_components;
        	var addresslength=addresscomponent.length;
        	for(var i=0;i<addresslength;i++){
        		if(addresscomponent[i].types[0]=='country'){
        			countryname=addresscomponent[i].short_name;
        			localStorage.setItem("countryname" ,countryname );
        			console.log("location ends >>"+(new Date().getTime()-datedif.getTime()));
        			//console.log("location ends >> with time diff "+get_time_diff(datedif));
        			
        		}
        		else if(addresscomponent[i].types[0]=='locality'){
        			cityname=addresscomponent[i].short_name;
        			localStorage.setItem("cityname" ,cityname );
        		}
        	}
        
       getnearest();	
       	
	} 
    	
});
}

var islocation=true;
function showError(error) {
	if (isAndroidEnv()){
		
	
if (confirm('Enable GPS!')) {
	islocation=true;
	loadgps=true;
		$.mobile.changePage( "#home",{ 
			allowSamePageTransition : true,
		      transition              : 'none',
		      showLoadMsg             : false,
		     });
		busy.hide();            
        	 WL.App.sendActionToNative("opensettings", { address: $('#address').val()});  
        
       }
	else{
		countryHTML='<option value="please">Please Select a Country</option>';
		$(countryHTML).insertBefore("#countrySelectdo option:nth-child(1)");
		$("#countrySelectdo option:first-child").prop("selected", false);
		$("#countrySelectdo option[value='please']").prop("selected", true);
		$("#countrySelectdo").selectmenu("refresh", true);
		  busy.hide();
		  islocation=true;
	}
	    	
	}
	else{
		countryHTML='<option value="please">Please Select a Country</option>';
		$(countryHTML).insertBefore("#countrySelectdo option:nth-child(1)");
		$("#countrySelectdo option:first-child").prop("selected", false);
		$("#countrySelectdo option[value='please']").prop("selected", true);
		$("#countrySelectdo").selectmenu("refresh", true);
		alert("Please enable GPS!");
		  busy.hide();
	}
	    	   
	    
	
//      $(".locationtry").show();
	
      
}
function getnearest(){
	//countryname='SG';
	countryname=localStorage.getItem('countryname');
	if(countryname=='IN'|| countryname=='NZ'){
		
			$("#countrySelectdo option:first-child").prop("selected", false);
			$("#countrySelectdo option[value='"+countryname+"']").prop("selected", true);
			
			$("#countrySelectdo").selectmenu("refresh", true);
		 
		
		
		$.ajax({
		    type: "GET",  
		    url: servicehost+"city.php",
		    
		    success: function(result){  
		        
		       
		        getPocketCitySuccess(result);
		    },
		    error: function(XMLHttpRequest, textStatus, errorThrown) { 
		    	getPocketCityFailure(errorThrown);
		    }       
		});
		
		
		 
   	 
	}
	
		
	 
}
function getPocketCitySuccess(result){
	var distances=[];
	var currlocCoords={};
	var cityResultset=[];
	latitude=localStorage.getItem('latitude');
	longitude=localStorage.getItem('longitude');
	if(latitude ==''){
		if(localStorage.getItem('countryname')=='IN'){
			currlocCoords.latitude='12.9715987';
			currlocCoords.longitude='77.5945627';	
		}
		else{
			currlocCoords.latitude='36.8406';
			currlocCoords.longitude='174.7400';
		}
		
	}
	else{
		currlocCoords.latitude=latitude;
		currlocCoords.longitude=longitude;	
	}
	
	if(result){
		console.log("calculating nearest starts >>"+(new Date()));
        datedif=new Date();
        for(var i=0;i<result.length;i++){
        	if(result[i].CNTRY_CD==localStorage.getItem('countryname')){
        		cityResultset.push(result[i]);	
        	}
        }
		
		 cityResultset1=cityResultset;
		$(cityResultset).each(function( index ,item) {
			var citiesCoord={};
			
				citiesCoord.latitude=parseFloat(item.LATITUDE);
				citiesCoord.longitude=parseFloat(item.LONGITUDE);
				var distres=getDistanceFromLatLonInKm(currlocCoords.latitude,currlocCoords.longitude,citiesCoord.latitude,citiesCoord.longitude);
				distances.push(distres);	
			
			
		 //	console.log("city dist result for  "+item.LOC_NM +" is=" +distres);
			
		});
		
		var mindistIndex=indexOfSmallest(distances);
		 var nearestCityDetails=cityResultset[mindistIndex];
		
		 console.log("getting nearest ends >>"+(new Date().getTime()-datedif.getTime()));
	//	 console.log("getting nearest ends >> with time diff "+get_time_diff(datedif));
if(localStorage.getItem('countryname')=='IN')
{
	switch (nearestCityDetails.LOC_NM) {
		case 'BANGALORE':
			stdcode1='80';
			break;
		case 'CHENNAI':
			stdcode1='44';
			break;
		case 'HYDERABAD':
			stdcode1='40';
			break;	
		case 'KOLKATA':
			stdcode1='33';
			break;	
		case 'MUMBAI':
			stdcode1='22';
			break;	
		case 'NEW DELHI':
			stdcode1='11';
			break;	
		case 'PUNE':
			stdcode1='20';
			break;	
		case 'AHMADABAD':
			stdcode1='79';
			break;	
		case 'AGRA':
			stdcode1='562';
			break;		
		case 'BHOPAL':
			stdcode1='755';
			break;		
		case 'CHANDIGARH':
			stdcode1='172';
			break;	
		case 'JAIPUR':
			stdcode1='141';
			break;	
		case 'COCHIN':
			stdcode1='484';
			break;	
		case 'COIMBATORE':
			stdcode1='422';
			break;
		case 'INDORE':
			stdcode1='731';
			break;
		case 'LUCKNOW':
			stdcode1='522';
			break;	
		case 'MADURAI':
			stdcode1='452';
			break;
		case 'HOSUR':
			stdcode1='434';
			break;	
		case 'GURGAON':
			stdcode1='124';
			break;	
		case 'NOIDA':
			stdcode1='120';
			break;		
		}
	}
else if(localStorage.getItem('countryname')=='NZ'){
	citycd=nearestCityDetails.LOC_ID;
	localStorage.setItem("citycd",nearestCityDetails.LOC_ID);
}
		localStorage.setItem("stdcode" ,stdcode1 );
		
		
//		$("#officedos table").remove();
//		$("#homeofficedos table").remove();
//		$("#mobilephonedos table").remove();
//		$("#hoteldos table").remove();
		
		
//		var dolist="<tr><td><b>1st Preference (Short Dial) : </b><br>AT&T GAC : 8117<br>Airtel SCS : 8118<br>India Meeting Place : 8778<br><br><b>2nd Preference :</b><br>AT&T GAC : 91-"+stdcode+"-33-55-88-11<br>Airtel SCS : 91-"+stdcode+"-4444-2222<br>India Meeting Place : 91-"+stdcode+"-44088778<br><br><b>3rd Preference :</b><br>AT&T GAC : 000-117 / 888-426-6840<br>Airtel SCS : 1800-102-2222</td><td style='color: red;'>Mobile Phone</td></tr>";
//		$('#officedos').append('<table><thead><tr><th>DOs</th><th>Donts</th></tr></thead><tbody>'+dolist+'</tbody></table>');
//		var dolist1="<tr><td><b>Use SUT to dial</b><br>AT&T GAC : 91-"+stdcode+"-33-55-88-11<br>Airtel SCS : 91-"+stdcode+"-4444-2222<br>India Meeting Place : 91-"+stdcode+"-44088778<br><br><b>2nd Preference</b><br>AT&T GAC : 91-"+stdcode+"-33-55-88-11<br>Airtel SCS : 91-"+stdcode+"-4444-2222<br>India Meeting Place : 91-"+stdcode+"-44088778</td><td style='color: red;'>Mobile Phone or Toll Free Number</td></tr>";
//		$('#homeofficedos').append('<table><thead><tr><th>DOs</th><th>Donts</th></tr></thead><tbody>'+dolist1+'</tbody></table>');
//		var dolist2="<tr><td>AT&T GAC : 91-"+stdcode+"-33-55-88-11<br>Airtel SCS : 91-"+stdcode+"-4444-2222<br>India Meeting Place : 91-"+stdcode+"-44088778</td><td style='color:red;'>Toll Free</td></tr>";
//		$('#mobilephonedos').append('<table><thead><tr><th>DOs</th><th>Donts</th></tr></thead><tbody>'+dolist2+'</tbody></table>');
//		var dolist3="<tr><td><b>Use SUT to dial:</b><br>AT&T GAC : 91-"+stdcode+"-33-55-88-11<br>Airtel SCS : 91-"+stdcode+"-4444-2222<br>India Meeting Place : 91-"+stdcode+"-44088778</td><td style='color:red;'>Hotel Phone or Mobile Phone</td></tr>";
//		$('#hoteldos').append('<table><thead><tr><th>DOs</th><th>Donts</th></tr></thead><tbody>'+dolist3+'</tbody></table>');
     	cityResultset1.splice(mindistIndex, 1);
		//busy.hide();
     	console.log("do donts starts >>"+(new Date()));
     	datedif=new Date();
     	$.ajax({
		    type: "GET",  
		   
		    url: servicehost+"dosanddonts.php",
		    data: {
		    	 
		    	CNTRY_CD:countryname
		    	
		    } ,
		    success: function(result){  
		        
		    	console.log("do donts ends >>"+ (new Date().getTime()-datedif.getTime()));
		    	// console.log("do donts ends >> with time diff "+get_time_diff(datedif));
		 		
		    	dosuccess(result);
		    },
		    error: function(XMLHttpRequest, textStatus, errorThrown) { 
		    	dofail(errorThrown);
		    }       
		});
     	
     	 
	}
}
function getPocketCityFailure(result){
	busy.hide();
	alert("Fail",null, Messages.application_title,"OK");
}
function indexOfSmallest(a) {
	 return a.indexOf(Math.min.apply(Math, a));
	}
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
	  var R = 6371; // Radius of the earth in km
	  var dLat = deg2rad(lat2-lat1);  // deg2rad below
	  var dLon = deg2rad(lon2-lon1); 
	  var a = 
	    Math.sin(dLat/2) * Math.sin(dLat/2) +
	    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
	    Math.sin(dLon/2) * Math.sin(dLon/2)
	    ; 
	  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	  var d = R * c; // Distance in km
	  return d;
	}

	function deg2rad(deg) {
	  return deg * (Math.PI/180);
	}
	
	
	function get_time_diff( datetime )
	{
	    var datetime = typeof datetime !== 'undefined' ? datetime : "2014-01-01 01:02:03.123456";

	    var datetime = new Date( datetime ).getTime();
	    var now = new Date().getTime();

	    if( isNaN(datetime) )
	    {
	        return "";
	    }

	    console.log( datetime + " " + now);

	    if (datetime < now) {
	        var milisec_diff = now - datetime;
	    }else{
	        var milisec_diff = datetime - now;
	    }

	    var days = Math.floor(milisec_diff / 1000 / 60 / (60 * 24));

	    var date_diff = new Date( milisec_diff );

	    return days + " Days "+ date_diff.getHours() + " Hours " + date_diff.getMinutes() + " Minutes " + date_diff.getSeconds() + " Seconds";
	}
	function getLocation1() {
		busy = new WL.BusyIndicator ();
		busy.show();
		$.ajax({
		    type: "GET",  
		   
		    url: "http://freegeoip.net/json/",
		    
		    success: function(result){  
		        
		    	 getcountry1(result);
		    	
		    },
		    error: function(XMLHttpRequest, textStatus, errorThrown) { 
		    	alert(errorThrown);
		    }       
		});
	}
	function  getcountry1(result){
		country1=result.country_code;
		
		if(localStorage.getItem('countryname') !=country1){
        	$.confirm({
        	    title: 'Location change',
        	    content: 'Your current Location is not '+localStorage.getItem('countryname')+'. Do you want to refresh? ',
        	    confirmButton: 'Yes',
        	    cancelButton: 'No',
        	    theme: 'holodark',
        	    confirm: function(){
        	    	
        	    	localStorage.setItem("countryname" ,country1 );
        	    	if(country1=="IN" || country1=="NZ" ){
        	    		$.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyBaKx9iQrPQuOmAc2DkMRgjFdT0_XTdbmE&sensor=false&v=3&libraries=geometry", function(){
        	    			if (navigator.geolocation) {
            	    	    	console.log("location starts >>"+(new Date()));
            	    	    	datedif=new Date();
            	    	        navigator.geolocation.getCurrentPosition(showPosition1, showError1,options);
            	    	    } else { 
            	    	        alert( "Geolocation is not supported");}	
        	    		});
        	    		
        	   	}
        	   	else{
        	   		countryname=country1;
        	   		
        	   		localStorage.setItem("countryname" ,countryname );
        	   		$("#countrySelectdo option:first-child").prop("selected", false);
        	   		$("#countrySelectdo option[value='"+countryname+"']").prop("selected", true);
        	   		
        	   		$("#countrySelectdo").selectmenu("refresh", true);
        	   	
        	   		$.ajax({
        	   		    type: "GET",  
        	   		   
        	   		    url: servicehost+"dosanddonts.php",
        	   		    data: {
        	   		    	 
        	   		    	CNTRY_CD:countryname
        	   		    	
        	   		    } ,
        	   		    success: function(result){  
        	   		        
        	   		    	 
        	   		    	dosuccess(result);
        	   		    },
        	   		    error: function(XMLHttpRequest, textStatus, errorThrown) { 
        	   		    	dofail(errorThrown);
        	   		    }       
        	   		});
        	   		
        	   	}
        	    		
        	    	
        	    },
        	    cancel: function(){
        	    	country1=	localStorage.getItem('countryname'); 
        	    	$("#countrySelectdo option:first-child").prop("selected", false);
        	   		$("#countrySelectdo option[value='"+country1+"']").prop("selected", true);
        	   		
        	   		$("#countrySelectdo").selectmenu("refresh", true);
        	    	$.ajax({
        	   		    type: "GET",  
        	   		   
        	   		    url: servicehost+"dosanddonts.php",
        	   		    data: {
        	   		    	 
        	   		    	CNTRY_CD:country1
        	   		    	
        	   		    } ,
        	   		    success: function(result){  
        	   		        
        	   		    	 
        	   		    	dosuccess(result);
        	   		    },
        	   		    error: function(XMLHttpRequest, textStatus, errorThrown) { 
        	   		    	dofail(errorThrown);
        	   		    }       
        	   		});
        	        // do something when No is clicked.
        	    }
        	});
        }
       	
		else{
			$("#countrySelectdo option:first-child").prop("selected", false);
	   		$("#countrySelectdo option[value='"+country1+"']").prop("selected", true);
	   		
	   		$("#countrySelectdo").selectmenu("refresh", true);
	   	
	   		$.ajax({
	   		    type: "GET",  
	   		   
	   		    url: servicehost+"dosanddonts.php",
	   		    data: {
	   		    	 
	   		    	CNTRY_CD:country1
	   		    	
	   		    } ,
	   		    success: function(result){  
	   		        
	   		    	 
	   		    	dosuccess(result);
	   		    },
	   		    error: function(XMLHttpRequest, textStatus, errorThrown) { 
	   		    	dofail(errorThrown);
	   		    }       
	   		});
		}

	   
	    }
	
	function showError1(error) {
		if (isAndroidEnv()){
			
		
	if (confirm('Enable GPS!')) {
		islocation=true;
		loadgps=true;
			$.mobile.changePage( "#home",{ 
				allowSamePageTransition : true,
			      transition              : 'none',
			      showLoadMsg             : false,
			     });
			busy.hide();            
	        	 WL.App.sendActionToNative("opensettings", { address: $('#address').val()});  
	        
	       }
		else{
			
			  busy.hide();
			  islocation=true;
		}
		    	
		}
		else{
			
			  busy.hide();
		}
		    	   
		    
		
//	      $(".locationtry").show();
		
	      
	}
function showPosition1(pos) {
		
		var geocoder = new google.maps.Geocoder();
		var latlng = new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
		latitude1=pos.coords.latitude;
		longitude1=pos.coords.longitude;
		localStorage.setItem("latitude" ,latitude );
		localStorage.setItem("longitude" ,longitude );
	    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
	    	if (status == google.maps.GeocoderStatus.OK) {
	        	var addresscomponent=results[0].address_components;
	        	var addresslength=addresscomponent.length;
	        	for(var i=0;i<addresslength;i++){
	        		if(addresscomponent[i].types[0]=='country'){
	        			countryname1=addresscomponent[i].short_name;
	        			localStorage.setItem("countryname" ,countryname1 );
	        			console.log("location ends >>"+(new Date().getTime()-datedif.getTime()));
	        			//console.log("location ends >> with time diff "+get_time_diff(datedif));
	        			
	        		}
	        		else if(addresscomponent[i].types[0]=='locality'){
	        			cityname1=addresscomponent[i].short_name;
	        			localStorage.setItem("cityname" ,cityname1 );
	        		}
	        	}
	        	     	
	        	 getnearest();  	
			} 
		    	
		});
		}
