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

import { DeviceUtils } from '../utils/DeviceUtils';
import { Logger } from '../utils/Logger';

@Entry
@Component
struct Index {
  pathStack: NavPathStack = new NavPathStack();
  private introductions: string [] = [
    'app.string.introduction',
    'app.string.introduction_1',
    'app.string.introduction_2',
    'app.string.introduction_3',
    'app.string.introduction_4',
    'app.string.introduction_5',
    'app.string.introduction_6'
  ];

  @Builder
  NavigationTitle() {
    Column() {
      Text($r('app.string.audio_volume_control'))
        .fontSize(DeviceUtils.getResponsiveFontSize(30))
        .fontWeight(FontWeight.Bold)
        .width('100%')
        .height(56)
    }
    .padding({
      left: DeviceUtils.getResponsivePadding(16),
      top: DeviceUtils.getResponsivePadding(36)
    })
    .alignItems(HorizontalAlign.End)
    .margin({ top: DeviceUtils.getResponsiveMargin(36) })
    .width('100%')
  }

  build() {
    Navigation(this.pathStack) {
      this.NavigationTitle()
      Column() {
        Column() {
          Text($r('app.string.explanation'))
            .fontSize(DeviceUtils.getResponsiveFontSize(15))
            .lineHeight(DeviceUtils.getResponsiveFontSize(20))
            .fontWeight(FontWeight.Bold)
            .width('100%')
            .margin({ bottom: DeviceUtils.getResponsiveMargin(8) })
          ForEach(this.introductions, (item: string) => {
            Text($r(item))
              .fontSize(DeviceUtils.getResponsiveFontSize(13))
              .opacity(0.6)
              .lineHeight(DeviceUtils.getResponsiveFontSize(20))
          }, (item: string) => JSON.stringify(item))
        }
        .width('100%')
        .height('auto')
        .alignItems(HorizontalAlign.Start)
        .padding({
          left: DeviceUtils.getResponsivePadding(12),
          right: DeviceUtils.getResponsivePadding(12),
          bottom: DeviceUtils.getResponsivePadding(12),
          top: DeviceUtils.getResponsivePadding(12)
        })
        .backgroundColor('#F1F3F5')
        .borderRadius(16)

        Blank()

        Button($r('app.string.playback_page'))
          .width('100%')
          .buttonStyle(ButtonStyleMode.NORMAL)
          .onClick(() => {
            Logger.info('Index', 'Playback page button clicked, navigating to player page');
            try {
              this.pathStack.pushPathByName('player', null);
              Logger.info('Index', 'Navigation to player page initiated');
            } catch (error) {
              Logger.error('Index', `Failed to navigate to player page: ${JSON.stringify(error)}`);
            }
          })
      }
      .width('100%')
      .height('100%')
      .padding({
        left: DeviceUtils.getResponsivePadding(16),
        right: DeviceUtils.getResponsivePadding(16),
        top: DeviceUtils.getResponsivePadding(16),
        bottom: DeviceUtils.getResponsivePadding(164)
      })
    }
    .hideToolBar(true)
    .width('100%')
    .height('100%')
  }
}
