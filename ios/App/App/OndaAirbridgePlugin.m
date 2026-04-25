#import <Capacitor/Capacitor.h>

CAP_PLUGIN(OndaAirbridgePlugin, "OndaAirbridge",
           CAP_PLUGIN_METHOD(trackEvent, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setUserID, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setUserEmail, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setUserAlias, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(clearUser, CAPPluginReturnPromise);
)
