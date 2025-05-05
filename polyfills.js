// This is a minimal polyfill file that only includes what's needed
import 'react-native-url-polyfill/auto';

// Fix for ReactNative environment
if (typeof global.self === 'undefined') {
    global.self = global;
}

if (typeof btoa === 'undefined') {
    global.btoa = function (str) {
        return Buffer.from(str, 'binary').toString('base64');
    };
}

if (typeof atob === 'undefined') {
    global.atob = function (b64Encoded) {
        return Buffer.from(b64Encoded, 'base64').toString('binary');
    };
}