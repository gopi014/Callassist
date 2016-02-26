
/* JavaScript content from js/MyTravel.js in folder common */

var serviceprovidername;
var datedif;
var scountryname='';
//var servicehost="http://9.121.206.90:10080/";
var servicehost="http://callingassist.mybluemix.net/";
function CallAssistance(){

	busy = new WL.BusyIndicator ();
	busy.show();
	$("#officedos table").remove();
	$("#homeofficedos table").remove();
	$("#mobilephonedos table").remove();
	$("#hoteldos table").remove();
	 
    $.ajax({
	    type: "GET",  
	    url: servicehost+'allcountry.php',
	    
	    success: function(result){  
	    	 console.log("bluemix ajax ends >>"+(new Date().getTime() - datedif.getTime()));
	    	// console.log("bluemix ajax >> with time diff "+get_time_diff(datedif));
		 		//get_time_diff(datedif);
	    	getCsuccess(result);
	    	 
	    },
	    error: function(XMLHttpRequest, textStatus, errorThrown) { 
	    	getCfail(errorThrown);
	    }       
	});
	
}


function getCsuccess(result){
	 
	//console.log("data found");	
	$("#countrySelectdo option").remove();
	if(result){
		var cres=result;
		
		var countryHTML="";
//		countryHTML='<option value="IN">India</option>';
//		$("#countrySelectdo").append(countryHTML);
		$(cres).each(function( index ,item) {
			//console.log(item);	
			countryHTML='<option value="'+item.CNTRY_CD+'">'+item.CNTRY_NM+'</option>';
			$("#countrySelectdo").append(countryHTML);
			
			
			
		}
		);
		
		//console.log("countryHTML "+countryHTML);
		$.mobile.changePage( "#do-dont",{ 
			allowSamePageTransition : true,
		      transition              : 'none',
		      showLoadMsg             : false,
		     });
		
		$("#countrySelectdo").selectmenu("refresh", true);
		busy.hide();
		if(localStorage.getItem('countryname') != null){
			stdcode=localStorage.getItem('stdcode');
		//	getnearest();
			getLocation1();	
		}
		else{
			
			getLocation();	
		}
		
		
		//$("#countrySelect").html(countryHTML);
		
	}else{
		console.log("No data");
		
	}
	
	
}


function getCfail(result){
	
console.log("Error while geting data");
busy.hide();
	
}


$(function(){
	
	
	$(".travelsimplans").on("click",function(){
		busy = new WL.BusyIndicator ();
		busy.show();
		$.mobile.changePage( "#country",{ 
			allowSamePageTransition : true,
		      transition              : 'none',
		      showLoadMsg             : false,
		     });
		
		//console.log("i clicked SIM");
		
		
		var invocationData = {
                adapter : 'MyTravelAdapter',
                procedure : 'getCountry1',
                parameters : []
        };

        WL.Client.invokeProcedure(invocationData, {
            onSuccess : getCsuccess1,
            onFailure : getCfail1
        });
    	
	});
	
	
	function getCsuccess1(result){
		 
		//console.log("data found");	
		$("#countrySelect").empty();
		
		if(result.invocationResult.resultSet){
			var cres=result.invocationResult.resultSet;
			
			var countryHTML="";
			countryHTML='<option value="select">Please select a country</option>';
			$("#countrySelect").append(countryHTML);
			$(cres).each(function( index ,item) {
				//console.log(item);	
				countryHTML='<option value="'+item.CNTRY_CD+'">'+item.CNTRY_NM+'</option>';
				$("#countrySelect").append(countryHTML);
				
				
				
				
			}
			);
			
		//	console.log("countryHTML "+countryHTML);
			$("#countrySelect").selectmenu("refresh", true);
			busy.hide();
			
			//$("#countrySelect").html(countryHTML);
			
		}else{
		//	console.log("No data");
			
		}
		
		
	}
	
	
function getCfail1(result){
		
	console.log("Error while geting data");
		busy.hide();
		
	}
	
	
	
});


function getdosanddonts(){
	busy = new WL.BusyIndicator ();
	busy.show();
	var selectedcountry = document.getElementById("countrySelectdo").value;
	if(selectedcountry=='IN'){
		countryname='IN';
		getnearest();
	}
//	else if(selectedcountry=='NZ'){
//		countryname='NZ';
//		getnearest(countryname);
//	}
	else{
		stdcode='';
		scountryname=selectedcountry;
		$.ajax({
		    type: "GET",  
		   
		    url: servicehost+"dosanddonts.php",
		    data: {
		    	 
		    	CNTRY_CD:selectedcountry
		    	
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

function dosuccess(result){
	$("#countrySelectdo").selectmenu("refresh", true);
	$("#officedos table").remove();
	$("#homeofficedos table").remove();
	$("#mobilephonedos table").remove();
	$("#hoteldos table").remove();
	$("#dialext table").remove();
	$("#shortdial table").remove();
	var resultset=result;
	var length=resultset.length;
	var officedosvalue='';
	var homedosvalue='';
	var mobilephonedosvalue='';
	var hoteldosvalue='';
	var dialextvalue='';
	var shortdialvalue='';
	console.log("do donts disp starts >>"+(new Date()));
	datedif=new Date();
	
	for(var i=0; i<length;i++){
		
		stdcode=localStorage.getItem('stdcode');
		
		if(resultset[i].LOC_ID == '1'){
		  var officedos=nl2br(resultset[i].DOS_DESC);
		  var officedos1;
		  if(!islocation){
			   officedos1=officedos.replace(/--/g, stdcode);
		  }else{
			  officedos1=officedos.replace(/XX/g, stdcode);
		  }
		  
			officedosvalue +='<tr><td>'+officedos1+'</td><td style="color: red;">'+nl2br(resultset[i].DONTS_DESC)+'</td></tr>';
		
		}
		
		if(resultset[i].LOC_ID =='2'){
			if(localStorage.getItem('countryname')=='NZ' || scountryname =='NZ'){
				if(citycd==resultset[i].CITY_ID){
					var homedos=nl2br(resultset[i].DOS_DESC);
					var homedos1;
					if(!islocation){
						homedos1=homedos.replace(/--/g, stdcode);
					  }else{
						  homedos1=homedos.replace(/XX/g, stdcode);
					  }
					homedosvalue +='<tr><td>'+homedos1+'</td><td style="color: red;">'+nl2br(resultset[i].DONTS_DESC)+'</td></tr>';
						
				}
			}
			else{
				var homedos=nl2br(resultset[i].DOS_DESC);
				var homedos1;
				if(!islocation){
					homedos1=homedos.replace(/--/g, stdcode);
				  }else{
					  homedos1=homedos.replace(/XX/g, stdcode);
				  }
				homedosvalue +='<tr><td>'+homedos1+'</td><td style="color: red;">'+nl2br(resultset[i].DONTS_DESC)+'</td></tr>';
					
			}
			}
		if(resultset[i].LOC_ID=='3'){
			if(localStorage.getItem('countryname')=='NZ' || scountryname =='NZ'){
				if(citycd==resultset[i].CITY_ID){
					var mobiledos=nl2br(resultset[i].DOS_DESC);
					var mobiledos1;
					 
					if(!islocation){
						mobiledos1=mobiledos.replace(/--/g, stdcode);
					  }else{
						  mobiledos1=mobiledos.replace(/XX/g, stdcode);
					  }
					mobilephonedosvalue +='<tr><td>'+mobiledos1+'</td><td style="color: red;">'+nl2br(resultset[i].DONTS_DESC)+'</td></tr>';
						
				}
			}
			else{
				var mobiledos=nl2br(resultset[i].DOS_DESC);
				var mobiledos1;
				 
				if(!islocation){
					mobiledos1=mobiledos.replace(/--/g, stdcode);
				  }else{
					  mobiledos1=mobiledos.replace(/XX/g, stdcode);
				  }
				mobilephonedosvalue +='<tr><td>'+mobiledos1+'</td><td style="color: red;">'+nl2br(resultset[i].DONTS_DESC)+'</td></tr>';
					
			}
			}
		if(resultset[i].LOC_ID=='4'){
			var hoteldos=nl2br(resultset[i].DOS_DESC);
			var hoteldos1;
		 	if(!islocation){
				hoteldos1=hoteldos.replace(/--/g, stdcode);
			  }else{
				  hoteldos1=hoteldos.replace(/XX/g, stdcode);
			  }
			hoteldosvalue +='<tr><td>'+hoteldos1+'</td><td style="color: red;">'+nl2br(resultset[i].DONTS_DESC)+'</td></tr>';
			}
		if(resultset[i].LOC_ID=='5'){
			var dialext=resultset[i].DOS_DESC;
			var dialext1;
		 	if(!islocation){
		 		dialext1=dialext.replace(/--/g, stdcode);
			  }else{
				  dialext1=dialext.replace(/XX/g, stdcode);
			  }
		 	dialextvalue =dialext1;
			}
		if(resultset[i].LOC_ID=='6'){
			if(localStorage.getItem('countryname')=='NZ' || scountryname =='NZ'){
				if(citycd==resultset[i].CITY_ID){
					var shortdial=resultset[i].DOS_DESC;
					var shortdial1;
				 	if(!islocation){
				 		shortdial1=shortdial.replace(/--/g, stdcode);
					  }else{
						  shortdial1=shortdial.replace(/XX/g, stdcode);
					  }
				 	shortdialvalue =shortdial1;	
				}
			}
			else{
				var shortdial=resultset[i].DOS_DESC;
				var shortdial1;
			 	if(!islocation){
			 		shortdial1=shortdial.replace(/--/g, stdcode);
				  }else{
					  shortdial1=shortdial.replace(/XX/g, stdcode);
				  }
			 	shortdialvalue =shortdial1;	
			}
			
			}
	}
	$('#officedos').append('<table style="border-collapse: inherit;"><thead><tr><th style="width:70%;">DOs</th><th style="width:30%;">Donts</th></tr></thead><tbody>'+officedosvalue+'</tbody></table>');
	$('#homeofficedos').append('<table style="border-collapse: inherit;"><thead><tr><th style="width:70%;">DOs</th><th style="width:30%;">Donts</th></tr></thead><tbody>'+homedosvalue+'</tbody></table>');
	$('#mobilephonedos').append('<table style="border-collapse:inherit ;"><thead><tr><th style="width:70%;">DOs</th><th style="width:30%;">Donts</th></tr></thead><tbody>'+mobilephonedosvalue+'</tbody></table>');
	$('#hoteldos').append('<table style="border-collapse: inherit;"><thead><tr><th style="width:70%;">DOs</th><th style="width:30%;">Donts</th></tr></thead><tbody></tbody>'+hoteldosvalue+'</table>');
	$('#dialext').append('<table style="border-collapse: inherit;"><thead><tr><th style="width:20%;">S.no</th><th style="width:80%;">Steps</th></tr></thead><tbody>'+dialextvalue+'</tbody></table>');
	$('#shortdial').append('<table style="border-collapse: inherit;"><thead><tr><th style="width:20%;">Number</th><th style="width:80%;">Description</th></tr></thead><tbody>'+shortdialvalue+'</tbody></table>');
	
	busy.hide();
	console.log("do donts disp ends >>"+(new Date().getTime()-datedif.getTime()));
//	console.log("do donts disp ends >> with time diff "+get_time_diff(datedif));
		
}
function dofail(result){
	busy.hide();
	alert("fail",null,"RoamAssist",'OK');
}
function submittingcountry()
{
	busy = new WL.BusyIndicator ();
	busy.show();
   var ul= $("#bestplan li").length;
   var u11=$("#secondbest li").length;
   var ul2=$("#thirdbest li").length;
   if((ul != 0) ||(u11 != 0) || (ul2 != 0)){
	   $('#bestplan li').remove();
	   $('#secondbest li').remove();
	   $('#thirdbest li').remove();
	   var selectedcountry1 = document.getElementById("countrySelect").value;
	   if(selectedcountry1=='select' || selectedcountry1==''){
			alert("Please Select a Country" ,null,"RoamAssist",'OK');  
			busy.hide();
	   }
	   else{
		   
	   
		var invocationData = {
	            adapter : 'MyTravelAdapter',
	            procedure : 'getvplans',
	            parameters : [selectedcountry1]
	    };

	    WL.Client.invokeProcedure(invocationData, {
	        onSuccess : vplansuccess,
	        onFailure : vplanfail
	    });
	   }
   }
   else{
	  

	   var selectedcountry1 = document.getElementById("countrySelect").value;
	   if(selectedcountry1=='select' || selectedcountry1==''){
			alert("Please Select a Country" ,null,"RoamAssist",'OK');  
			busy.hide();
	   }
	   else{
		   var invocationData = {
		            adapter : 'MyTravelAdapter',
		            procedure : 'getvplans',
		            parameters : [selectedcountry1]
		    };

		    WL.Client.invokeProcedure(invocationData, {
		        onSuccess : vplansuccess,
		        onFailure : vplanfail
		    });
	   }
		

	   
   }
	
}
function vplansuccess(result){
	//alert("sucess");
	var invocationresult=result.invocationResult;
	var resultset1=invocationresult.resultSet;
	var length=resultset1.length;
	var countryn=document.getElementById('countrySelect');
	var countryname=countryn.options[countryn.selectedIndex].text;
	//var dura=document.getElementById('duration');
	//var duration=dura.options[dura.selectedIndex].text;
    $('#countryselectname').html(countryname);
   // $('#countryselectduration').html(duration);
    var bestvoice=null;
    var sbestvoice=null;
    var tbestvoice=null;
    var btraiffcounter=0;
    var straiffcounter=0;
    var ttraiffcounter=0;
     for(var i=0; i<length;i++)
			{
    	      
				if(resultset1[i].RECOM_VAL =='1'){
					if(bestvoice== null){
			    
				var img=0;
				switch (resultset1[i].SPR_CD) {
				case 1:
					img='<img src="images/brand1.png" style="height: 100%;" />';
					break;
				case 2:
					img='<img src="images/brand2.png" style="height: 100%;" />';
					break;
				case 3:
					img='<img src="images/brand3.png" style="height: 100%;" />';
					break;
				
				
				}
				$('#bestplan').append('<li class="ui-li-has-thumb ui-first-child"><a class="ui-btn" id="bestvoice"href="#" data-theme="c" onclick="plandetails(id);">'+img+'<h2 id="bestplanvoice">Voice Service - '+resultset1[i].SPR_NM+'</h2></a></li>');
				bestvoice=resultset1[i].SPR_NM;
				besttraiff.monthlyrental[btraiffcounter]=resultset1[i].MONTHLY_RENTAL;
				besttraiff.incomingcall[btraiffcounter]=resultset1[i].INCOMING_CALL_COST;
				besttraiff.LOCAL_OUTGOING[btraiffcounter]=resultset1[i].LOCAL_OUTGOING;
				besttraiff.Landline[btraiffcounter]=resultset1[i].LANDLINE;
				besttraiff.SAME_NET[btraiffcounter]=resultset1[i].SAME_NET;
				besttraiff.OTHER_NET[btraiffcounter]=resultset1[i].OTHER_NET;
				besttraiff.CALL_TO_INDIA[btraiffcounter]=resultset1[i].CALL_TO_INDIA;
				besttraiff.REST_OF_WORLD[btraiffcounter]=resultset1[i].REST_OF_WORLD;
				besttraiff.SMS_LOCAL[btraiffcounter]=resultset1[i].SMS_LOCAL;
				besttraiff.SMS_INTRL[btraiffcounter]=resultset1[i].SMS_INTRL;
				besttraiff.plandesc[btraiffcounter]=resultset1[i].PLAN_DESC;
				besttraiff.ANYTIME_FREE_MINS[btraiffcounter]=resultset1[i].ANYTIME_FREE_MINS;
				besttraiff.SERVICE_CHARGE[btraiffcounter]=resultset1[i].SERVICE_CHARGE;
				besttraiff.ADDL_NOTES[btraiffcounter]=resultset1[i].ADDL_NOTES;
				besttraiff.planname=resultset1[i].SPR_NM;
				btraiffcounter++;
					}
				else{
					besttraiff.monthlyrental[btraiffcounter]=resultset1[i].MONTHLY_RENTAL;
					besttraiff.incomingcall[btraiffcounter]=resultset1[i].INCOMING_CALL_COST;
					besttraiff.LOCAL_OUTGOING[btraiffcounter]=resultset1[i].LOCAL_OUTGOING;
					besttraiff.Landline[btraiffcounter]=resultset1[i].LANDLINE;
					besttraiff.SAME_NET[btraiffcounter]=resultset1[i].SAME_NET;
					besttraiff.OTHER_NET[btraiffcounter]=resultset1[i].OTHER_NET;
					besttraiff.CALL_TO_INDIA[btraiffcounter]=resultset1[i].CALL_TO_INDIA;
					besttraiff.REST_OF_WORLD[btraiffcounter]=resultset1[i].REST_OF_WORLD;
					besttraiff.SMS_LOCAL[btraiffcounter]=resultset1[i].SMS_LOCAL;
					besttraiff.SMS_INTRL[btraiffcounter]=resultset1[i].SMS_INTRL;
					besttraiff.plandesc[btraiffcounter]=resultset1[i].PLAN_DESC;
					besttraiff.ANYTIME_FREE_MINS[btraiffcounter]=resultset1[i].ANYTIME_FREE_MINS;
					besttraiff.SERVICE_CHARGE[btraiffcounter]=resultset1[i].SERVICE_CHARGE;
					besttraiff.ADDL_NOTES[btraiffcounter]=resultset1[i].ADDL_NOTES;
					btraiffcounter++;
					
				}
				}
				
				if(resultset1[i].RECOM_VAL =='2'){
				    if(sbestvoice==null){
					var img=0;
					switch (resultset1[i].SPR_CD) {
					case 1:
						img='<img src="images/brand1.png" style="height: 100%;" />';
						break;
					case 2:
						img='<img src="images/brand2.png" style="height: 100%;" />';
						break;
					case 3:
						img='<img src="images/brand3.png" style="height: 100%;" />';
						break;
					
					
					}
					$('#secondbest').append('<li class="ui-li-has-thumb ui-first-child"><a class="ui-btn" id="secondvoice" href="#" data-theme="c" onclick="plandetails(id);">'+img+'<h2 id="bestplanvoice">Voice Service - '+resultset1[i].SPR_NM+'</h2></a></li>');
					sbestvoice=resultset1[i].SPR_NM;
					sbesttraiff.monthlyrental[straiffcounter]=resultset1[i].MONTHLY_RENTAL;
					sbesttraiff.incomingcall[straiffcounter]=resultset1[i].INCOMING_CALL_COST;
					sbesttraiff.LOCAL_OUTGOING[straiffcounter]=resultset1[i].LOCAL_OUTGOING;
					sbesttraiff.Landline[straiffcounter]=resultset1[i].LANDLINE;
					sbesttraiff.SAME_NET[straiffcounter]=resultset1[i].SAME_NET;
					sbesttraiff.OTHER_NET[straiffcounter]=resultset1[i].OTHER_NET;
					sbesttraiff.CALL_TO_INDIA[straiffcounter]=resultset1[i].CALL_TO_INDIA;
					sbesttraiff.REST_OF_WORLD[straiffcounter]=resultset1[i].REST_OF_WORLD;
					sbesttraiff.SMS_LOCAL[straiffcounter]=resultset1[i].SMS_LOCAL;
					sbesttraiff.SMS_INTRL[straiffcounter]=resultset1[i].SMS_INTRL;
					sbesttraiff.plandesc[straiffcounter]=resultset1[i].PLAN_DESC;
					sbesttraiff.ANYTIME_FREE_MINS[straiffcounter]=resultset1[i].ANYTIME_FREE_MINS;
					sbesttraiff.SERVICE_CHARGE[straiffcounter]=resultset1[i].SERVICE_CHARGE;
					sbesttraiff.ADDL_NOTES[straiffcounter]=resultset1[i].ADDL_NOTES;
					
					sbesttraiff.planname=resultset1[i].SPR_NM;
					straiffcounter++;
					}
				else{
					sbestvoice=resultset1[i].SPR_NM;
					sbesttraiff.monthlyrental[straiffcounter]=resultset1[i].MONTHLY_RENTAL;
					sbesttraiff.incomingcall[straiffcounter]=resultset1[i].INCOMING_CALL_COST;
					sbesttraiff.LOCAL_OUTGOING[straiffcounter]=resultset1[i].LOCAL_OUTGOING;
					sbesttraiff.Landline[straiffcounter]=resultset1[i].LANDLINE;
					sbesttraiff.SAME_NET[straiffcounter]=resultset1[i].SAME_NET;
					sbesttraiff.OTHER_NET[straiffcounter]=resultset1[i].OTHER_NET;
					sbesttraiff.CALL_TO_INDIA[straiffcounter]=resultset1[i].CALL_TO_INDIA;
					sbesttraiff.REST_OF_WORLD[straiffcounter]=resultset1[i].REST_OF_WORLD;
					sbesttraiff.SMS_LOCAL[straiffcounter]=resultset1[i].SMS_LOCAL;
					sbesttraiff.SMS_INTRL[straiffcounter]=resultset1[i].SMS_INTRL;
					sbesttraiff.plandesc[straiffcounter]=resultset1[i].PLAN_DESC;
					sbesttraiff.ANYTIME_FREE_MINS[straiffcounter]=resultset1[i].ANYTIME_FREE_MINS;
					sbesttraiff.SERVICE_CHARGE[straiffcounter]=resultset1[i].SERVICE_CHARGE;
					sbesttraiff.ADDL_NOTES[straiffcounter]=resultset1[i].ADDL_NOTES;
					straiffcounter++;
					
				}
			}
                  if(resultset1[i].RECOM_VAL =='3'){
				    if(tbestvoice==null){
					var img=0;
					switch (resultset1[i].SPR_CD) {
					case 1:
						img='<img src="images/brand1.png" style="height: 100%;" />';
						break;
					case 2:
						img='<img src="images/brand2.png" style="height: 100%;" />';
						break;
					case 3:
						img='<img src="images/brand3.png" style="height: 100%;" />';
						break;
					
					
					}
					$('#thirdbest').append('<li class="ui-li-has-thumb ui-first-child"><a class="ui-btn" id="thirdvoice" href="#" data-theme="c" onclick="plandetails(id);">'+img+'<h2 id="bestplanvoice">Voice Service - '+resultset1[i].SPR_NM+'</h2></a></li>');
					tbestvoice=resultset1[i].SPR_NM;
					
					tbesttraiff.monthlyrental[ttraiffcounter]=resultset1[i].MONTHLY_RENTAL;
					tbesttraiff.incomingcall[ttraiffcounter]=resultset1[i].INCOMING_CALL_COST;
					tbesttraiff.LOCAL_OUTGOING[ttraiffcounter]=resultset1[i].LOCAL_OUTGOING;
					tbesttraiff.Landline[ttraiffcounter]=resultset1[i].LANDLINE;
					tbesttraiff.SAME_NET[ttraiffcounter]=resultset1[i].SAME_NET;
					tbesttraiff.OTHER_NET[ttraiffcounter]=resultset1[i].OTHER_NET;
					tbesttraiff.CALL_TO_INDIA[ttraiffcounter]=resultset1[i].CALL_TO_INDIA;
					tbesttraiff.REST_OF_WORLD[ttraiffcounter]=resultset1[i].REST_OF_WORLD;
					tbesttraiff.SMS_LOCAL[ttraiffcounter]=resultset1[i].SMS_LOCAL;
					tbesttraiff.SMS_INTRL[ttraiffcounter]=resultset1[i].SMS_INTRL;
					tbesttraiff.plandesc[ttraiffcounter]=resultset1[i].PLAN_DESC;
					tbesttraiff.ANYTIME_FREE_MINS[ttraiffcounter]=resultset1[i].ANYTIME_FREE_MINS;
					tbesttraiff.SERVICE_CHARGE[ttraiffcounter]=resultset1[i].SERVICE_CHARGE;
					tbesttraiff.ADDL_NOTES[ttraiffcounter]=resultset1[i].ADDL_NOTES;
					tbesttraiff.planname=resultset1[i].SPR_NM;
					ttraiffcounter++;
					}
			}
                  else{
                	tbesttraiff.monthlyrental[ttraiffcounter]=resultset1[i].MONTHLY_RENTAL;
  					tbesttraiff.incomingcall[ttraiffcounter]=resultset1[i].INCOMING_CALL_COST;
  					tbesttraiff.LOCAL_OUTGOING[ttraiffcounter]=resultset1[i].LOCAL_OUTGOING;
  					tbesttraiff.Landline[ttraiffcounter]=resultset1[i].LANDLINE;
  					tbesttraiff.SAME_NET[ttraiffcounter]=resultset1[i].SAME_NET;
  					tbesttraiff.OTHER_NET[ttraiffcounter]=resultset1[i].OTHER_NET;
  					tbesttraiff.CALL_TO_INDIA[ttraiffcounter]=resultset1[i].CALL_TO_INDIA;
  					tbesttraiff.REST_OF_WORLD[ttraiffcounter]=resultset1[i].REST_OF_WORLD;
  					tbesttraiff.SMS_LOCAL[ttraiffcounter]=resultset1[i].SMS_LOCAL;
  					tbesttraiff.SMS_INTRL[ttraiffcounter]=resultset1[i].SMS_INTRL;
  					tbesttraiff.plandesc[ttraiffcounter]=resultset1[i].PLAN_DESC;
  					tbesttraiff.ANYTIME_FREE_MINS[ttraiffcounter]=resultset1[i].ANYTIME_FREE_MINS;
  					tbesttraiff.SERVICE_CHARGE[ttraiffcounter]=resultset1[i].SERVICE_CHARGE;
  					tbesttraiff.ADDL_NOTES[ttraiffcounter]=resultset1[i].ADDL_NOTES;
                	  ttraiffcounter++;
                	  
                  }
				}
     var selectedcountry1 = document.getElementById("countrySelect").value;
     
   	var invocationData = {
               adapter : 'MyTravelAdapter',
               procedure : 'getdplans',
               parameters : [selectedcountry1]
       };

       WL.Client.invokeProcedure(invocationData, {
           onSuccess : dplansuccess,
           onFailure : dplanfail
       });
	
}
function vplanfail(result){
	alert("failed in getting Voice plan" ,null,"RoamAssist",'OK');
	busy.hide();
} 

function dplansuccess(result){
	var invocationresult=result.invocationResult;
	var resultset1=invocationresult.resultSet;
	var length=resultset1.length;
	var bestdata=null;
	var sbestdata=null;
	var tbestdata=null;
	var btraiffdcounter=0;
	var straiffdcounter=0;
	var ttraiffdcounter=0;
	for(var i=0; i<length;i++)
		{
		
			if(resultset1[i].RECOM_VAL =='1'){
				
				if(bestdata == null){
	        
			var img=0;
			switch (resultset1[i].SPR_CD) {
			case 1:
				img='<img src="images/brand1.png" style="height: 100%;"/>';
				break;
			case 2:
				img='<img src="images/brand2.png" style="height: 100%;"/>';
				break;
			case 3:
				img='<img src="images/brand3.png" style="height: 100%;"/>';
				break;
			
			
			}
			
			$('#bestplan').append('<li class="ui-li-has-thumb ui-last-child"><a id="data1" class="ui-btn" href="#" data-theme="c" onclick="plandetails(id);">'+img+'<h2 id="bestplandata">Data Service - '+resultset1[i].SPR_NM+'</h2></a></li>');
			bestdata=resultset1[i].SPR_NM;
			btraiffdata.plandesc[btraiffdcounter]=resultset1[i].PLAN_DESC;
			btraiffdata.RENTAL[btraiffdcounter]=resultset1[i].RENTAL;
			btraiffdata.FREE_USAGE[btraiffdcounter]=resultset1[i].FREE_USAGE;
			btraiffdata.OVERAGE_MB[btraiffdcounter]=resultset1[i].OVERAGE_MB;
			btraiffdata.VALIDITY[btraiffdcounter]=resultset1[i].VALIDITY;
			btraiffdata.RATE_PER_MB[btraiffdcounter]=resultset1[i].RATE_PER_MB;
			btraiffdata.BILL_INCR[btraiffdcounter]=resultset1[i].BILL_INCR;
			btraiffdata.ADDL_NOTES[btraiffdcounter]=resultset1[i].ADDL_NOTES;
			btraiffdata.planname=resultset1[i].SPR_NM;
			btraiffdcounter++;
			
				}
				else{
					btraiffdata.plandesc[btraiffdcounter]=resultset1[i].PLAN_DESC;
					btraiffdata.RENTAL[btraiffdcounter]=resultset1[i].RENTAL;
					btraiffdata.FREE_USAGE[btraiffdcounter]=resultset1[i].FREE_USAGE;
					btraiffdata.OVERAGE_MB[btraiffdcounter]=resultset1[i].OVERAGE_MB;
					btraiffdata.VALIDITY[btraiffdcounter]=resultset1[i].VALIDITY;
					btraiffdata.RATE_PER_MB[btraiffdcounter]=resultset1[i].RATE_PER_MB;
					btraiffdata.BILL_INCR[btraiffdcounter]=resultset1[i].BILL_INCR;
					btraiffdata.ADDL_NOTES[btraiffdcounter]=resultset1[i].ADDL_NOTES;
					btraiffdata.planname=resultset1[i].SPR_NM;
					btraiffdcounter++;
					
				}
			}
			
			else if(resultset1[i].RECOM_VAL =='2'){
			    if(sbestdata==null){
			    	
			    
				var img=0;
				switch (resultset1[i].SPR_CD) {
				case 1:
					img='<img src="images/brand1.png" style="height: 100%;" />';
					break;
				case 2:
					img='<img src="images/brand2.png" style="height: 100%;" />';
					break;
				case 3:
					img='<img src="images/brand3.png" style="height: 100%;" />';
					break;
				
				
				}
				$('#secondbest').append('<li class="ui-li-has-thumb ui-first-child"><a class="ui-btn" id="data2" href="#" data-theme="c" onclick="plandetails(id);">'+img+'<h2 id="bestplanvoice">Data Service - '+resultset1[i].SPR_NM+'</h2></a></li>');
				sbestdata=resultset1[i].SPR_NM;
				straiffdata.plandesc[straiffdcounter]=resultset1[i].PLAN_DESC;
				straiffdata.RENTAL[straiffdcounter]=resultset1[i].RENTAL;
				straiffdata.FREE_USAGE[straiffdcounter]=resultset1[i].FREE_USAGE;
				straiffdata.OVERAGE_MB[straiffdcounter]=resultset1[i].OVERAGE_MB;
				straiffdata.VALIDITY[straiffdcounter]=resultset1[i].VALIDITY;
				straiffdata.RATE_PER_MB[straiffdcounter]=resultset1[i].RATE_PER_MB;
				straiffdata.BILL_INCR[straiffdcounter]=resultset1[i].BILL_INCR;
				straiffdata.ADDL_NOTES[straiffdcounter]=resultset1[i].ADDL_NOTES;
				straiffdata.planname=resultset1[i].SPR_NM;
				straiffdcounter++;
			    }
			    else{
			    	straiffdata.plandesc[straiffdcounter]=resultset1[i].PLAN_DESC;
					straiffdata.RENTAL[straiffdcounter]=resultset1[i].RENTAL;
					straiffdata.FREE_USAGE[straiffdcounter]=resultset1[i].FREE_USAGE;
					straiffdata.OVERAGE_MB[straiffdcounter]=resultset1[i].OVERAGE_MB;
					straiffdata.VALIDITY[straiffdcounter]=resultset1[i].VALIDITY;
					straiffdata.RATE_PER_MB[straiffdcounter]=resultset1[i].RATE_PER_MB;
					straiffdata.BILL_INCR[straiffdcounter]=resultset1[i].BILL_INCR;
					straiffdata.ADDL_NOTES[straiffdcounter]=resultset1[i].ADDL_NOTES;
					straiffdata.planname=resultset1[i].SPR_NM;
			    	straiffdcounter++;
			    	
			    }
				}
			else if(resultset1[i].RECOM_VAL =='3'){
			    if(tbestdata == null){
				var img=0;
				switch (resultset1[i].SPR_CD) {
				case 1:
					img='<img src="images/brand1.png" style="height: 100%;" />';
					break;
				case 2:
					img='<img src="images/brand2.png" style="height: 100%;" />';
					break;
				case 3:
					img='<img src="images/brand3.png" style="height: 100%;" />';
					break;
				
				
				}
				$('#thirdbest').append('<li class="ui-li-has-thumb ui-first-child"><a class="ui-btn" id="data3" href="#plandetails" data-theme="c" onclick="plandetails(id);">'+img+'<h2 id="bestplanvoice">Data Service - '+resultset1[i].SPR_NM+'</h2></a></li>');
				tbestdata=resultset1[i].SPR_NM;
				ttraiffdata.plandesc[ttraiffdcounter]=resultset1[i].PLAN_DESC;
				ttraiffdata.RENTAL[ttraiffdcounter]=resultset1[i].RENTAL;
				ttraiffdata.FREE_USAGE[ttraiffdcounter]=resultset1[i].FREE_USAGE;
				ttraiffdata.OVERAGE_MB[ttraiffdcounter]=resultset1[i].OVERAGE_MB;
				ttraiffdata.VALIDITY[ttraiffdcounter]=resultset1[i].VALIDITY;
				ttraiffdata.RATE_PER_MB[ttraiffdcounter]=resultset1[i].RATE_PER_MB;
				ttraiffdata.BILL_INCR[ttraiffdcounter]=resultset1[i].BILL_INCR;
				ttraiffdata.ADDL_NOTES[ttraiffdcounter]=resultset1[i].ADDL_NOTES;
				ttraiffdata.planname=resultset1[i].SPR_NM;
				ttraiffdcounter++;
			    }
			    else{
			    	ttraiffdata.plandesc[ttraiffdcounter]=resultset1[i].PLAN_DESC;
					ttraiffdata.RENTAL[ttraiffdcounter]=resultset1[i].RENTAL;
					ttraiffdata.FREE_USAGE[ttraiffdcounter]=resultset1[i].FREE_USAGE;
					ttraiffdata.OVERAGE_MB[ttraiffdcounter]=resultset1[i].OVERAGE_MB;
					ttraiffdata.VALIDITY[ttraiffdcounter]=resultset1[i].VALIDITY;
					ttraiffdata.RATE_PER_MB[ttraiffdcounter]=resultset1[i].RATE_PER_MB;
					ttraiffdata.BILL_INCR[ttraiffdcounter]=resultset1[i].BILL_INCR;
					ttraiffdata.ADDL_NOTES[ttraiffdcounter]=resultset1[i].ADDL_NOTES;
					ttraiffdata.planname=resultset1[i].SPR_NM;
			    	ttraiffdcounter++;
			    }
				}
              
		}
	$.mobile.changePage( "#recommendedplans",{ 
		allowSamePageTransition : true,
	      transition              : 'none',
	      showLoadMsg             : false,
	     });
	busy.hide();
	
}
function dplanfail(result){
	alert("failed in getting data plan",null,"RoamAssist",'OK');
	busy.hide();
}
function plandetails(id){
	busy = new WL.BusyIndicator ();
	busy.show();
	$("#traiff div").remove();
	$("#esm div").remove();
	if(id =='bestvoice'){
		var length=besttraiff.monthlyrental.length;
		for (var i=0;i<length;i++){
			var j=i;
			if((besttraiff.plandesc[i]==null) ||(besttraiff.plandesc[i]=='') || (besttraiff.plandesc[i]=='NA'))
				{
				desc="plan"+(j+1);
				besttraiff.plandesc[i]='NA';
				}
			else{
				desc=besttraiff.plandesc[i];
			}
			if((besttraiff.monthlyrental[i]==null) || (besttraiff.monthlyrental[i]=='')){
				besttraiff.monthlyrental[i]='NA';
			}
			if((besttraiff.incomingcall[i]==null) || (besttraiff.incomingcall[i]=='')){
				besttraiff.incomingcall[i]='NA';
			}
			if((besttraiff.LOCAL_OUTGOING[i]==null) || (besttraiff.LOCAL_OUTGOING[i]=='')){
				besttraiff.LOCAL_OUTGOING[i]='NA';
			}
			if((besttraiff.Landline[i]==null) || (besttraiff.Landline[i]=='')){
				besttraiff.Landline[i]='NA';
			}
			if((besttraiff.SAME_NET[i]==null) || (besttraiff.SAME_NET[i]=='')){
				besttraiff.SAME_NET[i]='NA';
			}
			if((besttraiff.OTHER_NET[i]==null) || (besttraiff.OTHER_NET[i]=='')){
				besttraiff.OTHER_NET[i]='NA';
			}
			if((besttraiff.CALL_TO_INDIA[i]==null) || (besttraiff.CALL_TO_INDIA[i]=='')){
				besttraiff.CALL_TO_INDIA[i]='NA';
			}
			if((besttraiff.REST_OF_WORLD[i]==null) || (besttraiff.REST_OF_WORLD[i]=='')){
				besttraiff.REST_OF_WORLD[i]='NA';
			}
			if((besttraiff.SMS_LOCAL[i]==null) || (besttraiff.SMS_LOCAL[i]=='')){
				besttraiff.SMS_LOCAL[i]='NA';
			}
			if((besttraiff.SMS_INTRL[i]==null) || (besttraiff.SMS_INTRL[i]=='')){
				besttraiff.SMS_INTRL[i]='NA';
			}
			if((besttraiff.ANYTIME_FREE_MINS[i]==null) || (besttraiff.ANYTIME_FREE_MINS[i]=='')){
				besttraiff.ANYTIME_FREE_MINS[i]='NA';
			}
			if((besttraiff.SERVICE_CHARGE[i]==null) || (besttraiff.SERVICE_CHARGE[i]=='')){
				besttraiff.SERVICE_CHARGE[i]='NA';
			}
			if((besttraiff.ADDL_NOTES[i]==null) || (besttraiff.ADDL_NOTES[i]=='')){
				besttraiff.ADDL_NOTES[i]='NA';
			}
			$("#traiff").append('<div data-role="collapsible" id=plan'+i+' data-collapsed-icon="carat-d"	data-expanded-icon="carat-u" data-iconpos="right" class="ui-nodisc-icon"><h4 class="blue-grdnt">'+desc+'</h4><table  id="myTable"><thead><tr><th>Title</th><th>Value</th></tr></thead><tbody><tr><td>Monthlyrental</td><td>'+besttraiff.monthlyrental[i]+
			'</td></tr><tr><td>Incoming Call</td><td>'+besttraiff.incomingcall[i]+
			'</td></tr><tr><td>Local Outgoing</td><td>'+besttraiff.LOCAL_OUTGOING[i]+
			'</td></tr><tr><td>Landline</td><td>'+besttraiff.Landline[i]+
			'</td></tr><tr><td>Same Network</td><td>'+besttraiff.SAME_NET[i]+
			'</td></tr><tr><td>Other Network</td><td>'+besttraiff.OTHER_NET[i]+
			'</td></tr><tr><td>Call to India</td><td>'+besttraiff.CALL_TO_INDIA[i]+
			'</td></tr><tr><td>Rest of World</td><td>'+besttraiff.REST_OF_WORLD[i]+
			'</td></tr><tr><td>SMS Local</td><td>'+besttraiff.SMS_LOCAL[i]+
			'</td></tr><tr><td>SMS International</td><td>'+besttraiff.SMS_INTRL[i]+
			'</td></tr><tr><td>Anytime Free Mins</td><td>'+besttraiff.ANYTIME_FREE_MINS[i]+
			'</td></tr><tr><td>Service Charge</td><td>'+besttraiff.SERVICE_CHARGE[i]+
			'</td></tr><tr><td>Additinal Notes</td><td>'+besttraiff.ADDL_NOTES[i]+
			'</td></tr><tr><td>Description</td><td>'+besttraiff.plandesc[i]+
			'</td></tr></tbody></table></div>');
			}
      serviceprovidername=$('#bestvoice h2').html();
	}
	if(id =='secondvoice'){
		var length=sbesttraiff.monthlyrental.length;
		for (var i=0;i<length;i++){
			var j=i;
			if((sbesttraiff.plandesc[i]==null) ||(sbesttraiff.plandesc[i]=='')|| (sbesttraiff.plandesc[i]=='NA'))
			{
			desc="plan"+(j+1);
			sbesttraiff.plandesc[i]='NA';
			}
		else{
			desc=sbesttraiff.plandesc[i];
		}
			if((sbesttraiff.monthlyrental[i]==null) || (sbesttraiff.monthlyrental[i]=='')){
				sbesttraiff.monthlyrental[i]='NA';
			}
			if((sbesttraiff.incomingcall[i]==null) || (sbesttraiff.incomingcall[i]=='')){
				sbesttraiff.incomingcall[i]='NA';
			}
			if((sbesttraiff.LOCAL_OUTGOING[i]==null) || (sbesttraiff.LOCAL_OUTGOING[i]=='')){
				sbesttraiff.LOCAL_OUTGOING[i]='NA';
			}
			if((sbesttraiff.Landline[i]==null) || (sbesttraiff.Landline[i]=='')){
				sbesttraiff.Landline[i]='NA';
			}
			if((sbesttraiff.SAME_NET[i]==null) || (sbesttraiff.SAME_NET[i]=='')){
				sbesttraiff.SAME_NET[i]='NA';
			}
			if((sbesttraiff.OTHER_NET[i]==null) || (sbesttraiff.OTHER_NET[i]=='')){
				sbesttraiff.OTHER_NET[i]='NA';
			}
			if((sbesttraiff.CALL_TO_INDIA[i]==null) || (sbesttraiff.CALL_TO_INDIA[i]=='')){
				sbesttraiff.CALL_TO_INDIA[i]='NA';
			}
			if((sbesttraiff.REST_OF_WORLD[i]==null) || (sbesttraiff.REST_OF_WORLD[i]=='')){
				sbesttraiff.REST_OF_WORLD[i]='NA';
			}
			if((sbesttraiff.SMS_LOCAL[i]==null) || (sbesttraiff.SMS_LOCAL[i]=='')){
				sbesttraiff.SMS_LOCAL[i]='NA';
			}
			if((sbesttraiff.SMS_INTRL[i]==null) || (sbesttraiff.SMS_INTRL[i]=='')){
				sbesttraiff.SMS_INTRL[i]='NA';
			}
			if((sbesttraiff.ANYTIME_FREE_MINS[i]==null) || (sbesttraiff.ANYTIME_FREE_MINS[i]=='')){
				sbesttraiff.ANYTIME_FREE_MINS[i]='NA';
			}
			if((sbesttraiff.SERVICE_CHARGE[i]==null) || (sbesttraiff.SERVICE_CHARGE[i]=='')){
				sbesttraiff.SERVICE_CHARGE[i]='NA';
			}
			if((sbesttraiff.ADDL_NOTES[i]==null) || (sbesttraiff.ADDL_NOTES[i]=='')){
				sbesttraiff.ADDL_NOTES[i]='NA';
			}
			$("#traiff").append('<div data-role="collapsible" id=plan'+i+' data-collapsed-icon="carat-d"	data-expanded-icon="carat-u" data-iconpos="right" class="ui-nodisc-icon"><h4 class="blue-grdnt">'+desc+'</h4><table  id="myTable"><thead><tr><th>Title</th><th>Value</th></tr></thead><tbody><tr><td>Monthlyrental</td><td>'+sbesttraiff.monthlyrental[i]+
					'</td></tr><tr><td>Incoming Call</td><td>'+sbesttraiff.incomingcall[i]+
					'</td></tr><tr><td>Local Outgoing</td><td>'+sbesttraiff.LOCAL_OUTGOING[i]+
					'</td></tr><tr><td>Landline</td><td>'+sbesttraiff.Landline[i]+
					'</td></tr><tr><td>Same Network</td><td>'+sbesttraiff.SAME_NET[i]+
					'</td></tr><tr><td>Other Network</td><td>'+sbesttraiff.OTHER_NET[i]+
					'</td></tr><tr><td>Call to India</td><td>'+sbesttraiff.CALL_TO_INDIA[i]+
					'</td></tr><tr><td>Rest of World</td><td>'+sbesttraiff.REST_OF_WORLD[i]+
					'</td></tr><tr><td>SMS Local</td><td>'+sbesttraiff.SMS_LOCAL[i]+
					'</td></tr><tr><td>SMS International</td><td>'+sbesttraiff.SMS_INTRL[i]+
					'</td></tr><tr><td>Anytime Free Mins</td><td>'+sbesttraiff.ANYTIME_FREE_MINS[i]+
					'</td></tr><tr><td>Service Charge</td><td>'+sbesttraiff.SERVICE_CHARGE[i]+
					'</td></tr><tr><td>Additinal Notes</td><td>'+sbesttraiff.ADDL_NOTES[i]+
					'</td></tr><tr><td>Description</td><td>'+sbesttraiff.plandesc[i]+
					'</td></tr></tbody></table></div>');		
		}
		serviceprovidername=$('#secondvoice h2').html();
	}
	if(id =='thirdvoice'){
		var length=tbesttraiff.monthlyrental.length;
		for (var i=0;i<length;i++){
			var j=i;
			if((tbesttraiff.plandesc[i]==null) ||(tbesttraiff.plandesc[i]=='') ||(tbesttraiff.plandesc[i]=='NA') )
			{
			desc="plan"+(j+1);
			tbesttraiff.plandesc[i]='NA';
			}
		else{
			desc=tbesttraiff.plandesc[i];
		}
			if((tbesttraiff.monthlyrental[i]==null) || (tbesttraiff.monthlyrental[i]=='')){
				tbesttraiff.monthlyrental[i]='NA';
			}
			if((tbesttraiff.incomingcall[i]==null) || (tbesttraiff.incomingcall[i]=='')){
				tbesttraiff.incomingcall[i]='NA';
			}
			if((tbesttraiff.LOCAL_OUTGOING[i]==null) || (tbesttraiff.LOCAL_OUTGOING[i]=='')){
				tbesttraiff.LOCAL_OUTGOING[i]='NA';
			}
			if((tbesttraiff.Landline[i]==null) || (tbesttraiff.Landline[i]=='')){
				tbesttraiff.Landline[i]='NA';
			}
			if((tbesttraiff.SAME_NET[i]==null) || (tbesttraiff.SAME_NET[i]=='')){
				tbesttraiff.SAME_NET[i]='NA';
			}
			if((tbesttraiff.OTHER_NET[i]==null) || (tbesttraiff.OTHER_NET[i]=='')){
				tbesttraiff.OTHER_NET[i]='NA';
			}
			if((tbesttraiff.CALL_TO_INDIA[i]==null) || (tbesttraiff.CALL_TO_INDIA[i]=='')){
				tbesttraiff.CALL_TO_INDIA[i]='NA';
			}
			if((tbesttraiff.REST_OF_WORLD[i]==null) || (tbesttraiff.REST_OF_WORLD[i]=='')){
				tbesttraiff.REST_OF_WORLD[i]='NA';
			}
			if((tbesttraiff.SMS_LOCAL[i]==null) || (tbesttraiff.SMS_LOCAL[i]=='')){
				tbesttraiff.SMS_LOCAL[i]='NA';
			}
			if((tbesttraiff.SMS_INTRL[i]==null) || (tbesttraiff.SMS_INTRL[i]=='')){
				tbesttraiff.SMS_INTRL[i]='NA';
			}
			if((tbesttraiff.ANYTIME_FREE_MINS[i]==null) || (tbesttraiff.ANYTIME_FREE_MINS[i]=='')){
				tbesttraiff.ANYTIME_FREE_MINS[i]='NA';
			}
			if((tbesttraiff.SERVICE_CHARGE[i]==null) || (tbesttraiff.SERVICE_CHARGE[i]=='')){
				tbesttraiff.SERVICE_CHARGE[i]='NA';
			}
			if((tbesttraiff.ADDL_NOTES[i]==null) || (tbesttraiff.ADDL_NOTES[i]=='')){
				tbesttraiff.ADDL_NOTES[i]='NA';
			}
			$("#traiff").append('<div data-role="collapsible" id=plan'+i+' data-collapsed-icon="carat-d"	data-expanded-icon="carat-u" data-iconpos="right" class="ui-nodisc-icon"><h4 class="blue-grdnt">'+desc+'</h4><table id="myTable"><thead><tr><th>Title</th><th>Value</th></tr></thead><tbody><tr><td>Monthlyrental</td><td>'+tbesttraiff.monthlyrental[i]+
					'</td></tr><tr><td>Incoming Call</td><td>'+tbesttraiff.incomingcall[i]+
					'</td></tr><tr><td>Local Outgoing</td><td>'+tbesttraiff.LOCAL_OUTGOING[i]+
					'</td></tr><tr><td>Landline</td><td>'+tbesttraiff.Landline[i]+
					'</td></tr><tr><td>Same Network</td><td>'+tbesttraiff.SAME_NET[i]+
					'</td></tr><tr><td>Other Network</td><td>'+tbesttraiff.OTHER_NET[i]+
					'</td></tr><tr><td>Call to India</td><td>'+tbesttraiff.CALL_TO_INDIA[i]+
					'</td></tr><tr><td>Rest of World</td><td>'+tbesttraiff.REST_OF_WORLD[i]+
					'</td></tr><tr><td>SMS Local</td><td>'+tbesttraiff.SMS_LOCAL[i]+
					'</td></tr><tr><td>SMS International</td><td>'+tbesttraiff.SMS_INTRL[i]+
					'</td></tr><tr><td>Anytime Free Mins</td><td>'+tbesttraiff.ANYTIME_FREE_MINS[i]+
					'</td></tr><tr><td>Service Charge</td><td>'+tbesttraiff.SERVICE_CHARGE[i]+
					'</td></tr><tr><td>Additinal Notes</td><td>'+tbesttraiff.ADDL_NOTES[i]+
					'</td></tr><tr><td>Description</td><td>'+tbesttraiff.plandesc[i]+
					'</td></tr></tbody></table></div>');		
		}
		serviceprovidername=$('#thirdvoice h2').html();		
	}
	if(id =='data1'){
		var length=btraiffdata.RENTAL.length;
		for (var i=0;i<length;i++){
			var j=i;
			if((btraiffdata.plandesc[i]==null) ||(btraiffdata.plandesc[i]=='') ||(btraiffdata.plandesc[i]=='NA'))
			{
			desc="plan"+(j+1);
			btraiffdata.plandesc[i]='NA';
			}
		else{
			desc=btraiffdata.plandesc[i];
		}
		if((btraiffdata.RENTAL[i]==null) || (btraiffdata.RENTAL[i]=='')){
			btraiffdata.RENTAL[i]='NA';
		}
		if((btraiffdata.FREE_USAGE[i]==null) || (btraiffdata.FREE_USAGE[i]=='')){
			btraiffdata.FREE_USAGE[i]='NA';
		}
		if((btraiffdata.OVERAGE_MB[i]==null) || (btraiffdata.OVERAGE_MB[i]=='')){
			btraiffdata.OVERAGE_MB[i]='NA';
		}
		if((btraiffdata.VALIDITY[i]==null) || (btraiffdata.VALIDITY[i]=='')){
			btraiffdata.VALIDITY[i]='NA';
		}
		if((btraiffdata.RATE_PER_MB[i]==null) || (btraiffdata.RATE_PER_MB[i]=='')){
			btraiffdata.RATE_PER_MB[i]='NA';
		}
		if((btraiffdata.BILL_INCR[i]==null) || (btraiffdata.BILL_INCR[i]=='')){
			btraiffdata.BILL_INCR[i]='NA';
		}
		if((btraiffdata.ADDL_NOTES[i]==null) || (btraiffdata.ADDL_NOTES[i]=='')){
			btraiffdata.ADDL_NOTES[i]='NA';
		}
			$("#traiff").append('<div data-role="collapsible" id=plan'+i+' data-collapsed-icon="carat-d"	data-expanded-icon="carat-u" data-iconpos="right" class="ui-nodisc-icon"><h4 class="blue-grdnt">'+desc+'</h4><table  id="myTable"><thead><tr><th>Title</th><th>Value</th></tr></thead><tbody><tr><td>Monthly Rental</td><td>'
				+btraiffdata.RENTAL[i]+'</td></tr><tr><td>Free Usage</td><td>'
				+btraiffdata.FREE_USAGE[i]+'</td></tr><tr><td>Over Usage</td><td>'
				+btraiffdata.OVERAGE_MB[i]+'</td></tr><tr><td>Validity</td><td>'
				+btraiffdata.VALIDITY[i]+'</td></tr><tr><td>Rate per MB</td><td>'	
				+btraiffdata.RATE_PER_MB[i]+'</td></tr><tr><td>Bill Increment</td><td>'
				+btraiffdata.BILL_INCR[i]+'</td></tr><tr><td>Additional Notes</td><td>'
				+btraiffdata.ADDL_NOTES[i]+'</td></tr><tr><td>Description</td><td>'	
				+btraiffdata.plandesc[i]+'</td></tr></tbody></table></div>');
				
		}
		serviceprovidername=$('#data1 h2').html();
	}
	if(id =='data2'){
		var length=straiffdata.RENTAL.length;
		for (var i=0;i<length;i++){
			var j=i;
			if((straiffdata.plandesc[i]==null) ||(straiffdata.plandesc[i]=='') ||(straiffdata.plandesc[i]=='NA'))
			{
			desc="plan"+(j+1);
			straiffdata.plandesc[i]='NA';
			}
		else{
			desc=straiffdata.plandesc[i];
		}
			if((straiffdata.RENTAL[i]==null) || (straiffdata.RENTAL[i]=='')){
				straiffdata.RENTAL[i]='NA';
			}
			if((straiffdata.FREE_USAGE[i]==null) || (straiffdata.FREE_USAGE[i]=='')){
				straiffdata.FREE_USAGE[i]='NA';
			}
			if((straiffdata.OVERAGE_MB[i]==null) || (straiffdata.OVERAGE_MB[i]=='')){
				straiffdata.OVERAGE_MB[i]='NA';
			}
			if((straiffdata.VALIDITY[i]==null) || (straiffdata.VALIDITY[i]=='')){
				straiffdata.VALIDITY[i]='NA';
			}
			if((straiffdata.RATE_PER_MB[i]==null) || (straiffdata.RATE_PER_MB[i]=='')){
				straiffdata.RATE_PER_MB[i]='NA';
			}
			if((straiffdata.BILL_INCR[i]==null) || (straiffdata.BILL_INCR[i]=='')){
				straiffdata.BILL_INCR[i]='NA';
			}
			if((straiffdata.ADDL_NOTES[i]==null) || (straiffdata.ADDL_NOTES[i]=='')){
				straiffdata.ADDL_NOTES[i]='NA';
			}
			$("#traiff").append('<div data-role="collapsible" id=plan'+i+' data-collapsed-icon="carat-d"	data-expanded-icon="carat-u" data-iconpos="right" class="ui-nodisc-icon"><h4 class="blue-grdnt">'+desc+'</h4><table  id="myTable"><thead><tr><th>Title</th><th>Value</th></tr></thead><tbody><tr><td>Monthly Rental</td><td>'
					+straiffdata.RENTAL[i]+'</td></tr><tr><td>Free Usage</td><td>'
					+straiffdata.FREE_USAGE[i]+'</td></tr><tr><td>Over Usage</td><td>'
					+straiffdata.OVERAGE_MB[i]+'</td></tr><tr><td>Validity</td><td>'
					+straiffdata.VALIDITY[i]+'</td></tr><tr><td>Rate per MB</td><td>'	
					+straiffdata.RATE_PER_MB[i]+'</td></tr><tr><td>Bill Increment</td><td>'
					+straiffdata.BILL_INCR[i]+'</td></tr><tr><td>Additional Notes</td><td>'
					+straiffdata.ADDL_NOTES[i]+'</td></tr><tr><td>Description</td><td>'	
					+straiffdata.plandesc[i]+'</td></tr></tbody></table></div>');	
		}
		serviceprovidername=$('#data2 h2').html();
	}
	if(id =='data3'){
		var length=ttraiffdata.RENTAL.length;
		for (var i=0;i<length;i++){
			var j=i;
			if((ttraiffdata.plandesc[i]==null) ||(ttraiffdata.plandesc[i]=='') ||(ttraiffdata.plandesc[i]=='NA'))
			{
			desc="plan"+(j+1);
			ttraiffdata.plandesc[i]='NA';
			}
		else{
			desc=ttraiffdata.plandesc[i];
		}
			if((ttraiffdata.RENTAL[i]==null) || (ttraiffdata.RENTAL[i]=='')){
				ttraiffdata.RENTAL[i]='NA';
			}
			if((ttraiffdata.FREE_USAGE[i]==null) || (ttraiffdata.FREE_USAGE[i]=='')){
				ttraiffdata.FREE_USAGE[i]='NA';
			}
			if((ttraiffdata.OVERAGE_MB[i]==null) || (ttraiffdata.OVERAGE_MB[i]=='')){
				ttraiffdata.OVERAGE_MB[i]='NA';
			}
			if((ttraiffdata.VALIDITY[i]==null) || (ttraiffdata.VALIDITY[i]=='')){
				ttraiffdata.VALIDITY[i]='NA';
			}
			if((ttraiffdata.RATE_PER_MB[i]==null) || (ttraiffdata.RATE_PER_MB[i]=='')){
				ttraiffdata.RATE_PER_MB[i]='NA';
			}
			if((ttraiffdata.BILL_INCR[i]==null) || (ttraiffdata.BILL_INCR[i]=='')){
				ttraiffdata.BILL_INCR[i]='NA';
			}
			if((ttraiffdata.ADDL_NOTES[i]==null) || (ttraiffdata.ADDL_NOTES[i]=='')){
				ttraiffdata.ADDL_NOTES[i]='NA';
			}
			$("#traiff").append('<div data-role="collapsible" id=plan'+i+' data-collapsed-icon="carat-d"	data-expanded-icon="carat-u" data-iconpos="right" class="ui-nodisc-icon"><h4 class="blue-grdnt">'+desc+'</h4><table  id="myTable"><thead><tr><th>Title</th><th>Value</th></tr></thead><tbody><tr><td>Monthly Rental</td><td>'
					+ttraiffdata.RENTAL[i]+'</td></tr><tr><td>Free Usage</td><td>'
					+ttraiffdata.FREE_USAGE[i]+'</td></tr><tr><td>Over Usage</td><td>'
					+ttraiffdata.OVERAGE_MB[i]+'</td></tr><tr><td>Validity</td><td>'
					+ttraiffdata.VALIDITY[i]+'</td></tr><tr><td>Rate per MB</td><td>'	
					+ttraiffdata.RATE_PER_MB[i]+'</td></tr><tr><td>Bill Increment</td><td>'
					+ttraiffdata.BILL_INCR[i]+'</td></tr><tr><td>Additional Notes</td><td>'
					+ttraiffdata.ADDL_NOTES[i]+'</td></tr><tr><td>Description</td><td>'	
					+ttraiffdata.plandesc[i]+'</td></tr></tbody></table></div>');	
		}
		serviceprovidername=$('#data3 h2').html();
	}
	
	$('div[data-role=collapsible]').collapsible({refresh:true});
	var invocationData = {
            adapter : 'Jsonstore',
            procedure : 'getjson',
            parameters : []
    };

    WL.Client.invokeProcedure(invocationData, {
        onSuccess : jsonstoresuccess,
        onFailure : jsonstorefail
    });
	
	


}
function jsonstoresuccess(result){
	var servicefinalname=serviceprovidername.split("- "); 
	var servicename=servicefinalname[1];
	if(servicefinalname[1]=='Roam1'){
		servicefinalname[1]='Roam';
	}
	var invocationresult = result.invocationResult;
	var resultset=invocationresult.roamAssistData;
    var length=resultset.length;
    var faq=document.getElementById('faq');
    
    var procedures=document.getElementById('procedures');
    var requestform=document.getElementById('requestform');
    $('#faq li').remove();
    $('#eprocedures li').remove();
    
    esm.innerHTML="";
    
    requestform.innerHTML="";
   $( "#tariffcollapse" ).collapsible( "expand" );
    $('#plan0').collapsible("expand");
    $( "#procedurecollapse" ).collapsible( "collapse" );
    $( "#requestformcollapse" ).collapsible( "collapse" );
    $( "#escalationmatrixcollapse" ).collapsible( "collapse" );
    $( "#faqcollapse" ).collapsible( "collapse" );
    for(var i=0;i<length;i++){
    	if(resultset[i].name==servicefinalname[1]){
    		
    		var faqlength=resultset[i].Frequentlyaskedquestions.length;
    		
    		
    		for(var j=0;j<faqlength;j++){
    			var li = document.createElement("li");
    			var h2=document.createElement("h2");
    			var p=document.createElement("p");
    			li.appendChild(document.createTextNode(""));
    			if(j==0){
    				li.setAttribute('class', 'ui-li-static ui-body-inherit ui-first-child');	
    			}
    			else if((j+1)==faqlength){
    				li.setAttribute('class', 'ui-li-static ui-body-inherit ui-last-child');	
    			}
    			else{
    				li.setAttribute('class', 'ui-li-static ui-body-inherit');	
    			}
    			li.setAttribute('style', 'background-color:#E3FFFC');
    			h2.innerHTML="<b>"+(j+1)+". "+resultset[i].Frequentlyaskedquestions[j].key+"</b><br>";
    			p.innerHTML=resultset[i].Frequentlyaskedquestions[j].ans+"<br>";
    			li.appendChild(h2);
    			li.appendChild(p);
                faq.appendChild(li);

    		}
    		
    		
    		$('#esm').append(resultset[i].EscalationMatrix);
    		
    		requestform.innerHTML=resultset[i].RequestForm;
    		procedures.innerHTML=resultset[i].procedure;
    		$('div[data-role=collapsible]').collapsible({refresh:true});
    	}
    }
if(faq.innerHTML==''){
	faq.innerHTML="No Data to display at this time";
}

//if(procedure.innerHTML==''){
//	procedure.innerHTML="No Data to display at this time";
//}
if(requestform.innerHTML==''){
	requestform.innerHTML="No Data to display at this time";
}
$('#plansfooter').text($('#countryselectname').html()+' - '+servicename);
$.mobile.changePage( "#plandetails",{ 
	allowSamePageTransition : true,
      transition              : 'none',
      showLoadMsg             : false,
     });
busy.hide();
}
function jsonstorefail(result){
	alert("failed getting Json",null,"RoamAssist",'OK');
	busy.hide();
}
function nl2br (str, is_xhtml) {   
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';    
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
}

function sendmail(){
	busy.show();
	var tomail=$("#j_username").val();
	var fromemail=$("#j_username").val();
	var subject="Request form for Clay";
	var body="Hello,<br>Please click on the below link to download the request form for Clay.<br><a href='https://w3-01.ibm.com/helpcentral/userfiles/files/Clay%20Service%20Request%20form.doc'>https://w3-01.ibm.com/helpcentral/userfiles/files/Clay%20Service%20Request%20form.doc</a><br><br>Thanks & Regards<br>Admin Team";
	var invocationData = {
            adapter : 'bluePageLoginAdapter',
            procedure : 'sendMail',
            parameters : [fromemail,tomail,subject,body]
    };

    WL.Client.invokeProcedure(invocationData, {
        onSuccess : getmailsuccess,
        onFailure : getmailfailure
    });
	
}
function sendmailmatrix(){
	busy.show();
	var tomail=$("#j_username").val();
	var fromemail=$("#j_username").val();
	var subject="Request form for Matrix";
	var body="Hello,<br>Please click on the below link to download the request form for Matrix.<br><a href='https://w3-01.ibm.com/helpcentral/userfiles/files/Matrix_SIM_Request_form.pdf'>https://w3-01.ibm.com/helpcentral/userfiles/files/Matrix_SIM_Request_form.pdf</a><br><br>Thanks & Regards<br>Admin Team";
	var invocationData = {
            adapter : 'bluePageLoginAdapter',
            procedure : 'sendMail',
            parameters : [fromemail,tomail,subject,body]
    };

    WL.Client.invokeProcedure(invocationData, {
        onSuccess : getmailsuccess,
        onFailure : getmailfailure
    });
}
function getmailsuccess(response){
	alert("Mail sent successfuly",null,"RoamAssist",'OK');	
	busy.hide();
}
function getmailfailure(response){
	alert("Failed sending Mail.Try again",null,"RoamAssist",'OK');	
	busy.hide();
}
$('#j_username').first().keyup(function(){
    $email = $('#j_username').val();// use val here to get value of input
     validateEmail($email);
});
function validateEmail($email) {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    
    if( !emailReg.test( $email ) ) {
    	$( "#validateicon" ).removeClass( "cutboxIcon-green" );
    	$( "#validateicon" ).addClass( "cutboxIcon-red" );
    } else {
    	
    		$( "#validateicon" ).removeClass( "cutboxIcon-red" );
        	$( "#validateicon" ).addClass( "cutboxIcon-green" );
    	
    	
    }
  }
$(".clear").on("click",function(){
$('#j_password').val('');
	
});
$.fn.allchange = function (callback) {
    var me = this;
    var last = "";
    var infunc = function () {
        var text = $(me).val();
        if (text != last) {
            last = text;
            callback();
        }
        setTimeout(infunc, 100);
    };
    setTimeout(infunc, 100);
};
$("#j_username").allchange(function () {
	$email = $('#j_username').val();// use val here to get value of input
    validateEmail($email);
});
