# Capacitor and third-party plugins supply their consumer keep rules.
# Preserve methods invoked by JavaScript rather than by Java callers.
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
# Retain useful source locations in retraced release crash reports.
-keepattributes SourceFile,LineNumberTable

# Capacitor reads plugin and nested permission annotations at runtime.
-keepattributes RuntimeVisibleAnnotations,RuntimeInvisibleAnnotations,AnnotationDefault
-keep @interface com.getcapacitor.annotation.** { *; }
-keep @interface com.getcapacitor.PluginMethod { *; }
-keep @interface com.getcapacitor.NativePlugin { *; }