if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface VolumeSettingComponent_Params {
    autoBalanceEnabled?: boolean;
    compressionRatio?: number;
    isDisabled?: boolean;
    eqEnabled?: boolean;
    eqMode?: number;
    eqBands?: number[];
}
interface Player_Params {
    imageColor?: string;
    imageLabel?: PixelMap | Resource;
    windowHeight?: number;
    volume?: number;
    systemVolumeVisible?: boolean;
    isDisabled?: boolean;
    autoBalanceEnabled?: boolean;
    compressionRatio?: number;
    eqEnabled?: boolean;
    eqMode?: number;
    eqBands?: number[];
    sheetHeight?: number;
    isShow?: boolean;
    timer?: number | undefined;
    volumeUpCallBackFunc?: (event: KeyEvent) => void;
    volumeDownCallBackFunc?: (event: KeyEvent) => void;
    audioRendererController?: AudioRendererController | undefined;
    pageInfos?: NavPathStack;
    windowClass?: window.Window | undefined;
}
import type { BusinessError } from "@ohos:base";
import effectKit from "@ohos:effectKit";
import image from "@ohos:multimedia.image";
import inputConsumer from "@ohos:multimodalInput.inputConsumer";
import type { KeyEvent } from "@ohos:multimodalInput.keyEvent";
import { KeyCode } from "@ohos:multimodalInput.keyCode";
import { Logger } from "@normalized:N&&&entry/src/main/ets/utils/Logger&";
import { ControlAreaComponent } from "@normalized:N&&&entry/src/main/ets/components/ControlAreaComponent&";
import { ColorTools } from "@normalized:N&&&entry/src/main/ets/utils/ColorTools&";
import { SetVolume } from "@normalized:N&&&entry/src/main/ets/components/AVVolumePanelView&";
import { VolumePanelView } from "@normalized:N&&&entry/src/main/ets/components/VolumePanelView&";
import { SystemVolumePanel } from "@normalized:N&&&entry/src/main/ets/components/SystemVolumePanelView&";
import { songDataList, VolumeType } from "@normalized:N&&&entry/src/main/ets/viewModel/PlayerViewModel&";
import { CommonConstants } from "@normalized:N&&&entry/src/main/ets/common/CommonConstants&";
import type window from "@ohos:window";
import type { AudioRendererController } from '../player/AudioRendererController';
import router from "@ohos:router";
import { DeviceUtils } from "@normalized:N&&&entry/src/main/ets/utils/DeviceUtils&";
export function PlayerBuilder(name: string, param: Object, parent = null) {
    {
        (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
            if (isInitialRender) {
                let componentCall = new Player(parent ? parent : this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Player.ets", line: 36, col: 3 });
                ViewPU.create(componentCall);
                let paramsLambda = () => {
                    return {};
                };
                componentCall.paramsGenerator_ = paramsLambda;
            }
            else {
                (parent ? parent : this).updateStateVarsOfChildByElmtId(elmtId, {});
            }
        }, { name: "Player" });
    }
}
class Player extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__imageColor = new ObservedPropertySimplePU('rgba(0, 0, 2, 1.00)', this, "imageColor");
        this.__imageLabel = new ObservedPropertyObjectPU(songDataList[0].label, this, "imageLabel");
        this.__windowHeight = new ObservedPropertySimplePU(300, this, "windowHeight");
        this.__volume = this.createStorageLink('systemVolume', CommonConstants.INITIAL_VOLUME, "volume");
        this.__systemVolumeVisible = new ObservedPropertySimplePU(false, this, "systemVolumeVisible");
        this.__isDisabled = this.createStorageLink('isDisabled', false, "isDisabled");
        this.__autoBalanceEnabled = this.createStorageLink('autoBalanceEnabled', CommonConstants.DEFAULT_AUTO_BALANCE_ENABLED, "autoBalanceEnabled");
        this.__compressionRatio = this.createStorageLink('compressionRatio', CommonConstants.DEFAULT_COMPRESSION_RATIO, "compressionRatio");
        this.__eqEnabled = this.createStorageLink('eqEnabled', CommonConstants.DEFAULT_EQ_ENABLED, "eqEnabled");
        this.__eqMode = this.createStorageLink('eqMode', CommonConstants.DEFAULT_EQ_MODE, "eqMode");
        this.__eqBands = this.createStorageLink('eqBands', CommonConstants.DEFAULT_EQ_PRESET, "eqBands");
        this.__sheetHeight = new ObservedPropertySimplePU(340, this, "sheetHeight");
        this.__isShow = new ObservedPropertySimplePU(false, this, "isShow");
        this.timer = 0;
        this.volumeUpCallBackFunc = () => {
        };
        this.volumeDownCallBackFunc = () => {
        };
        this.audioRendererController = undefined;
        this.pageInfos = new NavPathStack();
        this.windowClass = AppStorage.get('windowClass');
        this.setInitiallyProvidedValue(params);
        this.declareWatch("isDisabled", this.onIsDisabledChange);
        this.declareWatch("autoBalanceEnabled", this.onAutoBalanceEnabledChange);
        this.declareWatch("compressionRatio", this.onCompressionRatioChange);
        this.declareWatch("eqEnabled", this.onEQEnabledChange);
        this.declareWatch("eqMode", this.onEQModeChange);
        this.declareWatch("eqBands", this.onEQBandsChange);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Player_Params) {
        if (params.imageColor !== undefined) {
            this.imageColor = params.imageColor;
        }
        if (params.imageLabel !== undefined) {
            this.imageLabel = params.imageLabel;
        }
        if (params.windowHeight !== undefined) {
            this.windowHeight = params.windowHeight;
        }
        if (params.systemVolumeVisible !== undefined) {
            this.systemVolumeVisible = params.systemVolumeVisible;
        }
        if (params.sheetHeight !== undefined) {
            this.sheetHeight = params.sheetHeight;
        }
        if (params.isShow !== undefined) {
            this.isShow = params.isShow;
        }
        if (params.timer !== undefined) {
            this.timer = params.timer;
        }
        if (params.volumeUpCallBackFunc !== undefined) {
            this.volumeUpCallBackFunc = params.volumeUpCallBackFunc;
        }
        if (params.volumeDownCallBackFunc !== undefined) {
            this.volumeDownCallBackFunc = params.volumeDownCallBackFunc;
        }
        if (params.audioRendererController !== undefined) {
            this.audioRendererController = params.audioRendererController;
        }
        if (params.pageInfos !== undefined) {
            this.pageInfos = params.pageInfos;
        }
        if (params.windowClass !== undefined) {
            this.windowClass = params.windowClass;
        }
    }
    updateStateVars(params: Player_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__imageColor.purgeDependencyOnElmtId(rmElmtId);
        this.__imageLabel.purgeDependencyOnElmtId(rmElmtId);
        this.__windowHeight.purgeDependencyOnElmtId(rmElmtId);
        this.__volume.purgeDependencyOnElmtId(rmElmtId);
        this.__systemVolumeVisible.purgeDependencyOnElmtId(rmElmtId);
        this.__isDisabled.purgeDependencyOnElmtId(rmElmtId);
        this.__autoBalanceEnabled.purgeDependencyOnElmtId(rmElmtId);
        this.__compressionRatio.purgeDependencyOnElmtId(rmElmtId);
        this.__eqEnabled.purgeDependencyOnElmtId(rmElmtId);
        this.__eqMode.purgeDependencyOnElmtId(rmElmtId);
        this.__eqBands.purgeDependencyOnElmtId(rmElmtId);
        this.__sheetHeight.purgeDependencyOnElmtId(rmElmtId);
        this.__isShow.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__imageColor.aboutToBeDeleted();
        this.__imageLabel.aboutToBeDeleted();
        this.__windowHeight.aboutToBeDeleted();
        this.__volume.aboutToBeDeleted();
        this.__systemVolumeVisible.aboutToBeDeleted();
        this.__isDisabled.aboutToBeDeleted();
        this.__autoBalanceEnabled.aboutToBeDeleted();
        this.__compressionRatio.aboutToBeDeleted();
        this.__eqEnabled.aboutToBeDeleted();
        this.__eqMode.aboutToBeDeleted();
        this.__eqBands.aboutToBeDeleted();
        this.__sheetHeight.aboutToBeDeleted();
        this.__isShow.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __imageColor: ObservedPropertySimplePU<string>;
    get imageColor() {
        return this.__imageColor.get();
    }
    set imageColor(newValue: string) {
        this.__imageColor.set(newValue);
    }
    private __imageLabel: ObservedPropertyObjectPU<PixelMap | Resource>;
    get imageLabel() {
        return this.__imageLabel.get();
    }
    set imageLabel(newValue: PixelMap | Resource) {
        this.__imageLabel.set(newValue);
    }
    private __windowHeight: ObservedPropertySimplePU<number>;
    get windowHeight() {
        return this.__windowHeight.get();
    }
    set windowHeight(newValue: number) {
        this.__windowHeight.set(newValue);
    }
    private __volume: ObservedPropertyAbstractPU<number>;
    get volume() {
        return this.__volume.get();
    }
    set volume(newValue: number) {
        this.__volume.set(newValue);
    }
    private __systemVolumeVisible: ObservedPropertySimplePU<boolean>;
    get systemVolumeVisible() {
        return this.__systemVolumeVisible.get();
    }
    set systemVolumeVisible(newValue: boolean) {
        this.__systemVolumeVisible.set(newValue);
    }
    private __isDisabled: ObservedPropertyAbstractPU<boolean>;
    get isDisabled() {
        return this.__isDisabled.get();
    }
    set isDisabled(newValue: boolean) {
        this.__isDisabled.set(newValue);
    }
    private __autoBalanceEnabled: ObservedPropertyAbstractPU<boolean>;
    get autoBalanceEnabled() {
        return this.__autoBalanceEnabled.get();
    }
    set autoBalanceEnabled(newValue: boolean) {
        this.__autoBalanceEnabled.set(newValue);
    }
    private __compressionRatio: ObservedPropertyAbstractPU<number>;
    get compressionRatio() {
        return this.__compressionRatio.get();
    }
    set compressionRatio(newValue: number) {
        this.__compressionRatio.set(newValue);
    }
    private __eqEnabled: ObservedPropertyAbstractPU<boolean>;
    get eqEnabled() {
        return this.__eqEnabled.get();
    }
    set eqEnabled(newValue: boolean) {
        this.__eqEnabled.set(newValue);
    }
    private __eqMode: ObservedPropertyAbstractPU<number>;
    get eqMode() {
        return this.__eqMode.get();
    }
    set eqMode(newValue: number) {
        this.__eqMode.set(newValue);
    }
    private __eqBands: ObservedPropertyAbstractPU<number[]>;
    get eqBands() {
        return this.__eqBands.get();
    }
    set eqBands(newValue: number[]) {
        this.__eqBands.set(newValue);
    }
    private __sheetHeight: ObservedPropertySimplePU<number>;
    get sheetHeight() {
        return this.__sheetHeight.get();
    }
    set sheetHeight(newValue: number) {
        this.__sheetHeight.set(newValue);
    }
    private __isShow: ObservedPropertySimplePU<boolean>;
    get isShow() {
        return this.__isShow.get();
    }
    set isShow(newValue: boolean) {
        this.__isShow.set(newValue);
    }
    volumeSettingBuilder(parent = null) {
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new VolumeSettingComponent(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Player.ets", line: 58, col: 5 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {};
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                }
            }, { name: "VolumeSettingComponent" });
        }
    }
    private timer: number | undefined;
    private volumeUpCallBackFunc: (event: KeyEvent) => void;
    private volumeDownCallBackFunc: (event: KeyEvent) => void;
    private audioRendererController: AudioRendererController | undefined;
    private pageInfos: NavPathStack;
    private windowClass: window.Window | undefined;
    aboutToAppear(): void {
        this.getImageColor();
        this.sheetHeight = DeviceUtils.getResponsivePadding(340);
        this.windowHeight = DeviceUtils.getScreenHeight();
        this.keyIntercept();
        this.audioRendererController = AppStorage.get('audioRendererController');
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
        });
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
                action: 1,
                isRepeat: false, // Prioritize the consumption of key events and do not report them.
            };
            let options2: inputConsumer.KeyPressedConfig = {
                key: KeyCode.KEYCODE_VOLUME_DOWN,
                action: 1,
                isRepeat: false, // Prioritize the consumption of key events and do not report them.
            };
            // Clicked the event callback on the volume button.
            this.volumeUpCallBackFunc = (event: KeyEvent) => {
                if (this.isDisabled) {
                    this.getUIContext().getPromptAction().showToast({ message: { "id": 16777254, "type": 10003, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" } });
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
                    this.getUIContext().getPromptAction().showToast({ message: { "id": 16777253, "type": 10003, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" } });
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
        }
        catch (error) {
            Logger.error(`Subscribe execute failed, error: ${JSON.stringify(error, [`code`, `message`])}`);
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            NavDestination.create(() => {
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Stack.create();
                    Stack.height('100%');
                    Stack.width('100%');
                }, Stack);
                {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        if (isInitialRender) {
                            let componentCall = new 
                            // Do not display the system volume bar.
                            SetVolume(this, { volume: this.volume }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Player.ets", line: 167, col: 9 });
                            ViewPU.create(componentCall);
                            let paramsLambda = () => {
                                return {
                                    volume: this.volume
                                };
                            };
                            componentCall.paramsGenerator_ = paramsLambda;
                        }
                        else {
                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                volume: this.volume
                            });
                        }
                    }, { name: "SetVolume" });
                }
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.padding({ right: 16 });
                    Column.alignItems(HorizontalAlign.End);
                    Gesture.create(GesturePriority.Low);
                    PanGesture.create({ direction: PanDirection.Vertical });
                    PanGesture.onActionUpdate((event: GestureEvent) => {
                        this.systemVolumeVisible = true;
                        let curVolume = this.volume - this.getUIContext().vp2px(event.offsetY) / this.windowHeight;
                        curVolume = curVolume >= 15.0 ? 15.0 : curVolume;
                        curVolume = curVolume <= 0.0 ? 0.0 : curVolume;
                        this.volume = curVolume;
                        clearTimeout(this.timer);
                        this.timer = setTimeout(() => {
                            this.systemVolumeVisible = false;
                        }, 3000);
                    });
                    PanGesture.pop();
                    Gesture.pop();
                    Column.zIndex(5);
                    Column.height(DeviceUtils.getResponsivePadding(280));
                    Column.width('100%');
                    Column.margin({ bottom: DeviceUtils.getResponsiveMargin(200) });
                }, Column);
                {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        if (isInitialRender) {
                            let componentCall = new 
                            // Use the custom volume bar.
                            SystemVolumePanel(this, {
                                volume: this.__volume,
                                volumeVisible: this.__systemVolumeVisible
                            }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Player.ets", line: 170, col: 11 });
                            ViewPU.create(componentCall);
                            let paramsLambda = () => {
                                return {
                                    volume: this.volume,
                                    volumeVisible: this.systemVolumeVisible
                                };
                            };
                            componentCall.paramsGenerator_ = paramsLambda;
                        }
                        else {
                            this.updateStateVarsOfChildByElmtId(elmtId, {});
                        }
                    }, { name: "SystemVolumePanel" });
                }
                Column.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Image.create(this.imageLabel);
                    Image.size({ height: '120%' });
                    Image.aspectRatio(1);
                    Image.objectFit(ImageFit.Cover);
                    Image.opacity(0.5);
                }, Image);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.height('100%');
                    Column.width('100%');
                    Column.zIndex(10);
                    Column.padding({ top: DeviceUtils.getResponsivePadding(12), bottom: DeviceUtils.getResponsivePadding(36) });
                }, Column);
                this.NavDestinationTitle.bind(this)();
                this.CoverInfo.bind(this)();
                this.MusicInfo.bind(this)();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Blank.create();
                }, Blank);
                Blank.pop();
                {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        if (isInitialRender) {
                            let componentCall = new ControlAreaComponent(this, { songData: songDataList[0], imageColor: this.imageColor }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Player.ets", line: 207, col: 11 });
                            ViewPU.create(componentCall);
                            let paramsLambda = () => {
                                return {
                                    songData: songDataList[0],
                                    imageColor: this.imageColor
                                };
                            };
                            componentCall.paramsGenerator_ = paramsLambda;
                        }
                        else {
                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                songData: songDataList[0], imageColor: this.imageColor
                            });
                        }
                    }, { name: "ControlAreaComponent" });
                }
                Column.pop();
                Stack.pop();
            }, { moduleName: "entry", pagePath: "entry/src/main/ets/pages/Player" });
            NavDestination.hideTitleBar(true);
            NavDestination.backgroundColor(this.imageColor);
            NavDestination.hideBackButton(true);
            NavDestination.height('100%');
            NavDestination.width('100%');
            NavDestination.onReady((context: NavDestinationContext) => {
                this.pageInfos = context.pathStack;
            });
        }, NavDestination);
        NavDestination.pop();
    }
    NavDestinationTitle(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.alignItems(HorizontalAlign.End);
            Column.padding({
                top: DeviceUtils.getResponsivePadding(36),
                right: DeviceUtils.getResponsivePadding(16),
                left: DeviceUtils.getResponsivePadding(16)
            });
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width(DeviceUtils.getResponsivePadding(42));
            Row.height(DeviceUtils.getResponsivePadding(42));
            Row.borderRadius(DeviceUtils.getResponsivePadding(42));
            Row.backgroundColor('#19FFFFFF');
            Row.justifyContent(FlexAlign.Center);
            Row.onClick(() => {
                this.pageInfos.pop();
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777259, "type": 20000, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" });
            Image.width(DeviceUtils.getResponsiveFontSize(20));
            Image.height(DeviceUtils.getResponsiveFontSize(20));
        }, Image);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild({ type: ButtonType.Circle });
            Button.width(DeviceUtils.getResponsivePadding(56));
            Button.height(DeviceUtils.getResponsivePadding(56));
            Button.backgroundColor('#33FFFFFF');
            Button.zIndex(10);
            Button.bindSheet({ value: this.isShow, changeEvent: newValue => { this.isShow = newValue; } }, { builder: this.volumeSettingBuilder.bind(this) }, {
                height: this.windowHeight * 0.7,
                backgroundColor: '#FFFFFF',
                title: { title: { "id": 16777251, "type": 10003, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" } },
                shouldDismiss: ((sheetDismiss: SheetDismiss) => {
                    // 点击外部区域、下拉关闭、点击关闭按钮时调用
                    sheetDismiss.dismiss();
                })
            });
            Button.onClick(() => {
                Logger.info('Player', '=== SETTINGS BUTTON CLICKED ===');
                Logger.info('Player', `isShow before: ${this.isShow}`);
                Logger.info('Player', `windowHeight: ${this.windowHeight}`);
                this.isShow = true;
                Logger.info('Player', `isShow after: ${this.isShow}`);
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777271, "type": 20000, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" });
            Image.width(DeviceUtils.getResponsiveFontSize(24));
            Image.height(DeviceUtils.getResponsiveFontSize(24));
        }, Image);
        Button.pop();
        Row.pop();
        Column.pop();
    }
    CoverInfo(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.height('40%');
            Row.padding({ top: 24 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(songDataList[0].label);
            Image.height('100%');
            Image.aspectRatio(1);
            Image.borderRadius(8);
            Image.shadow({
                radius: 12,
                color: '#66000000',
                offsetX: 0,
                offsetY: 8
            });
            Image.margin(3);
        }, Image);
        Row.pop();
    }
    MusicInfo(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding({
                right: DeviceUtils.getResponsivePadding(24),
                left: DeviceUtils.getResponsivePadding(24)
            });
            Column.margin({ top: DeviceUtils.getResponsiveMargin(24) });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({ justifyContent: FlexAlign.SpaceBetween, alignItems: ItemAlign.Center });
        }, Flex);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(songDataList[0].title);
            Text.fontSize(DeviceUtils.getResponsiveFontSize(20));
            Text.fontColor(Color.White);
            Text.opacity(0.86);
            Text.fontWeight(FontWeight.Bold);
            Text.fontFamily('HarmonyHeiTi-Bold');
        }, Text);
        Text.pop();
        Flex.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(songDataList[0].singer);
            Text.textAlign(TextAlign.Start);
            Text.fontSize(DeviceUtils.getResponsiveFontSize(14));
            Text.fontColor('#99FFFFFF');
            Text.fontFamily('HarmonyHeiTi');
            Text.width('100%');
            Text.fontWeight(FontWeight.Regular);
        }, Text);
        Text.pop();
        Column.pop();
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
                    }
                    else {
                        currentPixelMap = pixelMap;
                        let color: effectKit.Color = colorPicker.getLargestProportionColor();
                        let colorArr: number[] = ColorTools.dealColor(color.red, color.green, color.blue);
                        this.imageColor = `rgba(${colorArr[0]}, ${colorArr[1]}, ${colorArr[2]}, 1)`;
                    }
                });
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
            });
        })
            .catch((error: BusinessError) => {
            Logger.error(`getMediaContent error: ${error.code}, message: ${error.message}`);
        });
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
                    message: { "id": 16777280, "type": 10003, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" }
                });
            }
            catch (error) {
                Logger.error('Player', `Failed to show toast: ${JSON.stringify(error)}`);
            }
        }
        else {
            Logger.info('Player', 'Volume controls enabled');
            try {
                this.getUIContext().getPromptAction().showToast({
                    message: { "id": 16777281, "type": 10003, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" }
                });
            }
            catch (error) {
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
        }
        else {
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
        }
        else {
            Logger.warn('Player', 'audioRendererController is undefined, cannot reapply volume settings');
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Player";
    }
}
class VolumeSettingComponent extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__autoBalanceEnabled = this.createStorageLink('autoBalanceEnabled', CommonConstants.DEFAULT_AUTO_BALANCE_ENABLED, "autoBalanceEnabled");
        this.__compressionRatio = this.createStorageLink('compressionRatio', CommonConstants.DEFAULT_COMPRESSION_RATIO, "compressionRatio");
        this.__isDisabled = this.createStorageLink('isDisabled', false, "isDisabled");
        this.__eqEnabled = this.createStorageLink('eqEnabled', CommonConstants.DEFAULT_EQ_ENABLED, "eqEnabled");
        this.__eqMode = this.createStorageLink('eqMode', CommonConstants.DEFAULT_EQ_MODE, "eqMode");
        this.__eqBands = this.createStorageLink('eqBands', CommonConstants.DEFAULT_EQ_PRESET, "eqBands");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: VolumeSettingComponent_Params) {
    }
    updateStateVars(params: VolumeSettingComponent_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__autoBalanceEnabled.purgeDependencyOnElmtId(rmElmtId);
        this.__compressionRatio.purgeDependencyOnElmtId(rmElmtId);
        this.__isDisabled.purgeDependencyOnElmtId(rmElmtId);
        this.__eqEnabled.purgeDependencyOnElmtId(rmElmtId);
        this.__eqMode.purgeDependencyOnElmtId(rmElmtId);
        this.__eqBands.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__autoBalanceEnabled.aboutToBeDeleted();
        this.__compressionRatio.aboutToBeDeleted();
        this.__isDisabled.aboutToBeDeleted();
        this.__eqEnabled.aboutToBeDeleted();
        this.__eqMode.aboutToBeDeleted();
        this.__eqBands.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __autoBalanceEnabled: ObservedPropertyAbstractPU<boolean>;
    get autoBalanceEnabled() {
        return this.__autoBalanceEnabled.get();
    }
    set autoBalanceEnabled(newValue: boolean) {
        this.__autoBalanceEnabled.set(newValue);
    }
    private __compressionRatio: ObservedPropertyAbstractPU<number>;
    get compressionRatio() {
        return this.__compressionRatio.get();
    }
    set compressionRatio(newValue: number) {
        this.__compressionRatio.set(newValue);
    }
    private __isDisabled: ObservedPropertyAbstractPU<boolean>;
    get isDisabled() {
        return this.__isDisabled.get();
    }
    set isDisabled(newValue: boolean) {
        this.__isDisabled.set(newValue);
    }
    private __eqEnabled: ObservedPropertyAbstractPU<boolean>;
    get eqEnabled() {
        return this.__eqEnabled.get();
    }
    set eqEnabled(newValue: boolean) {
        this.__eqEnabled.set(newValue);
    }
    private __eqMode: ObservedPropertyAbstractPU<number>;
    get eqMode() {
        return this.__eqMode.get();
    }
    set eqMode(newValue: number) {
        this.__eqMode.set(newValue);
    }
    private __eqBands: ObservedPropertyAbstractPU<number[]>;
    get eqBands() {
        return this.__eqBands.get();
    }
    set eqBands(newValue: number[]) {
        this.__eqBands.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.backgroundColor('#FFFFFF');
            Column.width('100%');
            Column.height('100%');
            Column.padding({
                top: 12,
                bottom: 16
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.padding({ left: 16, right: 16 });
            Row.height(48);
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.width('100%');
            Row.margin({ bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777227, "type": 10003, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Toggle.create({ type: ToggleType.Switch, isOn: this.isDisabled });
            Toggle.onChange((isOn: boolean) => {
                this.isDisabled = isOn;
            });
        }, Toggle);
        Toggle.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.backgroundColor('#F1F3F5');
            Divider.padding({ left: 16, right: 16 });
            Divider.width('100%');
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding({ left: 16, right: 16 });
            Column.height(80);
            Column.width('100%');
            Column.margin({ bottom: 8 });
        }, Column);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new VolumePanelView(this, {
                        text: { "id": 16777222, "type": 10003, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" },
                        volumeVisible: true,
                        volumeType: VolumeType.AUDIOSTREAM,
                        Percentage: 50
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Player.ets", line: 476, col: 9 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            text: { "id": 16777222, "type": 10003, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" },
                            volumeVisible: true,
                            volumeType: VolumeType.AUDIOSTREAM,
                            Percentage: 50
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        text: { "id": 16777222, "type": 10003, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" },
                        volumeVisible: true,
                        volumeType: VolumeType.AUDIOSTREAM,
                        Percentage: 50
                    });
                }
            }, { name: "VolumePanelView" });
        }
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.backgroundColor('#F1F3F5');
            Divider.padding({ left: 16, right: 16 });
            Divider.width('100%');
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Auto Balance Volume Control
            Column.create();
            // Auto Balance Volume Control
            Column.padding({ left: 16, right: 16 });
            // Auto Balance Volume Control
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Auto Balance Switch
            Row.create();
            // Auto Balance Switch
            Row.height(48);
            // Auto Balance Switch
            Row.justifyContent(FlexAlign.SpaceBetween);
            // Auto Balance Switch
            Row.width('100%');
            // Auto Balance Switch
            Row.margin({ bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777224, "type": 10003, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" });
            Text.fontSize(16);
            Text.fontColor('#182431');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Toggle.create({ type: ToggleType.Switch, isOn: this.autoBalanceEnabled });
            Toggle.onChange((isOn: boolean) => {
                this.autoBalanceEnabled = isOn;
            });
        }, Toggle);
        Toggle.pop();
        // Auto Balance Switch
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // Compression Ratio Slider (only visible when auto balance is enabled)
            if (this.autoBalanceEnabled) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 音量平衡功能说明
                        Text.create({ "id": 16777225, "type": 10003, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" });
                        // 音量平衡功能说明
                        Text.fontSize(12);
                        // 音量平衡功能说明
                        Text.fontColor('#666666');
                        // 音量平衡功能说明
                        Text.margin({ bottom: 8 });
                        // 音量平衡功能说明
                        Text.width('100%');
                    }, Text);
                    // 音量平衡功能说明
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // Compression strength slider
                        Column.create();
                        // Compression strength slider
                        Column.margin({ bottom: 12 });
                        // Compression strength slider
                        Column.alignItems(HorizontalAlign.Start);
                        // Compression strength slider
                        Column.width('100%');
                        // Compression strength slider
                        Column.height(88);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.justifyContent(FlexAlign.SpaceBetween);
                        Row.width('100%');
                        Row.height(48);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create({ "id": 16777226, "type": 10003, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`${Math.round(this.compressionRatio * 100)}%`);
                        Text.fontColor(Color.Black);
                        Text.opacity(0.6);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Stack.create({ alignContent: Alignment.Top });
                        Stack.width('100%');
                        Stack.height(40);
                    }, Stack);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Slider.create({
                            value: this.compressionRatio,
                            min: CommonConstants.MIN_COMPRESSION_RATIO,
                            max: CommonConstants.MAX_COMPRESSION_RATIO,
                            step: CommonConstants.COMPRESSION_STEP,
                            style: SliderStyle.InSet,
                            reverse: false
                        });
                        Slider.focusable(true);
                        Slider.defaultFocus(true);
                        Slider.focusOnTouch(true);
                        Slider.trackColor('#F1F3F5');
                        Slider.trackThickness(20);
                        Slider.selectedColor('#0A59F7');
                        Slider.onChange((value: number) => {
                            this.compressionRatio = value;
                        });
                    }, Slider);
                    Stack.pop();
                    // Compression strength slider
                    Column.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // Auto Balance Volume Control
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.backgroundColor('#F1F3F5');
            Divider.padding({ left: 16, right: 16 });
            Divider.width('100%');
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // EQ Settings
            Column.create();
            // EQ Settings
            Column.padding({ left: 16, right: 16 });
            // EQ Settings
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // EQ Settings Button
            Button.createWithLabel('EQ Settings', { type: ButtonType.Normal });
            // EQ Settings Button
            Button.width('100%');
            // EQ Settings Button
            Button.height(48);
            // EQ Settings Button
            Button.backgroundColor('#F0F7FF');
            // EQ Settings Button
            Button.fontColor('#0A59F7');
            // EQ Settings Button
            Button.onClick(() => {
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
                }
                catch (error) {
                    Logger.error('VolumeSettingComponent', `Navigation error: ${JSON.stringify(error)}`);
                }
            });
            // EQ Settings Button
            Button.margin({ bottom: 12 });
        }, Button);
        // EQ Settings Button
        Button.pop();
        // EQ Settings
        Column.pop();
        Column.pop();
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
    rerender() {
        this.updateDirtyElements();
    }
}
registerNamedRoute(() => new Player(undefined, {}), "", { bundleName: "com.example.audiostreamvolumemanagement", moduleName: "entry", pagePath: "pages/Player", pageFullPath: "entry/src/main/ets/pages/Player", integratedHsp: "false", moduleType: "followWithHap" });
(function () {
    if (typeof NavigationBuilderRegister === "function") {
        NavigationBuilderRegister("player", wrapBuilder(PlayerBuilder));
    }
})();
