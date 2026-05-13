#import <Capacitor/Capacitor.h>

CAP_PLUGIN(OndaTenjinPlugin, "OndaTenjin",
           CAP_PLUGIN_METHOD(connect, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(trackEvent, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(trackTransaction, CAPPluginReturnPromise);
)
