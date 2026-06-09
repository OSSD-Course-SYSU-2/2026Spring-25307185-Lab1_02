import type { SongData } from '../model/SongData';
export const songDataList: SongData[] = [{
        id: 1,
        title: 'Dream It Possible',
        singer: 'Delacey',
        label: { "id": 16777230, "type": 20000, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" },
        src: 'Delacey - Dream It Possible',
        index: 0,
        isDarkBackground: true,
        mark: { "id": 16777278, "type": 20000, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" }
    }];
export enum AudioName {
    PCM = ".pcm"
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
    frequency: number; // 频段频率，单位Hz
    label: string; // 频段标签
    gain: number; // 增益值，范围-12到12 dB
}
export interface EQPreset {
    name: string; // 预设名称
    mode: EQMode; // 预设模式
    bands: number[]; // 各频段增益值数组，长度10
}
export const imageList: ResourceStr[] = [
    { "id": 16777221, "type": 20000, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" },
    { "id": 16777269, "type": 20000, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" }
];
