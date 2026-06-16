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

import { audio } from '@kit.AudioKit';

// AudioVolumeController methods.
export class AudioVolumeController {
  private audioVolumeManager: audio.AudioVolumeManager | undefined = undefined;

  public creatVolumeManager(): void {
    let audioManager = audio.getAudioManager();
    this.audioVolumeManager = audioManager.getVolumeManager();
    this.onStreamVolumeChange();
  }

  // Get the current volume of the audio stream.
  public getVolumeByStream(): number {
    let volume = this.audioVolumeManager?.getVolumeByStream(audio.StreamUsage.STREAM_USAGE_MUSIC) ?? 0;
    AppStorage.setOrCreate('systemVolume', volume);
    return volume;
  }

  // Get the minimum volume for the audio stream.
  public getMinVolumeByStream(): number {
    let volume = this.audioVolumeManager?.getMinVolumeByStream(audio.StreamUsage.STREAM_USAGE_MUSIC) ?? 0;
    return volume;
  }

  // Get the maximum volume for the audio stream.
  public getMaxVolumeByStream(): number {
    let volume = this.audioVolumeManager?.getMaxVolumeByStream(audio.StreamUsage.STREAM_USAGE_MUSIC) ?? 0;
    return volume;
  }

  // Monitor changes in audio volume.
  public onStreamVolumeChange(): void {
    this.audioVolumeManager?.on('streamVolumeChange', audio.StreamUsage.STREAM_USAGE_MUSIC,
      (streamVolumeEvent: audio.StreamVolumeEvent) => {
        let volume = streamVolumeEvent.volume;
        AppStorage.setOrCreate('volume', volume);
        if (streamVolumeEvent.updateUi) {
          AppStorage.setOrCreate('volumeVisible', false);
        }
      });
  }

  // Cancel monitoring.
  public offStreamVolumeChange(): void {
    this.audioVolumeManager?.off('streamVolumeChange');
  }

  /**
   * Apply auto-balance compression to volume.
   * @param volume Original volume value (0-15)
   * @param compressionRatio Compression ratio (0.1-1.0)
   * @param enabled Whether auto-balance is enabled
   * @returns Compressed volume value (0-15)
   */
  public applyAutoBalance(volume: number, compressionRatio: number, enabled: boolean): number {
    if (!enabled || volume <= 0) {
      return volume;
    }

    // Normalize volume to 0-1 range
    const normalizedVolume = volume / 15;
    
    // Apply compression algorithm
    // Using a soft-knee compressor algorithm
    const threshold = 0.5; // 50% threshold
    const ratio = 1 + (compressionRatio * 2); // Ratio from 1:1 to 1:3
    
    let compressedVolume: number;
    
    if (normalizedVolume <= threshold) {
      // Below threshold: linear region
      compressedVolume = normalizedVolume;
    } else {
      // Above threshold: compression region
      const excess = normalizedVolume - threshold;
      const compressedExcess = excess / ratio;
      compressedVolume = threshold + compressedExcess;
    }
    
    // Ensure volume stays within safe range (not too quiet, not too loud)
    const minVolume = 0.1; // Minimum 10% volume
    const maxVolume = 0.9; // Maximum 90% volume
    const safeVolume = Math.max(minVolume, Math.min(maxVolume, compressedVolume));
    
    // Convert back to 0-15 range
    return Math.round(safeVolume * 15);
  }

  /**
   * Calculate dynamic compression based on volume level.
   * This provides more compression for louder volumes.
   * @param volume Original volume (0-15)
   * @param compressionRatio User-defined compression strength (0.1-1.0)
   * @returns Compressed volume (0-15)
   */
  public calculateDynamicCompression(volume: number, compressionRatio: number): number {
    if (volume <= 0) {
      return volume;
    }
    
    // Base compression curve
    const normalizedVolume = volume / 15;
    
    // Apply compression curve: more compression at higher volumes
    const compressionAmount = compressionRatio * Math.pow(normalizedVolume, 2);
    
    // Calculate compressed volume
    const compressedNormalized = normalizedVolume * (1 - compressionAmount);
    
    // Ensure minimum volume
    const minNormalized = 0.1;
    const safeNormalized = Math.max(minNormalized, compressedNormalized);
    
    return Math.round(safeNormalized * 15);
  }

}