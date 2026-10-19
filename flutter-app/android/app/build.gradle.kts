plugins {
    id("com.android.application")
    // The Flutter Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
    id("dev.flutter.flutter-gradle-plugin")
}

android {
    namespace = "ga.linkup.linkup_gabon"
    compileSdk = flutter.compileSdkVersion
    // Pas de `ndkVersion` : aucun plugin du projet n'embarque de code natif
    // C/C++ côté Android. Les CMakeLists des plugins Firebase ne concernent que
    // leurs versions Windows/Linux. Déclarer `flutter.ndkVersion` forçait Gradle
    // à exiger un NDK de plusieurs Go, dont le téléchargement s'était interrompu
    // (dossier `C:\Android\ndk\28.2.13676358` réduit à un `.installer` vide) et
    // qui bloquait tout le build.

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    defaultConfig {
        // TODO: Specify your own unique Application ID (https://developer.android.com/studio/build/application-id.html).
        applicationId = "ga.linkup.linkup_gabon"
        // You can update the following values to match your application needs.
        // For more information, see: https://flutter.dev/to/review-gradle-config.
        minSdk = flutter.minSdkVersion
        targetSdk = flutter.targetSdkVersion
        versionCode = flutter.versionCode
        versionName = flutter.versionName
    }

    buildTypes {
        release {
            // TODO: Add your own signing config for the release build.
            // Signing with the debug keys for now, so `flutter run --release` works.
            signingConfig = signingConfigs.getByName("debug")
        }
    }
}

kotlin {
    compilerOptions {
        jvmTarget = org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17
    }
}

flutter {
    source = "../.."
}
