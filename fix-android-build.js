const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = (config) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const nodeModulesPath = path.join(config.modRequest.platformProjectRoot, '..', 'node_modules');
      
      try {
        // PART 1: Fix settings.gradle for autolinking
        const settingsGradlePath = path.join(config.modRequest.platformProjectRoot, 'settings.gradle');
        if (fs.existsSync(settingsGradlePath)) {
          console.log('Fixing settings.gradle for autolinking...');
          let content = fs.readFileSync(settingsGradlePath, 'utf8');
          
          // Add proper repository paths
          if (!content.includes('autolinking')) {
            const autoLinkingConfig = `
// === Expo Autolinking Configuration ===
buildscript {
    repositories {
        mavenCentral()
        google()
        mavenLocal()
        maven {
            url("${nodeModulesPath.replace(/\\/g, '/')}/expo-modules-autolinking/android/maven")
        }
    }
    dependencies {
        classpath("expo.modules:autolinking-settings-plugin:0.17.1")
    }
}

// Apply the autolinking plugin
apply plugin: 'expo.modules.autolinking-settings-plugin'
`;
            content += autoLinkingConfig;
            fs.writeFileSync(settingsGradlePath, content);
          }
        }
        
        // PART 2: Fix JVM Target for all Kotlin modules (specific focus on expo-random)
        const modulesToFix = [
          'expo-random',
          'expo-screen-orientation',
          'expo-modules-core', 
          'expo-constants'
        ];
        
        for (const module of modulesToFix) {
          const buildGradlePath = path.join(
            nodeModulesPath,
            module,
            'android',
            'build.gradle'
          );
          
          if (fs.existsSync(buildGradlePath)) {
            console.log(`Fixing build.gradle for ${module}...`);
            let content = fs.readFileSync(buildGradlePath, 'utf8');
            
            // Add compileSdkVersion if missing
            if (!content.includes('compileSdkVersion')) {
              content = content.replace(
                /android\s*\{/,
                'android {\n    compileSdkVersion 35'
              );
            }
            
            // Add kotlinOptions with JVM target 17
            if (!content.includes('kotlinOptions')) {
              content = content.replace(
                /android\s*\{[^\}]*\}/s,
                (match) => match.replace(/}$/, '\n    kotlinOptions {\n        jvmTarget = "17"\n    }\n}')
              );
            } else if (!content.includes('jvmTarget')) {
              content = content.replace(
                /kotlinOptions\s*\{[^\}]*\}/s,
                (match) => match.replace(/}$/, '\n        jvmTarget = "17"\n    }')
              );
            } else {
              // Update existing jvmTarget
              content = content.replace(
                /jvmTarget\s*=\s*['"](1[0-1])['"]/,
                'jvmTarget = "17"'
              );
            }
            
            // Fix the SoftwareComponent release property issue
            content = content.replace(/components\.release/g, 'components');
            
            fs.writeFileSync(buildGradlePath, content);
            console.log(`✅ Fixed build.gradle for ${module}`);
          }
        }
        
        // PART 3: Add common kotlin options to root build.gradle
        const rootBuildGradlePath = path.join(config.modRequest.platformProjectRoot, 'build.gradle');
        if (fs.existsSync(rootBuildGradlePath)) {
          console.log('Adding common Kotlin JVM target to root build.gradle...');
          let content = fs.readFileSync(rootBuildGradlePath, 'utf8');
          
          // Add global Kotlin options
          if (!content.includes('allprojects {')) {
            content += `
// Add common JVM target for all Kotlin tasks
allprojects {
    tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile).configureEach {
        kotlinOptions {
            jvmTarget = "17"
        }
    }
}
`;
          } else if (!content.includes('KotlinCompile')) {
            content = content.replace(
              /allprojects\s*\{/,
              `allprojects {\n    tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile).configureEach {\n        kotlinOptions {\n            jvmTarget = "17"\n        }\n    }`
            );
          }
          
          fs.writeFileSync(rootBuildGradlePath, content);
          console.log('✅ Added global Kotlin JVM target to root build.gradle');
        }
        
        // PART 4: Fix gradle.properties to suppress deprecation warnings and set kotlin target
        const gradlePropertiesPath = path.join(config.modRequest.platformProjectRoot, 'gradle.properties');
        if (fs.existsSync(gradlePropertiesPath)) {
          console.log('Updating gradle.properties...');
          let content = fs.readFileSync(gradlePropertiesPath, 'utf8');
          
          // Add warning mode to suppress deprecation warnings
          if (!content.includes('org.gradle.warning.mode')) {
            content += '\n# Suppress deprecation warnings\norg.gradle.warning.mode=none\n';
          }
          
          // Add Kotlin JVM target
          if (!content.includes('kotlin.jvm.target')) {
            content += '\n# Set Kotlin JVM target\nkotlin.jvm.target=17\n';
          }
          
          fs.writeFileSync(gradlePropertiesPath, content);
          console.log('✅ Updated gradle.properties');
        }
        
        console.log('✅ All build fixes applied successfully!');
      } catch (error) {
        console.error('❌ Error applying build fixes:', error);
      } 
      
      return config;
    },
  ]);
};