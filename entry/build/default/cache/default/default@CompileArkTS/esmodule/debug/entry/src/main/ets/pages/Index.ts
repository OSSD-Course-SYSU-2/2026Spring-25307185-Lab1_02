if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Index_Params {
    pathStack?: NavPathStack;
    introductions?: string[];
}
import { DeviceUtils } from "@normalized:N&&&entry/src/main/ets/utils/DeviceUtils&";
import { Logger } from "@normalized:N&&&entry/src/main/ets/utils/Logger&";
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.pathStack = new NavPathStack();
        this.introductions = [
            'app.string.introduction',
            'app.string.introduction_1',
            'app.string.introduction_2',
            'app.string.introduction_3',
            'app.string.introduction_4',
            'app.string.introduction_5',
            'app.string.introduction_6'
        ];
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Index_Params) {
        if (params.pathStack !== undefined) {
            this.pathStack = params.pathStack;
        }
        if (params.introductions !== undefined) {
            this.introductions = params.introductions;
        }
    }
    updateStateVars(params: Index_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private pathStack: NavPathStack;
    private introductions: string[];
    NavigationTitle(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding({
                left: DeviceUtils.getResponsivePadding(16),
                top: DeviceUtils.getResponsivePadding(36)
            });
            Column.alignItems(HorizontalAlign.End);
            Column.margin({ top: DeviceUtils.getResponsiveMargin(36) });
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777223, "type": 10003, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" });
            Text.fontSize(DeviceUtils.getResponsiveFontSize(30));
            Text.fontWeight(FontWeight.Bold);
            Text.width('100%');
            Text.height(56);
        }, Text);
        Text.pop();
        Column.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Navigation.create(this.pathStack, { moduleName: "entry", pagePath: "entry/src/main/ets/pages/Index", isUserCreateStack: true });
            Navigation.hideToolBar(true);
            Navigation.width('100%');
            Navigation.height('100%');
        }, Navigation);
        this.NavigationTitle.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.padding({
                left: DeviceUtils.getResponsivePadding(16),
                right: DeviceUtils.getResponsivePadding(16),
                top: DeviceUtils.getResponsivePadding(16),
                bottom: DeviceUtils.getResponsivePadding(164)
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('auto');
            Column.alignItems(HorizontalAlign.Start);
            Column.padding({
                left: DeviceUtils.getResponsivePadding(12),
                right: DeviceUtils.getResponsivePadding(12),
                bottom: DeviceUtils.getResponsivePadding(12),
                top: DeviceUtils.getResponsivePadding(12)
            });
            Column.backgroundColor('#F1F3F5');
            Column.borderRadius(16);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777241, "type": 10003, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" });
            Text.fontSize(DeviceUtils.getResponsiveFontSize(15));
            Text.lineHeight(DeviceUtils.getResponsiveFontSize(20));
            Text.fontWeight(FontWeight.Bold);
            Text.width('100%');
            Text.margin({ bottom: DeviceUtils.getResponsiveMargin(8) });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create({ "id": -1, "type": -1, params: [item], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" });
                    Text.fontSize(DeviceUtils.getResponsiveFontSize(13));
                    Text.opacity(0.6);
                    Text.lineHeight(DeviceUtils.getResponsiveFontSize(20));
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, this.introductions, forEachItemGenFunction, (item: string) => JSON.stringify(item), false, false);
        }, ForEach);
        ForEach.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel({ "id": 16777250, "type": 10003, params: [], "bundleName": "com.example.audiostreamvolumemanagement", "moduleName": "entry" });
            Button.width('100%');
            Button.buttonStyle(ButtonStyleMode.NORMAL);
            Button.onClick(() => {
                Logger.info('Index', 'Playback page button clicked, navigating to player page');
                try {
                    this.pathStack.pushPathByName('player', null);
                    Logger.info('Index', 'Navigation to player page initiated');
                }
                catch (error) {
                    Logger.error('Index', `Failed to navigate to player page: ${JSON.stringify(error)}`);
                }
            });
        }, Button);
        Button.pop();
        Column.pop();
        Navigation.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Index";
    }
}
registerNamedRoute(() => new Index(undefined, {}), "", { bundleName: "com.example.audiostreamvolumemanagement", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
