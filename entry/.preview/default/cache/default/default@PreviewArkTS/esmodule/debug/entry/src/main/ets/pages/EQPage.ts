if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface EQPage_Params {
    eqEnabled?: boolean;
    eqMode?: number;
    eqBands?: number[];
    presetOptions?: string[];
    selectedPresetIndex?: number;
}
import { CommonConstants } from "@normalized:N&&&entry/src/main/ets/common/CommonConstants&";
import { EQMode } from "@normalized:N&&&entry/src/main/ets/viewModel/PlayerViewModel&";
import router from "@ohos:router";
import type { AudioRendererController } from '../player/AudioRendererController';
export function EQPageBuilder(name: string, param: Object, parent = null) {
    {
        (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
            if (isInitialRender) {
                let componentCall = new EQPage(parent ? parent : this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/EQPage.ets", line: 23, col: 3 });
                ViewPU.create(componentCall);
                let paramsLambda = () => {
                    return {};
                };
                componentCall.paramsGenerator_ = paramsLambda;
            }
            else {
                (parent ? parent : this).updateStateVarsOfChildByElmtId(elmtId, {});
            }
        }, { name: "EQPage" });
    }
}
class EQPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__eqEnabled = this.createStorageLink('eqEnabled', CommonConstants.DEFAULT_EQ_ENABLED, "eqEnabled");
        this.__eqMode = this.createStorageLink('eqMode', CommonConstants.DEFAULT_EQ_MODE, "eqMode");
        this.__eqBands = this.createStorageLink('eqBands', CommonConstants.DEFAULT_EQ_PRESET, "eqBands");
        this.__presetOptions = new ObservedPropertyObjectPU([
            'Flat',
            'Rock',
            'Pop',
            'Jazz',
            'Classical',
            'Custom'
        ], this, "presetOptions");
        this.__selectedPresetIndex = new ObservedPropertySimplePU(0, this, "selectedPresetIndex");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: EQPage_Params) {
        if (params.presetOptions !== undefined) {
            this.presetOptions = params.presetOptions;
        }
        if (params.selectedPresetIndex !== undefined) {
            this.selectedPresetIndex = params.selectedPresetIndex;
        }
    }
    updateStateVars(params: EQPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__eqEnabled.purgeDependencyOnElmtId(rmElmtId);
        this.__eqMode.purgeDependencyOnElmtId(rmElmtId);
        this.__eqBands.purgeDependencyOnElmtId(rmElmtId);
        this.__presetOptions.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedPresetIndex.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__eqEnabled.aboutToBeDeleted();
        this.__eqMode.aboutToBeDeleted();
        this.__eqBands.aboutToBeDeleted();
        this.__presetOptions.aboutToBeDeleted();
        this.__selectedPresetIndex.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
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
    private __presetOptions: ObservedPropertyObjectPU<string[]>;
    get presetOptions() {
        return this.__presetOptions.get();
    }
    set presetOptions(newValue: string[]) {
        this.__presetOptions.set(newValue);
    }
    private __selectedPresetIndex: ObservedPropertySimplePU<number>;
    get selectedPresetIndex() {
        return this.__selectedPresetIndex.get();
    }
    set selectedPresetIndex(newValue: number) {
        this.__selectedPresetIndex.set(newValue);
    }
    aboutToAppear(): void {
        this.selectedPresetIndex = this.eqMode;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/EQPage.ets(49:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F8F9FA');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Header
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/EQPage.ets(51:7)", "entry");
            // Header
            Row.width('100%');
            // Header
            Row.padding({ left: 16, right: 16, top: 12, bottom: 12 });
            // Header
            Row.backgroundColor('#FFFFFF');
            // Header
            Row.borderRadius({ topLeft: 12, topRight: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777253, "type": 10003, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" });
            Text.debugLine("entry/src/main/ets/pages/EQPage.ets(52:9)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#182431');
            Text.layoutWeight(1);
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        // Header
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/pages/EQPage.ets(64:7)", "entry");
            Scroll.scrollable(ScrollDirection.Vertical);
            Scroll.scrollBar(BarState.Off);
            Scroll.backgroundColor('#F8F9FA');
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/EQPage.ets(65:9)", "entry");
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // EQ Enable Switch
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/EQPage.ets(67:11)", "entry");
            // EQ Enable Switch
            Row.height(56);
            // EQ Enable Switch
            Row.justifyContent(FlexAlign.SpaceBetween);
            // EQ Enable Switch
            Row.width('100%');
            // EQ Enable Switch
            Row.padding({ left: 16, right: 16 });
            // EQ Enable Switch
            Row.margin({ top: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777240, "type": 10003, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" });
            Text.debugLine("entry/src/main/ets/pages/EQPage.ets(68:13)", "entry");
            Text.fontSize(16);
            Text.fontColor('#182431');
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Toggle.create({ type: ToggleType.Switch, isOn: this.eqEnabled });
            Toggle.debugLine("entry/src/main/ets/pages/EQPage.ets(72:13)", "entry");
            Toggle.onChange((isOn: boolean) => {
                this.eqEnabled = isOn;
            });
        }, Toggle);
        Toggle.pop();
        // EQ Enable Switch
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.debugLine("entry/src/main/ets/pages/EQPage.ets(83:11)", "entry");
            Divider.backgroundColor('#F1F3F5');
            Divider.width('100%');
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Preset Selector
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/EQPage.ets(88:11)", "entry");
            // Preset Selector
            Column.margin({ top: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777245, "type": 10003, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" });
            Text.debugLine("entry/src/main/ets/pages/EQPage.ets(89:13)", "entry");
            Text.fontSize(16);
            Text.fontColor('#182431');
            Text.fontWeight(FontWeight.Medium);
            Text.margin({ bottom: 8 });
            Text.width('100%');
            Text.padding({ left: 16, right: 16 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Preset options
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/EQPage.ets(98:13)", "entry");
            // Preset options
            Column.borderRadius(8);
            // Preset options
            Column.backgroundColor('#FFFFFF');
            // Preset options
            Column.margin({ left: 16, right: 16, bottom: 16 });
            // Preset options
            Column.shadow({ radius: 4, color: '#1A000000', offsetX: 0, offsetY: 2 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.debugLine("entry/src/main/ets/pages/EQPage.ets(100:17)", "entry");
                    Row.width('100%');
                    Row.height(48);
                    Row.justifyContent(FlexAlign.SpaceBetween);
                    Row.padding({ left: 16, right: 16 });
                    Row.backgroundColor(this.selectedPresetIndex === index ? '#F0F7FF' : '#FFFFFF');
                    Row.onClick(() => {
                        this.selectedPresetIndex = index;
                        this.eqMode = index;
                        this.loadPreset(index);
                    });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(item);
                    Text.debugLine("entry/src/main/ets/pages/EQPage.ets(101:19)", "entry");
                    Text.fontSize(14);
                    Text.fontColor(this.selectedPresetIndex === index ? '#0A59F7' : '#182431');
                    Text.fontWeight(this.selectedPresetIndex === index ? FontWeight.Medium : FontWeight.Normal);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (this.selectedPresetIndex === index) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create('✓');
                                Text.debugLine("entry/src/main/ets/pages/EQPage.ets(107:21)", "entry");
                                Text.fontSize(16);
                                Text.fontColor('#0A59F7');
                                Text.fontWeight(FontWeight.Bold);
                                Text.margin({ left: 8 });
                            }, Text);
                            Text.pop();
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(1, () => {
                        });
                    }
                }, If);
                If.pop();
                Row.pop();
            };
            this.forEachUpdateFunction(elmtId, this.presetOptions, forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        // Preset options
        Column.pop();
        // Preset Selector
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.debugLine("entry/src/main/ets/pages/EQPage.ets(133:11)", "entry");
            Divider.backgroundColor('#F1F3F5');
            Divider.width('100%');
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // EQ Bands Sliders
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/EQPage.ets(138:11)", "entry");
            // EQ Bands Sliders
            Column.margin({ top: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777242, "type": 10003, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" });
            Text.debugLine("entry/src/main/ets/pages/EQPage.ets(139:13)", "entry");
            Text.fontSize(14);
            Text.fontColor('#666666');
            Text.margin({ bottom: 16 });
            Text.width('100%');
            Text.padding({ left: 16, right: 16 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // EQ Band sliders - Vertical layout
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/EQPage.ets(147:13)", "entry");
            // EQ Band sliders - Vertical layout
            Row.width('100%');
            // EQ Band sliders - Vertical layout
            Row.padding({ left: 12, right: 12 });
            // EQ Band sliders - Vertical layout
            Row.margin({ top: 8, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const frequency = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.debugLine("entry/src/main/ets/pages/EQPage.ets(149:17)", "entry");
                    Column.alignItems(HorizontalAlign.Center);
                    Column.justifyContent(FlexAlign.Center);
                    Column.layoutWeight(1);
                    Column.padding({ top: 12, bottom: 16 });
                    Column.backgroundColor('#FFFFFF');
                    Column.borderRadius(8);
                    Column.margin({ left: 4, right: 4 });
                    Column.shadow({ radius: 2, color: '#0A000000', offsetX: 0, offsetY: 1 });
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    // Current value label (above slider)
                    Text.create(`${this.eqBands[index].toFixed(1)}`);
                    Text.debugLine("entry/src/main/ets/pages/EQPage.ets(151:19)", "entry");
                    // Current value label (above slider)
                    Text.fontSize(11);
                    // Current value label (above slider)
                    Text.fontColor('#0A59F7');
                    // Current value label (above slider)
                    Text.margin({ bottom: 4 });
                }, Text);
                // Current value label (above slider)
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    // Vertical slider (reversed direction - top is max, bottom is min)
                    Slider.create({
                        value: this.eqBands[index],
                        min: CommonConstants.MIN_EQ_GAIN,
                        max: CommonConstants.MAX_EQ_GAIN,
                        step: CommonConstants.EQ_GAIN_STEP,
                        style: SliderStyle.InSet,
                        direction: Axis.Vertical,
                        reverse: true // Reverse the slider direction
                    });
                    Slider.debugLine("entry/src/main/ets/pages/EQPage.ets(157:19)", "entry");
                    // Vertical slider (reversed direction - top is max, bottom is min)
                    Slider.trackColor('#F1F3F5');
                    // Vertical slider (reversed direction - top is max, bottom is min)
                    Slider.selectedColor('#0A59F7');
                    // Vertical slider (reversed direction - top is max, bottom is min)
                    Slider.blockColor('#0A59F7');
                    // Vertical slider (reversed direction - top is max, bottom is min)
                    Slider.showSteps(false);
                    // Vertical slider (reversed direction - top is max, bottom is min)
                    Slider.showTips(true);
                    // Vertical slider (reversed direction - top is max, bottom is min)
                    Slider.width(6);
                    // Vertical slider (reversed direction - top is max, bottom is min)
                    Slider.height(160);
                    // Vertical slider (reversed direction - top is max, bottom is min)
                    Slider.onChange((value: number) => {
                        // Create a new array to ensure reactive update
                        const newBands = [...this.eqBands];
                        newBands[index] = value;
                        this.eqBands = newBands;
                        // Always mark as custom preset when user manually adjusts any band
                        this.eqMode = EQMode.CUSTOM;
                        this.selectedPresetIndex = EQMode.CUSTOM;
                    });
                }, Slider);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    // Frequency label below slider
                    Text.create(CommonConstants.EQ_BAND_LABELS[index]);
                    Text.debugLine("entry/src/main/ets/pages/EQPage.ets(184:19)", "entry");
                    // Frequency label below slider
                    Text.fontSize(12);
                    // Frequency label below slider
                    Text.fontColor('#182431');
                    // Frequency label below slider
                    Text.fontWeight(FontWeight.Medium);
                    // Frequency label below slider
                    Text.margin({ top: 8 });
                }, Text);
                // Frequency label below slider
                Text.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, CommonConstants.EQ_BAND_FREQUENCIES, forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        // EQ Band sliders - Vertical layout
        Row.pop();
        // EQ Bands Sliders
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Done Button - Fixed at bottom
            Button.createWithLabel({ "id": 16777239, "type": 10003, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" }, { type: ButtonType.Capsule });
            Button.debugLine("entry/src/main/ets/pages/EQPage.ets(207:11)", "entry");
            // Done Button - Fixed at bottom
            Button.width('90%');
            // Done Button - Fixed at bottom
            Button.height(48);
            // Done Button - Fixed at bottom
            Button.backgroundColor('#0A59F7');
            // Done Button - Fixed at bottom
            Button.fontColor('#FFFFFF');
            // Done Button - Fixed at bottom
            Button.fontSize(16);
            // Done Button - Fixed at bottom
            Button.fontWeight(FontWeight.Medium);
            // Done Button - Fixed at bottom
            Button.margin({ top: 8, bottom: 16 });
            // Done Button - Fixed at bottom
            Button.onClick(() => {
                router.back();
            });
        }, Button);
        // Done Button - Fixed at bottom
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Test Button - For debugging EQ application
            Button.createWithLabel('Test EQ Apply', { type: ButtonType.Capsule });
            Button.debugLine("entry/src/main/ets/pages/EQPage.ets(220:11)", "entry");
            // Test Button - For debugging EQ application
            Button.width('90%');
            // Test Button - For debugging EQ application
            Button.height(48);
            // Test Button - For debugging EQ application
            Button.backgroundColor('#FF6B6B');
            // Test Button - For debugging EQ application
            Button.fontColor('#FFFFFF');
            // Test Button - For debugging EQ application
            Button.fontSize(16);
            // Test Button - For debugging EQ application
            Button.fontWeight(FontWeight.Medium);
            // Test Button - For debugging EQ application
            Button.margin({ top: 8, bottom: 32 });
            // Test Button - For debugging EQ application
            Button.onClick(() => {
                // Manually trigger EQ re-application for testing
                const audioRendererController: AudioRendererController | undefined = AppStorage.get('audioRendererController');
                if (audioRendererController) {
                    audioRendererController.reapplyEQ();
                    console.log('EQ Test: Manually triggered EQ re-application');
                }
                else {
                    console.log('EQ Test: audioRendererController not available');
                }
            });
        }, Button);
        // Test Button - For debugging EQ application
        Button.pop();
        Column.pop();
        Scroll.pop();
        Column.pop();
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
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "EQPage";
    }
}
registerNamedRoute(() => new EQPage(undefined, {}), "", { bundleName: "com.example.audiostreamvolumemanagement", moduleName: "entry", pagePath: "pages/EQPage", pageFullPath: "entry/src/main/ets/pages/EQPage", integratedHsp: "false", moduleType: "followWithHap" });
(function () {
    if (typeof NavigationBuilderRegister === "function") {
        NavigationBuilderRegister("EQPage", wrapBuilder(EQPageBuilder));
    }
})();
