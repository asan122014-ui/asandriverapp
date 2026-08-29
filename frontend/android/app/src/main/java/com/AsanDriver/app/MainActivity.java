package com.AsanDriver.app;

import android.Manifest;
import android.os.Build;
import android.os.Bundle;
import androidx.core.app.ActivityCompat;
import androidx.core.splashscreen.SplashScreen;
import com.getcapacitor.BridgeActivity;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // 1. Handle the splash screen transition.
        SplashScreen splashScreen = SplashScreen.installSplashScreen(this);

        super.onCreate(savedInstanceState);

        // 2. Request Permissions
        requestAppPermissions();
    }

    private void requestAppPermissions() {
        List<String> permissionsList = new ArrayList<>();
        
        // Location
        permissionsList.add(Manifest.permission.ACCESS_FINE_LOCATION);
        permissionsList.add(Manifest.permission.ACCESS_COARSE_LOCATION);
        
        // Phone
        permissionsList.add(Manifest.permission.READ_PHONE_STATE);
        permissionsList.add(Manifest.permission.CALL_PHONE);
        
        // Camera
        permissionsList.add(Manifest.permission.CAMERA);
        
        // Contacts
        permissionsList.add(Manifest.permission.READ_CONTACTS);
        
        // Microphone
        permissionsList.add(Manifest.permission.RECORD_AUDIO);
        
        // Notifications (Android 13+)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            permissionsList.add(Manifest.permission.POST_NOTIFICATIONS);
        }

        String[] permissions = permissionsList.toArray(new String[0]);
        ActivityCompat.requestPermissions(this, permissions, 12345);
    }
}
