#import <Capacitor/Capacitor.h>

CAP_PLUGIN(OndaWatchPlugin, "OndaWatch",
           CAP_PLUGIN_METHOD(getStatus, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(startRealtime, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(stopRealtime, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(sendHeartbeat, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(requestWatchAppOpen, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getDebugLog, CAPPluginReturnPromise);
)
