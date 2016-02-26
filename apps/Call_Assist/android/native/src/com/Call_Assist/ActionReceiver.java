package com.Call_Assist;

import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Intent;

import com.worklight.androidgap.api.WLActionReceiver;

public class ActionReceiver implements WLActionReceiver{
	private Activity parentActivity;
	private String mAddress;
	
	public ActionReceiver(Activity pActivity){
		parentActivity = pActivity;
	}
	
	public void onActionReceived(String action, JSONObject data){
		if (action.equals("opensettings")){
					
			Intent callGPSSettingIntent = new Intent(android.provider.Settings.ACTION_LOCATION_SOURCE_SETTINGS);
			parentActivity.startActivity(callGPSSettingIntent);
		  }
	  }
}