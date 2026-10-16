package com.asan.driver;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import androidx.core.content.ContextCompat;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "TripTracking")
public class TripTrackingPlugin extends Plugin {
    @PluginMethod
    public void start(PluginCall call) {
        if (ContextCompat.checkSelfPermission(getContext(), Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED
                && ContextCompat.checkSelfPermission(getContext(), Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            call.reject("Allow location access to start ride tracking.");
            return;
        }
        try {
            ContextCompat.startForegroundService(getContext(), new Intent(getContext(), LocationService.class));
            call.resolve();
        } catch (SecurityException | IllegalStateException error) {
            call.reject("Tracking could not start. Reopen the ride screen and check location access.", error);
        }
    }

    @PluginMethod
    public void stop(PluginCall call) {
        getContext().stopService(new Intent(getContext(), LocationService.class));
        call.resolve();
    }
}
