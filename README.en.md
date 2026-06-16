# Audio Stream Volume Management

## Project Introduction

This project is developed based on Huawei's official demo code for [audio-volume-management](https://gitcode.com/HarmonyOS_Samples/audio-volume-management).

This case demonstrates how to get volume, set volume, use gestures to adjust volume, customize volume panels, disable volume keys, implement automatic volume balancing, and 10-band equalizer (EQ) adjustment functionality，and it supports multi-platform deployment and cross-device flow.

## Main Features
- ✅ System volume management
- ✅ Audio stream volume control
- ✅ Gesture volume adjustment
- ✅ Custom volume panels
- ✅ Volume key blocking
- ✅ Automatic volume balancing
- ✅ 10-band equalizer (EQ) adjustment
- ✅ 5 preset EQ modes (Flat, Rock, Pop, Jazz, Classical)
- ✅ Custom EQ band adjustment
- ✅ Real-time audio effect application
- ✅ Free flow (cross-device continuation)

## Preview
<img src="./screenshots/device/screenshot.png" width="320">

## Usage Instructions
1. Install and enter the application.
2. After entering the playback page, click the play button to play music. Click the icon in the upper right corner to enter volume settings:
   - Click the switch component for disabling volume keys to disable system volume keys
   - Slide the audio stream volume slider to increase or decrease music volume
   - Enable automatic volume balancing to smooth audio volume and avoid sudden changes
   - Adjust compression strength to control the intensity of the balancing effect
   - Click the EQ Settings button to enter the EQ adjustment page
   - In the EQ page, you can adjust 10 frequency bands, select preset modes, or customize settings for personalized sound

## Project Structure

```
├──entry/src/main/ets/
│  ├──common                           // Common modules
│  │  └──CommonConstants.ets           // Constants class
│  ├──components                       // Component modules
│  │  ├──AVVolumePanelView.ets         // System volume panel component
│  │  ├──ControlAreaComponent.ets      // Playback control area component
│  │  ├──SystemVolumePanelView.ets     // Custom system volume panel component
│  │  └──VolumePanelView.ets           // Custom volume panel component
│  ├──entryability
│  │  └──EntryAbility.ets              // Ability lifecycle callbacks
│  ├──entrybackupability
│  │  └──EntryBackupAbility.ets        // EntryBackupAbility lifecycle callbacks
│  ├──model                        
│  │  └──SongData.ets                  // Song entity
│  ├──pages
│  │  ├──Index.ets                     // Home page                             
│  │  ├──Player.ets                    // Playback page
│  │  └──EQPage.ets                    // EQ adjustment page
│  ├──player                             
│  │  ├──AudioRendererController.ets   // AudioRenderer playback control (includes EQ processing)
│  │  └──AudioVolumeController.ets     // AudioVolumeManager volume management
│  ├──utils
│  │  ├──ColorTools.ets                // Background color tools
│  │  ├──Logger.ets                    // Logging tools
│  │  └──MediaTools.ets                // Media tools
│  └──viewModel
│     └──PlayerViewModel.ets           // Playback page data
└──entry/src/main/resources            // Application static resources directory
```

## Implementation Details
1. Manage system volume through audioVolumeManager, slide custom volume bars to adjust system volume size, and monitor system volume changes.
2. Manage audio stream volume through audioRenderer, slide audio stream volume bars to adjust audio stream volume size.
3. Intercept volume keys by registering inputConsumer.on('keyPressed').
4. Implement automatic volume balancing function to dynamically compress audio volume, avoid sudden volume changes, and provide a smoother listening experience.
5. Implement 10-band equalizer (EQ) function for fine-tuning audio frequency bands, supporting preset modes and custom settings with real-time audio effect application.

## Related Permissions

Not applicable

## Dependencies

Not applicable

## Recent Updates

### EQ Adjustment Function Fix (2024-04-21)
Fixed the issue where EQ adjustments were not taking effect. Main improvements include:

1. **Fixed EQ Algorithm**:
   - Original algorithm only calculated average of positive gains, ignoring negative gains (attenuation)
   - New algorithm calculates weighted average of all frequency bands, including both positive and negative gains
   - Added frequency weights: low and high frequencies weight 1.2, mid frequencies weight 1.0
   - Added volume limits: minimum volume 0.1, maximum volume 15

2. **Added EQ Change Monitoring Mechanism**:
   - Added `@Watch` decorators in Player component to monitor EQ setting changes
   - Added `onEQEnabledChange`, `onEQModeChange`, `onEQBandsChange` methods
   - Automatically re-applies EQ settings to audio renderer when EQ settings change

3. **Fixed Volume State Inconsistency Issues**:
   - Ensured `currentVolume` is correctly set when audio renderer initializes
   - Added error handling in `reapplyEQ` method
   - Added detailed logging for debugging

4. **Added Testing Features**:
   - Added "Test EQ Apply" button in EQ page
   - Added EQ test logging when Player starts
   - Enhanced error handling and state validation

## Free Flow Support

This project supports HarmonyOS free flow capability, enabling seamless cross-device continuation experience.

### Features

1. **Application Continuation**: Supports seamless switching between different HarmonyOS devices while maintaining playback state
2. **State Synchronization**: Automatically synchronizes the following data:
   - Current playing song index
   - Playback state (playing/paused)
   - Volume settings
   - Auto balance volume settings
   - EQ equalizer settings
3. **Seamless Switching**: Application state automatically restores when users switch between devices

### Requirements

1. **Device Requirements**:
   - Both devices must be HarmonyOS 6.0.0 or above
   - Both devices must be logged into the same Huawei account
   - Both devices must have WLAN and Bluetooth enabled
   - Both devices must have continuation enabled in "Settings > Multi-device Collaboration > Continuation"

2. **How to Use**:
   - Open the app on the source device and start playback
   - Click the app icon in the Dock or task manager on the target device
   - The app automatically restores playback state on the target device

### Technical Implementation

1. **Configuration**:
   - Set `continuable: true` in `module.json5`
   - Request `ohos.permission.DISTRIBUTED_DATASYNC` permission

2. **Data Saving** (`onContinue` callback):
   ```typescript
   onContinue(wantParam: Record<string, Object>): AbilityConstant.OnContinueResult {
     // Save playback state, volume settings, EQ settings, etc.
     wantParam['currentSongIndex'] = currentSongIndex;
     wantParam['isPlaying'] = isPlaying;
     wantParam['currentVolume'] = currentVolume;
     // ... more data
     return AbilityConstant.OnContinueResult.AGREE;
   }
   ```

3. **Data Restoration** (`onCreate`/`onNewWant` callback):
   ```typescript
   if (launchParam.launchReason === AbilityConstant.LaunchReason.CONTINUATION) {
     // Restore data from want.parameters
     this.restoreContinueData(want);
   }
   ```

### Development Notes

- Data size limit: Data transmitted via wantParam must be under 100KB
- Lifecycle: `onCreate` for cold start, `onNewWant` for hot start
- State management: Use AppStorage for cross-component data synchronization
- Error handling: Return REJECT in onContinue to refuse migration

## Multi-Device Deployment Support

This project supports HarmonyOS multi-device deployment capabilities and can run on the following device types:

- **Phone** - Full feature support
- **Tablet** - Full feature support, adapted for large screen display
- **Smart TV** - Full feature support, adapted for TV interface
- **Car Head Unit** - Full feature support, adapted for in-car scenarios
- **Wearable** - Basic feature support, adapted for small screen display

### Adaptation Features

1. **Responsive Layout**: Uses the `DeviceUtils` utility class to implement adaptive layouts, automatically adjusting UI element sizes and spacing based on device screen dimensions
2. **Unified API Interface**: Uses HarmonyOS unified APIs to ensure functional consistency across different devices
3. **Device Capability Detection**: Automatically detects device audio capabilities and adapts to different device audio systems
4. **Touch Interaction Optimization**: Optimizes touch interaction experience for different device types

### Development Considerations

- Use `@Entry` and `@Component` decorators to ensure component compatibility across different devices
- Declare supported device types through the `deviceTypes` field in `module.json5`
- Utilize ArkUI adaptive layout capabilities to ensure good UI display across different screen sizes
- Test audio API compatibility for different device types

## Constraints and Limitations

1. This example supports running on the following HarmonyOS devices:
   - Phone
   - Tablet
   - Smart TV
   - Car Head Unit
   - Wearable

2. HarmonyOS system: HarmonyOS 6.0.0 Release and above.

3. DevEco Studio version: DevEco Studio 6.0.0 Release and above.

4. HarmonyOS SDK version: HarmonyOS 6.0.0 Release SDK and above.

5. Audio API support:
   - Audio capabilities may vary across different device types
   - Some advanced audio features may be limited on wearable devices
   - It is recommended to test audio playback and volume control functionality on actual devices