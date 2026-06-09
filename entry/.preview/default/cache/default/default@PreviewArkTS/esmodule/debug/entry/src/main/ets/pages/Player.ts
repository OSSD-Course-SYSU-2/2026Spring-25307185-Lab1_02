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
export function PlayerBuilder(name: string, param: Object, parent = null) {
    {
        (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
            if (isInitialRender) {
                let componentCall = new Player(parent ? parent : this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Player.ets", line: 35, col: 3 });
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
                    let componentCall = new VolumeSettingComponent(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Player.ets", line: 57, col: 5 });
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
                    this.getUIContext().getPromptAction().showToast({ message: { "id": 16777267, "type": 10003, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" } });
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
                    this.getUIContext().getPromptAction().showToast({ message: { "id": 16777266, "type": 10003, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" } });
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
                    Stack.debugLine("entry/src/main/ets/pages/Player.ets(157:7)", "entry");
                    Stack.height('100%');
                    Stack.width('100%');
                }, Stack);
                {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        if (isInitialRender) {
                            let componentCall = new 
                            // Do not display the system volume bar.
                            SetVolume(this, { volume: this.volume }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Player.ets", line: 159, col: 9 });
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
                    Column.debugLine("entry/src/main/ets/pages/Player.ets(160:9)", "entry");
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
                    Column.height(280);
                    Column.width('100%');
                    Column.margin({ bottom: 200 });
                }, Column);
                {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        if (isInitialRender) {
                            let componentCall = new 
                            // Use the custom volume bar.
                            SystemVolumePanel(this, {
                                volume: this.__volume,
                                volumeVisible: this.__systemVolumeVisible
                            }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Player.ets", line: 162, col: 11 });
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
                    Image.debugLine("entry/src/main/ets/pages/Player.ets(188:9)", "entry");
                    Image.size({ height: '120%' });
                    Image.aspectRatio(1);
                    Image.objectFit(ImageFit.Cover);
                    Image.opacity(0.5);
                }, Image);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.debugLine("entry/src/main/ets/pages/Player.ets(194:9)", "entry");
                    Column.height('100%');
                    Column.width('100%');
                    Column.padding({ top: 12, bottom: 36 });
                }, Column);
                this.NavDestinationTitle.bind(this)();
                this.CoverInfo.bind(this)();
                this.MusicInfo.bind(this)();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Blank.create();
                    Blank.debugLine("entry/src/main/ets/pages/Player.ets(198:11)", "entry");
                }, Blank);
                Blank.pop();
                {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        if (isInitialRender) {
                            let componentCall = new ControlAreaComponent(this, { songData: songDataList[0], imageColor: this.imageColor }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Player.ets", line: 199, col: 11 });
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
            NavDestination.debugLine("entry/src/main/ets/pages/Player.ets(156:5)", "entry");
        }, NavDestination);
        NavDestination.pop();
    }
    NavDestinationTitle(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Player.ets(220:5)", "entry");
            Column.alignItems(HorizontalAlign.End);
            Column.padding({
                top: 36,
                right: 16,
                left: 16
            });
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Player.ets(221:7)", "entry");
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Player.ets(222:9)", "entry");
            Row.width(42);
            Row.height(42);
            Row.borderRadius(42);
            Row.backgroundColor('#19FFFFFF');
            Row.justifyContent(FlexAlign.Center);
            Row.onClick(() => {
                this.pageInfos.pop();
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777273, "type": 20000, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/pages/Player.ets(223:11)", "entry");
            Image.width(20);
            Image.height(20);
        }, Image);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Player.ets(236:9)", "entry");
            Row.width(42);
            Row.height(42);
            Row.borderRadius(42);
            Row.backgroundColor('#19FFFFFF');
            Row.justifyContent(FlexAlign.Center);
            Row.bindSheet({ value: this.isShow, changeEvent: newValue => { this.isShow = newValue; } }, { builder: this.volumeSettingBuilder.bind(this) }, {
                height: this.sheetHeight,
                backgroundColor: '#FFFFFF',
                title: { title: { "id": 16777264, "type": 10003, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" } }
            });
            Row.onClick(() => {
                this.isShow = true;
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777228, "type": 20000, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/pages/Player.ets(237:11)", "entry");
            Image.width(24);
            Image.height(24);
        }, Image);
        Row.pop();
        Row.pop();
        Column.pop();
    }
    CoverInfo(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Player.ets(269:5)", "entry");
            Row.height('40%');
            Row.padding({ top: 24 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(songDataList[0].label);
            Image.debugLine("entry/src/main/ets/pages/Player.ets(270:7)", "entry");
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
            Column.debugLine("entry/src/main/ets/pages/Player.ets(288:5)", "entry");
            Column.padding({
                right: 24,
                left: 24
            });
            Column.margin({ top: 24 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({ justifyContent: FlexAlign.SpaceBetween, alignItems: ItemAlign.Center });
            Flex.debugLine("entry/src/main/ets/pages/Player.ets(289:7)", "entry");
        }, Flex);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(songDataList[0].title);
            Text.debugLine("entry/src/main/ets/pages/Player.ets(290:9)", "entry");
            Text.fontSize(20);
            Text.fontColor(Color.White);
            Text.opacity(0.86);
            Text.fontWeight(FontWeight.Bold);
            Text.fontFamily('HarmonyHeiTi-Bold');
        }, Text);
        Text.pop();
        Flex.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(songDataList[0].singer);
            Text.debugLine("entry/src/main/ets/pages/Player.ets(298:7)", "entry");
            Text.textAlign(TextAlign.Start);
            Text.fontSize(14);
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
            Column.debugLine("entry/src/main/ets/pages/Player.ets(391:5)", "entry");
            Column.backgroundColor('#FFFFFF');
            Column.width('100%');
            Column.height(500);
            Column.padding({
                top: 12,
                bottom: 16
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Player.ets(392:7)", "entry");
            Row.padding({ left: 16, right: 16 });
            Row.height(48);
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.width('100%');
            Row.margin({ bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777238, "type": 10003, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" });
            Text.debugLine("entry/src/main/ets/pages/Player.ets(393:9)", "entry");
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Toggle.create({ type: ToggleType.Switch, isOn: this.isDisabled });
            Toggle.debugLine("entry/src/main/ets/pages/Player.ets(394:9)", "entry");
            Toggle.onChange((isOn: boolean) => {
                this.isDisabled = isOn;
            });
        }, Toggle);
        Toggle.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.debugLine("entry/src/main/ets/pages/Player.ets(405:7)", "entry");
            Divider.backgroundColor('#F1F3F5');
            Divider.padding({ left: 16, right: 16 });
            Divider.width('100%');
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Player.ets(410:7)", "entry");
            Column.padding({ left: 16, right: 16 });
            Column.height(80);
            Column.width('100%');
            Column.margin({ bottom: 8 });
        }, Column);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new VolumePanelView(this, {
                        text: { "id": 16777233, "type": 10003, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" },
                        volumeVisible: true,
                        volumeType: VolumeType.AUDIOSTREAM,
                        Percentage: 50
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Player.ets", line: 411, col: 9 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            text: { "id": 16777233, "type": 10003, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" },
                            volumeVisible: true,
                            volumeType: VolumeType.AUDIOSTREAM,
                            Percentage: 50
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        text: { "id": 16777233, "type": 10003, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" },
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
            Divider.debugLine("entry/src/main/ets/pages/Player.ets(423:7)", "entry");
            Divider.backgroundColor('#F1F3F5');
            Divider.padding({ left: 16, right: 16 });
            Divider.width('100%');
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Auto Balance Volume Control
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Player.ets(429:7)", "entry");
            // Auto Balance Volume Control
            Column.padding({ left: 16, right: 16 });
            // Auto Balance Volume Control
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Auto Balance Switch
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Player.ets(431:9)", "entry");
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
            Text.create({ "id": 16777235, "type": 10003, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" });
            Text.debugLine("entry/src/main/ets/pages/Player.ets(432:11)", "entry");
            Text.fontSize(16);
            Text.fontColor('#182431');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Toggle.create({ type: ToggleType.Switch, isOn: this.autoBalanceEnabled });
            Toggle.debugLine("entry/src/main/ets/pages/Player.ets(435:11)", "entry");
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
                        Column.debugLine("entry/src/main/ets/pages/Player.ets(447:11)", "entry");
                        Column.width('100%');
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 音量平衡功能说明
                        Text.create({ "id": 16777236, "type": 10003, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" });
                        Text.debugLine("entry/src/main/ets/pages/Player.ets(449:13)", "entry");
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
                        Column.debugLine("entry/src/main/ets/pages/Player.ets(456:13)", "entry");
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
                        Row.debugLine("entry/src/main/ets/pages/Player.ets(457:15)", "entry");
                        Row.justifyContent(FlexAlign.SpaceBetween);
                        Row.width('100%');
                        Row.height(48);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create({ "id": 16777237, "type": 10003, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" });
                        Text.debugLine("entry/src/main/ets/pages/Player.ets(458:17)", "entry");
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`${Math.round(this.compressionRatio * 100)}%`);
                        Text.debugLine("entry/src/main/ets/pages/Player.ets(459:17)", "entry");
                        Text.fontColor(Color.Black);
                        Text.opacity(0.6);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Stack.create({ alignContent: Alignment.Top });
                        Stack.debugLine("entry/src/main/ets/pages/Player.ets(467:15)", "entry");
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
                        Slider.debugLine("entry/src/main/ets/pages/Player.ets(468:17)", "entry");
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
            Divider.debugLine("entry/src/main/ets/pages/Player.ets(500:7)", "entry");
            Divider.backgroundColor('#F1F3F5');
            Divider.padding({ left: 16, right: 16 });
            Divider.width('100%');
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // EQ Settings
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Player.ets(506:7)", "entry");
            // EQ Settings
            Column.padding({ left: 16, right: 16 });
            // EQ Settings
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // EQ Settings Button
            Button.createWithLabel('EQ Settings', { type: ButtonType.Normal });
            Button.debugLine("entry/src/main/ets/pages/Player.ets(508:9)", "entry");
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
                router.pushUrl({
                    url: 'pages/EQPage'
                });
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
