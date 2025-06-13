# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

### 🚨 Important: Custom Native Module Support (Dev Client)

This app includes a custom **native Kotlin module** to collect 5G network signal strength (e.g., RSRP, RSRQ, SINR, GPS).  
> **Note:** You **cannot use Expo Go** to run this app because Expo Go does not support custom native code.

Instead, you must use a **custom Expo Dev Client** built with EAS.

## 📲 How to Run the App with Dev Client

1. Install dependencies
```bash
npm install
```

2. Install the Dev Client package
```bash
npx expo install expo-dev-client
```

3. Login and configure EAS
```bash
eas login
eas build:configure
```

4. Build the Dev Client APK
```bash
npx eas build --profile development --platform android
```

After the build, download the APK or scan the QR code to install it on your Android device.

5. Start the Metro server
```bash
npx expo start --dev-client
```

6. Scan the QR code
Open the **custom Dev Client app** (the APK you installed) and scan the QR code.  
> ⚠️ **Do NOT use Expo Go.**


### 🚨 Testing App layout and User interface 
You can test the app's layout, button functionality, and overall user interface using an Android emulator or iOS simulator.
> **Note:** When running the app on an emulator or simulator, the custom native module responsible for retrieving 5G signal values (like RSRP, RSRQ, SINR) and GPS coordinates will not function. These features require an actual physical device with cellular and GPS capabilities.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo



## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
