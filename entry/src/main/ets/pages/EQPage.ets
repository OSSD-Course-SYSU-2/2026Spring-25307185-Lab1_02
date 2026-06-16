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

import { CommonConstants } from '../common/CommonConstants';
import { EQMode } from '../viewModel/PlayerViewModel';
import router from '@ohos.router';
import { AudioRendererController } from '../player/AudioRendererController';

@Builder
export function EQPageBuilder(name: string, param: Object) {
  EQPage()
}

@Entry
@Component
struct EQPage {
  @StorageLink('eqEnabled') eqEnabled: boolean = CommonConstants.DEFAULT_EQ_ENABLED;
  @StorageLink('eqMode') eqMode: number = CommonConstants.DEFAULT_EQ_MODE;
  @StorageLink('eqBands') eqBands: number[] = CommonConstants.DEFAULT_EQ_PRESET;
  
  @State presetOptions: string[] = [
    'Flat',
    'Rock',
    'Pop',
    'Jazz',
    'Classical',
    'Custom'
  ];
  
  @State selectedPresetIndex: number = 0;

  aboutToAppear(): void {
    this.selectedPresetIndex = this.eqMode;
  }

  build() {
    Column() {
      // Header
      Row() {
        Text($r('app.string.eq_settings'))
          .fontSize(20)
          .fontWeight(FontWeight.Medium)
          .fontColor('#182431')
          .layoutWeight(1)
          .textAlign(TextAlign.Center)
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 12, bottom: 12 })
      .backgroundColor('#FFFFFF')
      .borderRadius({ topLeft: 12, topRight: 12 })

      Scroll() {
        Column() {
          // EQ Enable Switch
          Row() {
            Text($r('app.string.enable_eq'))
              .fontSize(16)
              .fontColor('#182431')
              .fontWeight(FontWeight.Medium)
            Toggle({ type: ToggleType.Switch, isOn: this.eqEnabled })
              .onChange((isOn: boolean) => {
                this.eqEnabled = isOn;
              })
          }
          .height(56)
          .justifyContent(FlexAlign.SpaceBetween)
          .width('100%')
          .padding({ left: 16, right: 16 })
          .margin({ top: 8 })

          Divider()
            .backgroundColor('#F1F3F5')
            .width('100%')

          // Preset Selector
          Column() {
            Text($r('app.string.eq_preset'))
              .fontSize(16)
              .fontColor('#182431')
              .fontWeight(FontWeight.Medium)
              .margin({ bottom: 8 })
              .width('100%')
              .padding({ left: 16, right: 16 })

            // Preset options
            Column() {
              ForEach(this.presetOptions, (item: Resource, index: number) => {
                Row() {
                  Text(item)
                    .fontSize(14)
                    .fontColor(this.selectedPresetIndex === index ? '#0A59F7' : '#182431')
                    .fontWeight(this.selectedPresetIndex === index ? FontWeight.Medium : FontWeight.Normal)
                  
                  if (this.selectedPresetIndex === index) {
                    Text('✓')
                      .fontSize(16)
                      .fontColor('#0A59F7')
                      .fontWeight(FontWeight.Bold)
                      .margin({ left: 8 })
                  }
                }
                .width('100%')
                .height(48)
                .justifyContent(FlexAlign.SpaceBetween)
                .padding({ left: 16, right: 16 })
                .backgroundColor(this.selectedPresetIndex === index ? '#F0F7FF' : '#FFFFFF')
                .onClick(() => {
                  this.selectedPresetIndex = index;
                  this.eqMode = index;
                  this.loadPreset(index);
                })
              })
            }
            .borderRadius(8)
            .backgroundColor('#FFFFFF')
            .margin({ left: 16, right: 16, bottom: 16 })
            .shadow({ radius: 4, color: '#1A000000', offsetX: 0, offsetY: 2 })
          }
          .margin({ top: 16 })

          Divider()
            .backgroundColor('#F1F3F5')
            .width('100%')

          // EQ Bands Sliders
          Column() {
            Text($r('app.string.eq_description'))
              .fontSize(14)
              .fontColor('#666666')
              .margin({ bottom: 16 })
              .width('100%')
              .padding({ left: 16, right: 16 })

            // EQ Band sliders - Vertical layout
            Row() {
              ForEach(CommonConstants.EQ_BAND_FREQUENCIES, (frequency: number, index: number) => {
                Column() {
                  // Current value label (above slider)
                  Text(`${this.eqBands[index].toFixed(1)}`)
                    .fontSize(11)
                    .fontColor('#0A59F7')
                    .margin({ bottom: 4 })

                  // Vertical slider (reversed direction - top is max, bottom is min)
                  Slider({
                    value: this.eqBands[index],
                    min: CommonConstants.MIN_EQ_GAIN,
                    max: CommonConstants.MAX_EQ_GAIN,
                    step: CommonConstants.EQ_GAIN_STEP,
                    style: SliderStyle.InSet,
                    direction: Axis.Vertical,
                    reverse: true  // Reverse the slider direction
                  })
                  .trackColor('#F1F3F5')
                  .selectedColor('#0A59F7')
                  .blockColor('#0A59F7')
                  .showSteps(false)
                  .showTips(true)
                  .width(6)  // Make slider thin
                  .height(160)  // Set slider height
                  .onChange((value: number) => {
                    // Create a new array to ensure reactive update
                    const newBands = [...this.eqBands];
                    newBands[index] = value;
                    this.eqBands = newBands;
                    // Always mark as custom preset when user manually adjusts any band
                    this.eqMode = EQMode.CUSTOM;
                    this.selectedPresetIndex = EQMode.CUSTOM;
                  })

                  // Frequency label below slider
                  Text(CommonConstants.EQ_BAND_LABELS[index])
                    .fontSize(12)
                    .fontColor('#182431')
                    .fontWeight(FontWeight.Medium)
                    .margin({ top: 8 })
                }
                .alignItems(HorizontalAlign.Center)
                .justifyContent(FlexAlign.Center)
                .layoutWeight(1)
                .padding({ top: 12, bottom: 16 })
                .backgroundColor('#FFFFFF')
                .borderRadius(8)
                .margin({ left: 4, right: 4 })
                .shadow({ radius: 2, color: '#0A000000', offsetX: 0, offsetY: 1 })
              })
            }
            .width('100%')
            .padding({ left: 12, right: 12 })
            .margin({ top: 8, bottom: 8 })
          }
          .margin({ top: 16 })

          // Done Button - Fixed at bottom
          Button($r('app.string.done'), { type: ButtonType.Capsule })
            .width('90%')
            .height(48)
            .backgroundColor('#0A59F7')
            .fontColor('#FFFFFF')
            .fontSize(16)
            .fontWeight(FontWeight.Medium)
            .margin({ top: 8, bottom: 16 })
            .onClick(() => {
              router.back();
            })
            
          // Test Button - For debugging EQ application
          Button('Test EQ Apply', { type: ButtonType.Capsule })
            .width('90%')
            .height(48)
            .backgroundColor('#FF6B6B')
            .fontColor('#FFFFFF')
            .fontSize(16)
            .fontWeight(FontWeight.Medium)
            .margin({ top: 8, bottom: 32 })
            .onClick(() => {
              // Manually trigger EQ re-application for testing
              const audioRendererController: AudioRendererController | undefined = AppStorage.get('audioRendererController');
              if (audioRendererController) {
                audioRendererController.reapplyEQ();
                console.log('EQ Test: Manually triggered EQ re-application');
              } else {
                console.log('EQ Test: audioRendererController not available');
              }
            })
        }
        .width('100%')
      }
      .scrollable(ScrollDirection.Vertical)
      .scrollBar(BarState.Off)
      .backgroundColor('#F8F9FA')
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F8F9FA')
  }

  private loadPreset(presetIndex: number): void {
    switch (presetIndex) {
      case EQMode.FLAT:
        this.eqBands = [...CommonConstants.DEFAULT_EQ_PRESET];
        // Ensure mode is set to FLAT (though it's already set in onClick)
        this.eqMode = EQMode.FLAT;
        this.selectedPresetIndex = EQMode.FLAT;
        break;
      case EQMode.ROCK:
        this.eqBands = [...CommonConstants.ROCK_EQ_PRESET];
        break;
      case EQMode.POP:
        this.eqBands = [...CommonConstants.POP_EQ_PRESET];
        break;
      case EQMode.JAZZ:
        this.eqBands = [...CommonConstants.JAZZ_EQ_PRESET];
        break;
      case EQMode.CLASSICAL:
        this.eqBands = [...CommonConstants.CLASSICAL_EQ_PRESET];
        break;
      case EQMode.CUSTOM:
        // Keep current custom settings
        break;
    }
  }
}