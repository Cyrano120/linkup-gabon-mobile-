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
        // Exigé par flutter_local_notifications : il utilise les API Java 8+
        // (java.time) pour planifier des notifications, y compris sur des
        // versions d'Android qui ne les fournissent pas nativement.
        isCoreLibraryDesugaringEnabled = true
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
        // Recommandé par flutter_local_notifications, qui pousse le nombre de
        // méthodes au-delà de la limite d'un seul fichier DEX.
        multiDexEnabled = true
    }

    buildTypes {
        release {
            // TODO: Add your own signing config for the release build.
            // Signing with the debug keys for now, so `flutter run --release` works.
            signingConfig = signingConfigs.getByName("debug")
        }
    }
}

dependencies {
    // Implémentation des API Java 8+ utilisées par flutter_local_notifications.
    coreLibraryDesugaring("com.android.tools:desugar_jdk_libs:2.1.4")
}

kotlin {
    compilerOptions {
        jvmTarget = org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17
    }
}

flutter {
    source = "../.."
}
