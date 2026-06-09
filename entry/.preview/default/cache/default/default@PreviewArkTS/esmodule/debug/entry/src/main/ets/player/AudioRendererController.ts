import audio from "@ohos:multimedia.audio";
import type { BusinessError } from "@ohos:base";
import fileIo from "@ohos:file.fs";
import type { ReadOptions } from "@ohos:file.fs";
import { Logger } from "@normalized:N&&&entry/src/main/ets/utils/Logger&";
import { MediaTools } from "@normalized:N&&&entry/src/main/ets/utils/MediaTools&";
import { AudioVolumeController } from "@normalized:N&&&entry/src/main/ets/player/AudioVolumeController&";
import { CommonConstants } from "@normalized:N&&&entry/src/main/ets/common/CommonConstants&";
const TAG = 'AudioRenderController';
// AudioRendererController methods.
export class AudioRendererController {
    private audioRenderer: audio.AudioRenderer | undefined = undefined;
    private currentOffset: number = 0;
    private offset: number = 0;
    private length: number = 0;
    private fd: number = 0;
    private curMs: number = 0;
    private audioVolumeController: AudioVolumeController = new AudioVolumeController();
    private currentVolume: number = CommonConstants.INITIAL_VOLUME; // Store current volume for EQ re-application
    // Initialization AudioRenderer.
    public async initAudioRenderer(fd: number, offset: number, length: number): Promise<void> {
        this.fd = fd; // File descriptor.
        this.offset = offset; // Start offset.
        this.currentOffset = offset; // Current offset.
        this.length = length; // File length.
        // Audio stream information.
        let audioStreamInfo: audio.AudioStreamInfo = {
            samplingRate: audio.AudioSamplingRate.SAMPLE_RATE_48000,
            channels: audio.AudioChannel.CHANNEL_2,
            sampleFormat: audio.AudioSampleFormat.SAMPLE_FORMAT_S16LE,
            encodingType: audio.AudioEncodingType.ENCODING_TYPE_RAW // Audio encoding format.
        };
        // AudioRenderer information.
        let audioRendererInfo: audio.AudioRendererInfo = {
            usage: audio.StreamUsage.STREAM_USAGE_MUSIC,
            rendererFlags: 0,
            volumeMode: audio.AudioVolumeMode.APP_INDIVIDUAL
        };
        // AudioRenderer options information.
        let audioRendererOptions: audio.AudioRendererOptions = {
            streamInfo: audioStreamInfo,
            rendererInfo: audioRendererInfo
        };
        // Get audio renderer.
        await audio.createAudioRenderer(audioRendererOptions).then((data) => {
            this.audioRenderer = data;
            if (this.audioRenderer) {
                try {
                    // Set the focus model to independent focus mode.
                    this.audioRenderer.setInterruptMode(audio.InterruptMode.INDEPENDENT_MODE);
                    this.setAudioStateChangeCallBack();
                    this.setWriteDataCallback(); // Write audio data.
                }
                catch (error) {
                    Logger.error('createAudioRenderer is calling.');
                }
            }
        });
        // Convert the file length to the corresponding number of milliseconds and store it in AppStorage.
        AppStorage.setOrCreate('progressMax', MediaTools.getMsFromByteLength(this.length));
        // Convert the file length to the corresponding number of milliseconds, then convert it to a timestamp and store it in AppStorage.
        AppStorage.setOrCreate('totalTime', MediaTools.msToCountdownTime(MediaTools.getMsFromByteLength(this.length)));
    }
    // Write audio data.
    private setWriteDataCallback(): void {
        try {
            // Listening for audio data writing.
            this.audioRenderer?.on('writeData', (buffer) => {
                if (this.currentOffset - this.offset >= this.length) {
                    this.currentOffset = this.offset;
                    this.seek(0);
                }
                let options: ReadOptions = {
                    offset: this.currentOffset,
                    length: buffer.byteLength
                };
                let bufferLength = fileIo.readSync(this.fd, buffer, options);
                if (bufferLength === -1) {
                    Logger.error('Read failed.');
                    return;
                }
                this.currentOffset += buffer.byteLength;
                let processOffset = this.currentOffset - this.offset;
                if (this.offset + this.length <= this.currentOffset) {
                    let view = new DataView(buffer);
                    Logger.info('currentOffset ：' + this.currentOffset + '  endOffset:' + (this.offset + this.length) +
                        ' bufferLength:' + bufferLength);
                    for (let i = bufferLength - 1; i > processOffset - this.length; i--) {
                        view.setUint8(i, 0);
                    }
                }
                let curMs = MediaTools.getMsFromByteLength(processOffset);
                AppStorage.setOrCreate('progress', curMs);
                AppStorage.setOrCreate('currentTime', MediaTools.msToCountdownTime(curMs));
                this.audioRenderer?.start().then(() => {
                    this.seek(this.curMs);
                }).catch((error: BusinessError) => {
                    Logger.error(`Error code: ${error.code}, message: ${error.message}`);
                });
            });
        }
        catch (error) {
            Logger.error('setWriteDataCallback is failed. ' + error);
        }
    }
    private setAudioStateChangeCallBack() {
        if (!this.audioRenderer) {
            Logger.info(TAG, 'state change callback failed, audioRenderer is null.');
            return;
        }
        this.audioRenderer.on('stateChange', async (state: audio.AudioState) => {
            switch (state) {
                case audio.AudioState.STATE_RUNNING:
                    Logger.info('AudioRender running state.');
                    AppStorage.setOrCreate('isPlay', true);
                    break;
                case audio.AudioState.STATE_PAUSED:
                    Logger.info('AudioRender paused state.');
                    AppStorage.setOrCreate('isPlay', false);
                    break;
                case audio.AudioState.STATE_STOPPED:
                    Logger.info('AudioRender stopped state.');
                    AppStorage.setOrCreate('isPlay', false);
                    break;
                default:
                    Logger.info('AudioRender other state.');
                    break;
            }
        });
    }
    public async start(): Promise<void> {
        if (this.audioRenderer !== undefined) {
            // Audio state.
            let stateGroup = [audio.AudioState.STATE_PREPARED, audio.AudioState.STATE_PAUSED, audio.AudioState.STATE_STOPPED];
            if (stateGroup.indexOf(this.audioRenderer.state.valueOf()) === -1) {
                return;
            }
            // Set the volume and store it for EQ re-application
            let audioStreamVolume: number = AppStorage.get('audioStreamVolume') ?? 0.5;
            const initialVolume = audioStreamVolume * 15;
            this.currentVolume = initialVolume; // Ensure currentVolume is set
            this.setVolume(initialVolume);
            // Starting the AudioRenderer.
            this.audioRenderer.start((err: BusinessError) => {
                if (err) {
                    Logger.error('Renderer start failed.');
                }
                else {
                    Logger.info('Renderer start success.');
                }
            });
        }
    }
    public pause(): void {
        if (this.audioRenderer !== undefined) {
            if (this.audioRenderer.state.valueOf() !== audio.AudioState.STATE_RUNNING) {
                return;
            }
            // Pause Audio rendering.
            this.audioRenderer.pause((err: BusinessError) => {
                if (err) {
                    Logger.error('Renderer pause failed.');
                }
                else {
                    Logger.info('Renderer pause success.');
                }
            });
        }
    }
    // Jump to playback.
    public seek(ms: number): void {
        if (ms < 0 || ms > MediaTools.getMsFromByteLength(this.length)) {
            Logger.error('Invalid seek position');
            return;
        }
        this.curMs = ms;
        AppStorage.setOrCreate('progress', this.curMs);
        AppStorage.setOrCreate('currentTime', MediaTools.msToCountdownTime(this.curMs));
        this.currentOffset = this.offset + MediaTools.getOffsetFromTime(this.curMs);
    }
    // Stop play
    public stop(): void {
        if (this.audioRenderer !== undefined) {
            if (this.audioRenderer.state.valueOf() !== audio.AudioState.STATE_RUNNING &&
                this.audioRenderer.state.valueOf() !== audio.AudioState.STATE_PAUSED) {
                return;
            }
            this.audioRenderer.stop(() => {
                Logger.error('audioRenderer stop failed.');
            });
        }
    }
    public release(): void {
        try {
            if (this.audioRenderer !== undefined) {
                if (this.audioRenderer.state.valueOf() === audio.AudioState.STATE_RELEASED) {
                    return;
                }
                this.audioRenderer.off('writeData');
                this.audioRenderer.release();
            }
        }
        catch (error) {
            Logger.info('Renderer release fail.');
        }
    }
    reset(fd: number, offset: number, length: number): void {
        this.fd = fd;
        this.offset = offset;
        this.length = length;
        this.curMs = 0;
        AppStorage.setOrCreate('progress', 0);
        AppStorage.setOrCreate('currentTime', MediaTools.msToCountdownTime(this.curMs));
    }
    public getVolume(): number {
        let volume = this.audioRenderer?.getVolume() ?? 1;
        return volume;
    }
    public setVolume(value: number): void {
        // Store current volume for EQ re-application
        this.currentVolume = value;
        // Get auto-balance settings
        const autoBalanceEnabled: boolean = AppStorage.get('autoBalanceEnabled') ?? CommonConstants.DEFAULT_AUTO_BALANCE_ENABLED;
        const compressionRatio: number = AppStorage.get('compressionRatio') ?? CommonConstants.DEFAULT_COMPRESSION_RATIO;
        // Get EQ settings
        const eqEnabled: boolean = AppStorage.get('eqEnabled') ?? CommonConstants.DEFAULT_EQ_ENABLED;
        const eqBands: number[] = AppStorage.get('eqBands') ?? CommonConstants.DEFAULT_EQ_PRESET;
        let finalVolume = value;
        // Apply auto-balance compression if enabled
        if (autoBalanceEnabled && this.audioVolumeController) {
            finalVolume = this.audioVolumeController.calculateDynamicCompression(value, compressionRatio);
        }
        // Apply EQ processing if enabled
        if (eqEnabled) {
            finalVolume = this.applyEQ(finalVolume, eqBands);
        }
        // Set the volume to audio renderer (0-1 range)
        this.audioRenderer?.setVolume(finalVolume / 15);
        // Store the actual volume (before compression) for UI display
        AppStorage.setOrCreate('audioStreamVolume', value / 15);
        // Store the compressed volume for reference
        AppStorage.setOrCreate('compressedVolume', finalVolume / 15);
    }
    // Apply EQ processing to the volume
    private applyEQ(volume: number, eqBands: number[]): number {
        // Simple EQ processing: calculate overall gain from EQ bands and apply it
        // In a real implementation, this would apply frequency-specific filtering
        // For now, we'll apply an overall gain adjustment based on EQ settings
        if (!eqBands || eqBands.length === 0) {
            return volume;
        }
        // Calculate overall gain from all EQ bands (include both positive and negative)
        // Use weighted average based on typical frequency response
        let totalGain = 0;
        let totalWeight = 0;
        // Apply different weights to different frequency bands
        // Low frequencies (bass) and high frequencies (treble) have more perceptual impact
        const weights = [1.2, 1.1, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.1, 1.2]; // 10 bands
        for (let i = 0; i < eqBands.length; i++) {
            const gain = eqBands[i];
            const weight = weights[i] || 1.0;
            totalGain += gain * weight;
            totalWeight += weight;
        }
        // Calculate weighted average gain
        const avgGain = totalWeight > 0 ? totalGain / totalWeight : 0;
        // Apply gain to volume (simple linear scaling)
        // Convert dB gain to linear multiplier: 10^(gain/20)
        const gainMultiplier = Math.pow(10, avgGain / 20);
        // Apply gain with volume limiting (max 15)
        let eqVolume = volume * gainMultiplier;
        // Limit to maximum volume
        if (eqVolume > 15) {
            eqVolume = 15;
        }
        // Also ensure minimum volume is not too low
        if (eqVolume < 0.1) {
            eqVolume = 0.1;
        }
        Logger.info(TAG, `EQ applied: gain=${avgGain.toFixed(2)}dB, multiplier=${gainMultiplier.toFixed(3)}, volume=${volume.toFixed(2)}->${eqVolume.toFixed(2)}`);
        return eqVolume;
    }
    // Re-apply EQ settings when EQ bands change
    public reapplyEQ(): void {
        Logger.info(TAG, `reapplyEQ called, currentVolume: ${this.currentVolume}, audioRenderer: ${this.audioRenderer ? 'available' : 'undefined'}`);
        if (this.audioRenderer) {
            // If currentVolume is not set, get it from AppStorage
            let volumeToApply = this.currentVolume;
            if (volumeToApply === undefined) {
                const audioStreamVolume: number = AppStorage.get('audioStreamVolume') ?? 0.5;
                volumeToApply = audioStreamVolume * 15;
                this.currentVolume = volumeToApply;
                Logger.info(TAG, `currentVolume was undefined, using AppStorage value: ${volumeToApply}`);
            }
            // Re-apply volume with current EQ settings
            this.setVolume(volumeToApply);
            Logger.info(TAG, `EQ re-applied for volume: ${volumeToApply}`);
        }
        else {
            Logger.warn(TAG, `Cannot reapply EQ: audioRenderer is undefined`);
        }
    }
}
