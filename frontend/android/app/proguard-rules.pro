# Capacitor and third-party plugins supply their consumer keep rules.
# Preserve methods invoked by JavaScript rather than by Java callers.
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
# Retain useful source locations in retraced release crash reports.
-keepattributes SourceFile,LineNumberTable
