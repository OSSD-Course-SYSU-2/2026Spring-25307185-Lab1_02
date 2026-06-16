/*
 * Copyright (c) 2025 Huawei Device Co., Ltd.
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

import { SongData } from '../model/SongData';

export const  songDataList: SongData[] = [{
  id: 1,
  title: 'Dream It Possible',
  singer: 'Delacey',
  label: $r('app.media.ic_dream'),
  src: 'Delacey - Dream It Possible',
  index: 0,
  isDarkBackground: true,
  mark: $r('app.media.ic_vip')
}];

export enum AudioName {
  PCM = '.pcm'
}

export enum VolumeType {
  AUDIOSTREAM = 1
}

export enum AutoBalanceMode {
  OFF = 0,
  ON = 1
}

export enum EQMode {
  FLAT = 0,
  ROCK = 1,
  POP = 2,
  JAZZ = 3,
  CLASSICAL = 4,
  CUSTOM = 5
}

export interface EQBand {
  frequency: number;  // 频段频率，单位Hz
  label: string;      // 频段标签
  gain: number;       // 增益值，范围-12到12 dB
}

export interface EQPreset {
  name: string;       // 预设名称
  mode: EQMode;       // 预设模式
  bands: number[];    // 各频段增益值数组，长度10
}

export const imageList: ResourceStr[] = [
  $r('app.media.ic_public_play'),
  $r('app.media.ic_public_pause')
]