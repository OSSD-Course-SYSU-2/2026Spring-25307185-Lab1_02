/*
 * Copyright (c) 2026 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { BusinessError } from '@kit.BasicServicesKit';
import { effectKit } from '@kit.ArkGraphics2D';
import { image } from '@kit.ImageKit';
import { inputConsumer, KeyEvent } from '@kit.InputKit';
import { KeyCode } from '@kit.InputKit';
import { Logger } from '../utils/Logger';
import { ControlAreaComponent } from '../components/ControlAreaComponent';
import { ColorTools } from '../utils/ColorTools';
import { SetVolume } from '../components/AVVolumePanelView';
import { VolumePanelView } from '../components/VolumePanelView';
import { SystemVolumePanel } from '../components/SystemVolumePanelView';
import { songDataList, VolumeType } from '../viewModel/PlayerViewModel';
import { CommonConstants } from '../common/CommonConstants';
import { window } from '@kit.ArkUI';
import { AudioRendererController } from '../player/AudioRendererController';
import router from '@ohos.router';
import { DeviceUtils } from '../utils/DeviceUtils';

@Builder
export function PlayerBuilder(name: string, param: Object) {
  Player()
}



@Entry
@Component
struct Player {
  @State imageColor: string = 'rgba(0, 0, 2, 1.00)';
  @State imageLabel: PixelMap | Resource = songDataList[0].label;
  @State windowHeight: number = 300;
  @StorageLink('systemVolume') volume: number = CommonConstants.INITIAL_VOLUME;
  @State systemVolumeVisible: boolean = false;
  @StorageLink('isDisabled') @Watch('onIsDisabledChange') isDisabled: boolean = false;
  @StorageLink('autoBalanceEnabled') @Watch('onAutoBalanceEnabledChange') autoBalanceEnabled: boolean = CommonConstants.DEFAULT_AUTO_BALANCE_ENABLED;
  @StorageLink('compressionRatio') @Watch('onCompressionRatioChange') compressionRatio: number = CommonConstants.DEFAULT_COMPRESSION_RATIO;
  @StorageLink('eqEnabled') @Watch('onEQEnabledChange') eqEnabled: boolean = CommonConstants.DEFAULT_EQ_ENABLED;
  @StorageLink('eqMode') @Watch('onEQModeChange') eqMode: number = CommonConstants.DEFAULT_EQ_MODE;
  @StorageLink('eqBands') @Watch('onEQBandsChange') eqBands: number[] = CommonConstants.DEFAULT_EQ_PRESET;
  @State sheetHeight: number = 340;
  @State isShow: boolean = false;
  @Builder volumeSettingBuilder() {
    VolumeSettingComponent()
  }
  private timer: number | undefined = 0;
  private volumeUpCallBackFunc: (event: KeyEvent) => void = () => {
  };
  private volumeDownCallBackFunc: (event: KeyEvent) => void = () => {
  };
  private audioRendererController: AudioRendererController | undefined = undefined;
  pageInfos: NavPathStack = new NavPathStack();
  private windowClass: window.Window | undefined = AppStorage.get('windowClass');

  aboutToAppear(): void {
    this.getImageColor();
    this.sheetHeight = DeviceUtils.getResponsivePadding(340);
    this.windowHeight = DeviceUtils.getScreenHeight();
    this.keyIntercept();
    this.audioRendererController = AppStorage.get('audioRendererController');
    
    // Handle continuation data if available
    this.handleContinuationData();
    
    // Log initial EQ settings
    Logger.info('Player', `Initial EQ settings - Enabled: ${this.eqEnabled}, Mode: ${this.eqMode}, Bands: ${JSON.stringify(this.eqBands)}`);
    Logger.info('Player', `EQ change listeners registered for Player component`);
    
    // Test EQ re-application on startup
    if (this.audioRendererController) {
      Logger.info('Player', 'Testing EQ re-application on startup');
      this.reapplyEQSettings();
    }
    
    let systemBarProperties: window.SystemBarProperties = {
      statusBarContentColor: '#ffffff',
      statusBarColor: this.imageColor
    };
    this.windowClass?.setWindowSystemBarProperties(systemBarProperties).catch(() => {
      Logger.error('setWindowSystemBarProperties fail ');
    }).then(() => {
      Logger.info('setWindowSystemBarProperties success ');
    })
  }
  
  /**
   * Handle continuation data from cross-device migration
   */
  private handleContinuationData(): void {
    const continuationReady = AppStorage.get<boolean>('continuationReady');
    if (!continuationReady) {
      return;
    }
    
    Logger.info('Player', 'Processing continuation data');
    
    // Restore song index
    const continueSongIndex = AppStorage.get<number>('continueSongIndex');
    if (continueSongIndex !== undefined && continueSongIndex >= 0 && continueSongIndex < songDataList.length) {
      this.imageLabel = songDataList[continueSongIndex].label;
      AppStorage.setOrCreate('currentSongIndex', continueSongIndex);
      Logger.info('Player', `Restored song index: ${continueSongIndex}`);
    }
    
    // Restore volume
    const continueVolume = AppStorage.get<number>('continueVolume');
    if (continueVolume !== undefined) {
      this.volume = continueVolume;
      Logger.info('Player', `Restored volume: ${continueVolume}`);
    }
    
    // Clear continuation flags
    AppStorage.setOrCreate('continuationReady', false);
    AppStorage.delete('continueSongIndex');
    AppStorage.delete('continueIsPlaying');
    AppStorage.delete('continueVolume');
    
    Logger.info('Player', 'Continuation data processed successfully');
  }

  aboutToDisappear(): void {
    AppStorage.setOrCreate('progress', undefined);
    AppStorage.setOrCreate('currentTime', undefined);
    this.audioRendererController?.release();
    let sysBarProps: window.SystemBarProperties = {
      statusBarContentColor: '#000000'
    };
    this.windowClass?.setWindowSystemBarProperties(sysBarProps).catch((error: BusinessError) => {
      Logger.error('ImageSwitch', `setWindowSystemBarProperties failed. code=${error.code}, message=${error.message}`);
    });
  }

  keyIntercept(): void {
    // Only register volume key listeners on devices that support volume keys
    if (!DeviceUtils.supportsVolumeKeys()) {
      Logger.info('Player', 'Volume keys not supported on this device, skipping key intercept');
      return;
    }
    try {
      let options1: inputConsumer.KeyPressedConfig = {
        key: KeyCode.KEYCODE_VOLUME_UP,
        action: 1, // The act of pressing the button.
        isRepeat: false, // Prioritize the consumption of key events and do not report them.
      };
      let options2: inputConsumer.KeyPressedConfig = {
        key: KeyCode.KEYCODE_VOLUME_DOWN,
        action: 1, // The act of pressing the button.
        isRepeat: false, // Prioritize the consumption of key events and do not report them.
      };

      // Clicked the event callback on the volume button.
      this.volumeUpCallBackFunc = (event: KeyEvent) => {
        if (this.isDisabled) {
          this.getUIContext().getPromptAction().showToast({ message: $r('app.string.volume_key_up') });
          return;
        }
        this.systemVolumeVisible = true;
        this.volume = this.volume + 1;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.systemVolumeVisible = false;
        }, 3000);
      };

      // Clicked the volume button and triggered the event callback.
      this.volumeDownCallBackFunc = (event: KeyEvent) => {
        if (this.isDisabled) {
          this.getUIContext().getPromptAction().showToast({ message: $r('app.string.volume_key_down') });
          return;
        }
        this.systemVolumeVisible = true;
        this.volume = this.volume - 1;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.systemVolumeVisible = false;
        }, 3000);
      };
      inputConsumer.off('keyPressed');
      // Register for event listening.
      inputConsumer.on('keyPressed', options1, this.volumeUpCallBackFunc);
      inputConsumer.on('keyPressed', options2, this.volumeDownCallBackFunc);
    } catch (error) {
      Logger.error(`Subscribe execute failed, error: ${JSON.stringify(error, [`code`, `message`])}`);
    }
  }

  build() {
    NavDestination() {
      Stack() {
        // Do not display the system volume bar.
        SetVolume({ volume: this.volume })
        Column() {
          // Use the custom volume bar.
          SystemVolumePanel({
            volume: this.volume,
            volumeVisible: this.systemVolumeVisible
          })
        }
        .padding({ right: 16 })
        .alignItems(HorizontalAlign.End)
        .gesture(
          PanGesture({ direction: PanDirection.Vertical })
            .onActionUpdate((event: GestureEvent) => {
              this.systemVolumeVisible = true;
              let curVolume = this.volume - this.getUIContext().vp2px(event.offsetY) / this.windowHeight;
              curVolume = curVolume >= 15.0 ? 15.0 : curVolume;
              curVolume = curVolume <= 0.0 ? 0.0 : curVolume;
              this.volume = curVolume;
              clearTimeout(this.timer);
              this.timer = setTimeout(() => {
                this.systemVolumeVisible = false;
              }, 3000);
            })
        )
        .zIndex(5)
        .height(DeviceUtils.getResponsivePadding(280))
        .width('100%')
        .margin({ bottom: DeviceUtils.getResponsiveMargin(200) })

        Image(this.imageLabel)
          .size({ height: '120%' })
          .aspectRatio(1)
          .objectFit(ImageFit.Cover)
          .opacity(0.5)

        Column() {
          this.NavDestinationTitle()
          this.CoverInfo()
          this.MusicInfo()
          Blank()
          ControlAreaComponent({ songData: songDataList[0], imageColor: this.imageColor })
        }
        .height('100%')
        .width('100%')
        .zIndex(10)  // 确保主内容区域在SystemVolumePanel之上
        .padding({ top: DeviceUtils.getResponsivePadding(12), bottom: DeviceUtils.getResponsivePadding(36) })
      }
      .height('100%')
      .width('100%')
    }
    .hideTitleBar(true)
    .backgroundColor(this.imageColor)
    .hideBackButton(true)
    .height('100%')
    .width('100%')
    .onReady((context: NavDestinationContext) => {
      this.pageInfos = context.pathStack;
    })
  }

  @Builder
  NavDestinationTitle() {
    Column() {
      Row() {
        Row() {
          Image($r('app.media.chevron_left'))
            .width(DeviceUtils.getResponsiveFontSize(20))
            .height(DeviceUtils.getResponsiveFontSize(20))
        }
        .width(DeviceUtils.getResponsivePadding(42))
        .height(DeviceUtils.getResponsivePadding(42))
        .borderRadius(DeviceUtils.getResponsivePadding(42))
        .backgroundColor('#19FFFFFF')
        .justifyContent(FlexAlign.Center)
        .onClick(() => {
          this.pageInfos.pop();
        })

        Button({ type: ButtonType.Circle }) {
          Image($r('app.media.slider_horizontal_2'))
            .width(DeviceUtils.getResponsiveFontSize(24))
            .height(DeviceUtils.getResponsiveFontSize(24))
        }
        .width(DeviceUtils.getResponsivePadding(56))
        .height(DeviceUtils.getResponsivePadding(56))
        .backgroundColor('#33FFFFFF')
        .zIndex(10)  // 提高zIndex确保按钮在最上层
        .bindSheet($$this.isShow, this.volumeSettingBuilder, {
          height: this.windowHeight * 0.7,
          backgroundColor: '#FFFFFF',
          title: { title: $r('app.string.setting') },
          preferType: SheetType.BOTTOM,
          shouldDismiss: ((sheetDismiss: SheetDismiss) => {
            // 点击外部区域、下拉关闭、点击关闭按钮时调用
            sheetDismiss.dismiss();
          })
        })
        .onClick(() => {
          Logger.info('Player', '=== SETTINGS BUTTON CLICKED ===');
          Logger.info('Player', `isShow before: ${this.isShow}`);
          Logger.info('Player', `windowHeight: ${this.windowHeight}`);
          this.isShow = true;
          Logger.info('Player', `isShow after: ${this.isShow}`);
        })
      }
      .justifyContent(FlexAlign.SpaceBetween)
      .width('100%')
    }
    .alignItems(HorizontalAlign.End)
    .padding({
      top: DeviceUtils.getResponsivePadding(36),
      right: DeviceUtils.getResponsivePadding(16),
      left: DeviceUtils.getResponsivePadding(16)
    })
    .width('100%')
  }

  @Builder
  CoverInfo() {
    Row() {
      Image(songDataList[0].label)
        .height('100%')
        .aspectRatio(1)
        .borderRadius(8)
        .shadow({
          radius: 12,
          color: '#66000000',
          offsetX: 0,
          offsetY: 8
        })
        .margin(3)
    }
    .height('40%')
    .padding({ top: 24 })
  }

  @Builder
  MusicInfo() {
    Column() {
      Flex({ justifyContent: FlexAlign.SpaceBetween, alignItems: ItemAlign.Center }) {
        Text(songDataList[0].title)
          .fontSize(DeviceUtils.getResponsiveFontSize(20))
          .fontColor(Color.White)
          .opacity(0.86)
          .fontWeight(FontWeight.Bold)
          .fontFamily('HarmonyHeiTi-Bold')
      }

      Text(songDataList[0].singer)
        .textAlign(TextAlign.Start)
        .fontSize(DeviceUtils.getResponsiveFontSize(14))
        .fontColor('#99FFFFFF')
        .fontFamily('HarmonyHeiTi')
        .width('100%')
        .fontWeight(FontWeight.Regular)
    }
    .padding({
      right: DeviceUtils.getResponsivePadding(24),
      left: DeviceUtils.getResponsivePadding(24)
    })
    .margin({ top: DeviceUtils.getResponsiveMargin(24) })
  }

  getImageColor() {
    this.getUIContext().getHostContext()!.resourceManager.getMediaContent(songDataList[0].label.id)
      .then((value: Uint8Array) => {
        let buffer = value.buffer as ArrayBuffer;
        let imageSource: image.ImageSource = image.createImageSource(buffer);
        let currentPixelMap: image.PixelMap;
        imageSource.createPixelMap().then((pixelMap) => {
          effectKit.createColorPicker(pixelMap, (error, colorPicker) => {
            if (error) {
              Logger.error(`Failed to create color picker. Error: ${error.code}, message: ${error.message}`);
            } else {
              currentPixelMap = pixelMap;
              let color: effectKit.Color = colorPicker.getLargestProportionColor();
              let colorArr: number[] = ColorTools.dealColor(color.red, color.green, color.blue);
              this.imageColor = `rgba(${colorArr[0]}, ${colorArr[1]}, ${colorArr[2]}, 1)`;
            }
          })
          let headFilter = effectKit.createEffect(pixelMap);
          if (headFilter !== null) {
            headFilter.blur(15);
            headFilter.getEffectPixelMap().then((value) => {
              this.imageLabel = value;
            });
          }
        })
          .finally(() => {
            imageSource?.release();
            currentPixelMap?.release();
          })
          .catch((error: BusinessError) => {
            Logger.error(`createPixelMap error: ${error.code}, message: ${error.message}`);
          })
      })
      .catch((error: BusinessError) => {
        Logger.error(`getMediaContent error: ${error.code}, message: ${error.message}`);
      })
  }

  // Called when EQ enabled state changes
  onEQEnabledChange(): void {
    Logger.info('Player', `EQ enabled changed to: ${this.eqEnabled}`);
    this.reapplyEQSettings();
  }

  // Called when EQ mode changes
  onEQModeChange(): void {
    Logger.info('Player', `EQ mode changed to: ${this.eqMode}`);
    this.reapplyEQSettings();
  }

  // Called when EQ bands change
  onEQBandsChange(): void {
    Logger.info('Player', `EQ bands changed: ${JSON.stringify(this.eqBands)}`);
    this.reapplyEQSettings();
  }

  // Called when auto balance enabled state changes
  onAutoBalanceEnabledChange(): void {
    Logger.info('Player', `Auto balance enabled changed to: ${this.autoBalanceEnabled}`);
    this.reapplyVolumeSettings();
  }

  // Called when compression ratio changes
  onCompressionRatioChange(): void {
    Logger.info('Player', `Compression ratio changed to: ${this.compressionRatio}`);
    this.reapplyVolumeSettings();
  }

  // Called when isDisabled state changes
  onIsDisabledChange(): void {
    Logger.info('Player', `isDisabled changed to: ${this.isDisabled}`);
    // Update UI or perform actions when disabled state changes
    if (this.isDisabled) {
      Logger.info('Player', 'Volume controls disabled');
      try {
        this.getUIContext().getPromptAction().showToast({ 
          message: $r('app.string.volume_keys_disabled') 
        });
      } catch (error) {
        Logger.error('Player', `Failed to show toast: ${JSON.stringify(error)}`);
      }
    } else {
      Logger.info('Player', 'Volume controls enabled');
      try {
        this.getUIContext().getPromptAction().showToast({ 
          message: $r('app.string.volume_keys_enabled') 
        });
      } catch (error) {
        Logger.error('Player', `Failed to show toast: ${JSON.stringify(error)}`);
      }
    }
  }

  // Re-apply EQ settings to audio renderer
  private reapplyEQSettings(): void {
    if (this.audioRendererController) {
      Logger.info('Player', 'Re-applying EQ settings to audio renderer');
      this.audioRendererController.reapplyEQ();
      Logger.info('Player', `EQ settings changed - Enabled: ${this.eqEnabled}, Mode: ${this.eqMode}, Bands: ${JSON.stringify(this.eqBands)}`);
    } else {
      Logger.warn('Player', 'audioRendererController is undefined, cannot reapply EQ settings');
    }
  }

  // Re-apply volume settings (including auto balance and compression)
  private reapplyVolumeSettings(): void {
    if (this.audioRendererController) {
      Logger.info('Player', `Re-applying volume settings - Auto balance: ${this.autoBalanceEnabled}, Compression ratio: ${this.compressionRatio}`);
      // Trigger volume re-application by getting current volume and setting it again
      const currentVolume = this.volume;
      this.audioRendererController.setVolume(currentVolume);
    } else {
      Logger.warn('Player', 'audioRendererController is undefined, cannot reapply volume settings');
    }
  }
}

@Component
struct VolumeSettingComponent {
  @StorageLink('autoBalanceEnabled') autoBalanceEnabled: boolean = CommonConstants.DEFAULT_AUTO_BALANCE_ENABLED;
  @StorageLink('compressionRatio') compressionRatio: number = CommonConstants.DEFAULT_COMPRESSION_RATIO;
  @StorageLink('isDisabled') isDisabled: boolean = false;
  @StorageLink('eqEnabled') eqEnabled: boolean = CommonConstants.DEFAULT_EQ_ENABLED;
  @StorageLink('eqMode') eqMode: number = CommonConstants.DEFAULT_EQ_MODE;
  @StorageLink('eqBands') eqBands: number[] = CommonConstants.DEFAULT_EQ_PRESET;

  build() {
    Column() {
      Row() {
        Text($r('app.string.disable'))
        Toggle({ type: ToggleType.Switch, isOn: this.isDisabled })
          .onChange((isOn: boolean) => {
            this.isDisabled = isOn;
          })
      }
      .padding({ left: 16, right: 16 })
      .height(48)
      .justifyContent(FlexAlign.SpaceBetween)
      .width('100%')
      .margin({ bottom: 8 })

      Divider()
        .backgroundColor('#F1F3F5')
        .padding({ left: 16, right: 16 })
        .width('100%')

      Column() {
        VolumePanelView({
          text: $r('app.string.audio_stream_volume'),
          volumeVisible: true,
          volumeType: VolumeType.AUDIOSTREAM,
          Percentage: 50
        })
      }
      .padding({ left: 16, right: 16 })
      .height(80)
      .width('100%')
      .margin({ bottom: 8 })

      Divider()
        .backgroundColor('#F1F3F5')
        .padding({ left: 16, right: 16 })
        .width('100%')

      // Auto Balance Volume Control
      Column() {
        // Auto Balance Switch
        Row() {
          Text($r('app.string.auto_balance'))
            .fontSize(16)
            .fontColor('#182431')
          Toggle({ type: ToggleType.Switch, isOn: this.autoBalanceEnabled })
            .onChange((isOn: boolean) => {
              this.autoBalanceEnabled = isOn;
            })
        }
        .height(48)
        .justifyContent(FlexAlign.SpaceBetween)
        .width('100%')
        .margin({ bottom: 12 })

        // Compression Ratio Slider (only visible when auto balance is enabled)
        if (this.autoBalanceEnabled) {
          Column() {
            // 音量平衡功能说明
            Text($r('app.string.auto_balance_description'))
              .fontSize(12)
              .fontColor('#666666')
              .margin({ bottom: 8 })
              .width('100%')
            
            // Compression strength slider
            Column() {
              Row() {
                Text($r('app.string.compression_strength'))
                Text(`${Math.round(this.compressionRatio * 100)}%`)
                  .fontColor(Color.Black)
                  .opacity(0.6)
              }
              .justifyContent(FlexAlign.SpaceBetween)
              .width('100%')
              .height(48)

              Stack({ alignContent: Alignment.Top }) {
                Slider({
                  value: this.compressionRatio,
                  min: CommonConstants.MIN_COMPRESSION_RATIO,
                  max: CommonConstants.MAX_COMPRESSION_RATIO,
                  step: CommonConstants.COMPRESSION_STEP,
                  style: SliderStyle.InSet,
                  reverse: false
                })
                .focusable(true)
                .defaultFocus(true)
                .focusOnTouch(true)
                .trackColor('#F1F3F5')
                .trackThickness(20)
                .selectedColor('#0A59F7')
                .onChange((value: number) => {
                  this.compressionRatio = value;
                })
              }
              .width('100%')
              .height(40)
            }
            .margin({ bottom: 12 })
            .alignItems(HorizontalAlign.Start)
            .width('100%')
            .height(88)
          }
          .width('100%')
        }
      }
      .padding({ left: 16, right: 16 })
      .width('100%')

      Divider()
        .backgroundColor('#F1F3F5')
        .padding({ left: 16, right: 16 })
        .width('100%')

      // EQ Settings
      Column() {
        // EQ Settings Button
        Button('EQ Settings', { type: ButtonType.Normal })
          .width('100%')
          .height(48)
          .backgroundColor('#F0F7FF')
          .fontColor('#0A59F7')
          .onClick(() => {
            // Navigate to EQ page
            Logger.info('VolumeSettingComponent', 'EQ Settings button clicked, navigating to EQPage');
            try {
              router.pushUrl({
                url: 'pages/EQPage'
              }).then(() => {
                Logger.info('VolumeSettingComponent', 'Navigation to EQPage successful');
              }).catch((error: BusinessError) => {
                Logger.error('VolumeSettingComponent', `Failed to navigate to EQPage: ${JSON.stringify(error)}`);
              });
            } catch (error) {
              Logger.error('VolumeSettingComponent', `Navigation error: ${JSON.stringify(error)}`);
            }
          })
          .margin({ bottom: 12 })
      }
      .padding({ left: 16, right: 16 })
      .width('100%')
    }
    .backgroundColor('#FFFFFF')
    .width('100%')
    .height('100%')
    .padding({
      top: 12,
      bottom: 16
    })
  }

  private getEQPresetName(): string {
    switch (this.eqMode) {
      case 0: return 'Flat';
      case 1: return 'Rock';
      case 2: return 'Pop';
      case 3: return 'Jazz';
      case 4: return 'Classical';
      case 5: return 'Custom';
      default: return 'Flat';
    }
  }
}