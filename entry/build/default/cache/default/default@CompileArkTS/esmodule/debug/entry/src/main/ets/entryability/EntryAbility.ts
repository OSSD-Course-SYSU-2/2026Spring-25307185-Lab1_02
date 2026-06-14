import AbilityConstant from "@ohos:app.ability.AbilityConstant";
import ConfigurationConstant from "@ohos:app.ability.ConfigurationConstant";
import UIAbility from "@ohos:app.ability.UIAbility";
import type Want from "@ohos:app.ability.Want";
import hilog from "@ohos:hilog";
import type window from "@ohos:window";
import { CommonConstants } from "@normalized:N&&&entry/src/main/ets/common/CommonConstants&";
import { Logger } from "@normalized:N&&&entry/src/main/ets/utils/Logger&";
import { DeviceUtils } from "@normalized:N&&&entry/src/main/ets/utils/DeviceUtils&";
const DOMAIN = 0x0000;
const TAG = 'EntryAbility';
export default class EntryAbility extends UIAbility {
    onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
        try {
            this.context.getApplicationContext().setColorMode(ConfigurationConstant.ColorMode.COLOR_MODE_NOT_SET);
        }
        catch (err) {
            hilog.error(DOMAIN, 'testTag', 'Failed to set colorMode. Cause: %{public}s', JSON.stringify(err));
        }
        // Initialize AppStorage values for auto-balance volume feature
        // Note: AppStorage is globally available in ArkTS
        AppStorage.setOrCreate('autoBalanceEnabled', CommonConstants.DEFAULT_AUTO_BALANCE_ENABLED);
        AppStorage.setOrCreate('compressionRatio', CommonConstants.DEFAULT_COMPRESSION_RATIO);
        // Initialize AppStorage values for EQ feature
        AppStorage.setOrCreate('eqEnabled', CommonConstants.DEFAULT_EQ_ENABLED);
        AppStorage.setOrCreate('eqMode', CommonConstants.DEFAULT_EQ_MODE);
        AppStorage.setOrCreate('eqBands', CommonConstants.DEFAULT_EQ_PRESET);
        // Handle continuation launch
        if (launchParam.launchReason === AbilityConstant.LaunchReason.CONTINUATION) {
            Logger.info(TAG, 'Application launched by continuation');
            this.restoreContinueData(want);
        }
        hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onCreate');
    }
    onDestroy(): void {
        hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onDestroy');
    }
    onWindowStageCreate(windowStage: window.WindowStage): void {
        // Main window is created, set main page for this ability
        hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onWindowStageCreate');
        // Initialize device utils for multi-device adaptation
        DeviceUtils.init();
        windowStage.loadContent('pages/Index', (err) => {
            if (err.code) {
                hilog.error(DOMAIN, 'testTag', 'Failed to load the content. Cause: %{public}s', JSON.stringify(err));
                return;
            }
            windowStage.getMainWindow().then((window: window.Window) => {
                window.setWindowLayoutFullScreen(true).catch(() => {
                    Logger.error('setWindowLayoutFullScreen error!');
                });
                AppStorage.setOrCreate('windowClass', window);
            }).catch(() => {
                Logger.error('getMainWindow error!');
            });
            hilog.info(DOMAIN, 'testTag', 'Succeeded in loading the content.');
        });
    }
    onWindowStageDestroy(): void {
        // Main window is destroyed, release UI related resources
        hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onWindowStageDestroy');
    }
    onForeground(): void {
        // Ability has brought to foreground
        hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onForeground');
    }
    onBackground(): void {
        // Ability has back to background
        hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onBackground');
    }
    /**
     * Called when the application is about to be continued on another device
     * Save the current state data for continuation
     */
    onContinue(wantParam: Record<string, Object>): AbilityConstant.OnContinueResult {
        Logger.info(TAG, 'onContinue called for cross-device continuation');
        try {
            // Save current playback state
            const currentSongIndex = AppStorage.get<number>('currentSongIndex') ?? 0;
            const isPlaying = AppStorage.get<boolean>('isPlaying') ?? false;
            const currentVolume = AppStorage.get<number>('currentVolume') ?? 50;
            // Save volume settings
            const autoBalanceEnabled = AppStorage.get<boolean>('autoBalanceEnabled') ?? CommonConstants.DEFAULT_AUTO_BALANCE_ENABLED;
            const compressionRatio = AppStorage.get<number>('compressionRatio') ?? CommonConstants.DEFAULT_COMPRESSION_RATIO;
            const volumeKeysDisabled = AppStorage.get<boolean>('volumeKeysDisabled') ?? false;
            // Save EQ settings
            const eqEnabled = AppStorage.get<boolean>('eqEnabled') ?? CommonConstants.DEFAULT_EQ_ENABLED;
            const eqMode = AppStorage.get<string>('eqMode') ?? CommonConstants.DEFAULT_EQ_MODE;
            // Store all data in wantParam
            wantParam['currentSongIndex'] = currentSongIndex;
            wantParam['isPlaying'] = isPlaying;
            wantParam['currentVolume'] = currentVolume;
            wantParam['autoBalanceEnabled'] = autoBalanceEnabled;
            wantParam['compressionRatio'] = compressionRatio;
            wantParam['volumeKeysDisabled'] = volumeKeysDisabled;
            wantParam['eqEnabled'] = eqEnabled;
            wantParam['eqMode'] = eqMode;
            Logger.info(TAG, `Continue data saved: song=${currentSongIndex}, playing=${isPlaying}, volume=${currentVolume}`);
            return AbilityConstant.OnContinueResult.AGREE;
        }
        catch (error) {
            Logger.error(TAG, `Failed to save continue data: ${JSON.stringify(error)}`);
            return AbilityConstant.OnContinueResult.REJECT;
        }
    }
    /**
     * Called when a new Want is received (for hot start)
     * Handle continuation data restoration
     */
    onNewWant(want: Want, launchParam: AbilityConstant.LaunchParam): void {
        Logger.info(TAG, 'onNewWant called');
        if (launchParam.launchReason === AbilityConstant.LaunchReason.CONTINUATION) {
            Logger.info(TAG, 'Application hot started by continuation');
            this.restoreContinueData(want);
        }
    }
    /**
     * Restore data from continuation
     */
    private restoreContinueData(want: Want): void {
        try {
            if (!want.parameters) {
                Logger.warn(TAG, 'No continuation data found');
                return;
            }
            const params = want.parameters;
            // Restore playback state
            if (params['currentSongIndex'] !== undefined) {
                AppStorage.setOrCreate('continueSongIndex', params['currentSongIndex'] as number);
            }
            if (params['isPlaying'] !== undefined) {
                AppStorage.setOrCreate('continueIsPlaying', params['isPlaying'] as boolean);
            }
            if (params['currentVolume'] !== undefined) {
                AppStorage.setOrCreate('continueVolume', params['currentVolume'] as number);
            }
            // Restore volume settings
            if (params['autoBalanceEnabled'] !== undefined) {
                AppStorage.setOrCreate('autoBalanceEnabled', params['autoBalanceEnabled'] as boolean);
            }
            if (params['compressionRatio'] !== undefined) {
                AppStorage.setOrCreate('compressionRatio', params['compressionRatio'] as number);
            }
            if (params['volumeKeysDisabled'] !== undefined) {
                AppStorage.setOrCreate('volumeKeysDisabled', params['volumeKeysDisabled'] as boolean);
            }
            // Restore EQ settings
            if (params['eqEnabled'] !== undefined) {
                AppStorage.setOrCreate('eqEnabled', params['eqEnabled'] as boolean);
            }
            if (params['eqMode'] !== undefined) {
                AppStorage.setOrCreate('eqMode', params['eqMode'] as string);
            }
            Logger.info(TAG, 'Continue data restored successfully');
            // Notify the application that continuation data is ready
            AppStorage.setOrCreate('continuationReady', true);
        }
        catch (error) {
            Logger.error(TAG, `Failed to restore continue data: ${JSON.stringify(error)}`);
        }
    }
}
