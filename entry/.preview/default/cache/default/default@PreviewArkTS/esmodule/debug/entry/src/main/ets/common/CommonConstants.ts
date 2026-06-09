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
export class CommonConstants {
    /**
     * Initial volume.
     */
    static readonly INITIAL_VOLUME: number = 5;
    /**
     * Mix volume.
     */
    static readonly MIX_VOLUME: number = 1;
    /**
     * Max volume.
     */
    static readonly MAX_VOLUME: number = 15;
    /**
     * Auto balance default compression ratio.
     */
    static readonly DEFAULT_COMPRESSION_RATIO: number = 0.5;
    /**
     * Auto balance default enabled state.
     */
    static readonly DEFAULT_AUTO_BALANCE_ENABLED: boolean = false;
    /**
     * Minimum compression ratio.
     */
    static readonly MIN_COMPRESSION_RATIO: number = 0.1;
    /**
     * Maximum compression ratio.
     */
    static readonly MAX_COMPRESSION_RATIO: number = 1.0;
    /**
     * Compression step.
     */
    static readonly COMPRESSION_STEP: number = 0.1;
    /**
     * EQ default enabled state.
     */
    static readonly DEFAULT_EQ_ENABLED: boolean = false;
    /**
     * EQ default mode.
     */
    static readonly DEFAULT_EQ_MODE: number = 0; // FLAT
    /**
     * Minimum EQ gain value (dB).
     */
    static readonly MIN_EQ_GAIN: number = -12.0;
    /**
     * Maximum EQ gain value (dB).
     */
    static readonly MAX_EQ_GAIN: number = 12.0;
    /**
     * EQ gain step.
     */
    static readonly EQ_GAIN_STEP: number = 0.5;
    /**
     * Number of EQ bands.
     */
    static readonly EQ_BAND_COUNT: number = 10;
    /**
     * EQ band frequencies (Hz).
     */
    static readonly EQ_BAND_FREQUENCIES: number[] = [
        31.25, 62.5, 125, 250, 500, 1000, 2000, 4000, 8000, 16000
    ];
    /**
     * EQ band labels.
     */
    static readonly EQ_BAND_LABELS: string[] = [
        '31Hz', '63Hz', '125Hz', '250Hz', '500Hz', '1kHz', '2kHz', '4kHz', '8kHz', '16kHz'
    ];
    /**
     * Default EQ preset values (flat).
     */
    static readonly DEFAULT_EQ_PRESET: number[] = [
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
    ];
    /**
     * Rock EQ preset values.
     */
    static readonly ROCK_EQ_PRESET: number[] = [
        4.0, 3.0, 2.0, 1.0, 0.0, -1.0, 0.0, 2.0, 3.0, 4.0
    ];
    /**
     * Pop EQ preset values.
     */
    static readonly POP_EQ_PRESET: number[] = [
        2.0, 3.0, 4.0, 3.0, 2.0, 1.0, 2.0, 3.0, 2.0, 1.0
    ];
    /**
     * Jazz EQ preset values.
     */
    static readonly JAZZ_EQ_PRESET: number[] = [
        3.0, 2.0, 1.0, 0.0, -1.0, 0.0, 1.0, 2.0, 3.0, 2.0
    ];
    /**
     * Classical EQ preset values.
     */
    static readonly CLASSICAL_EQ_PRESET: number[] = [
        1.0, 2.0, 3.0, 2.0, 1.0, 0.0, 1.0, 2.0, 1.0, 0.0
    ];
}
