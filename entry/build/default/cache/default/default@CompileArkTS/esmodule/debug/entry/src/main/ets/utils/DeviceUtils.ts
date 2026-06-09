import deviceInfo from "@ohos:deviceInfo";
import display from "@ohos:display";
import { Logger } from "@normalized:N&&&entry/src/main/ets/utils/Logger&";
/**
 * Device type enumeration
 */
export enum DeviceType {
    PHONE = "phone",
    TABLET = "tablet",
    TV = "tv",
    CAR = "car",
    WEARABLE = "wearable",
    UNKNOWN = "unknown"
}
/**
 * Screen size categories based on width
 */
export enum ScreenSize {
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large",
    XLARGE = "xlarge" // width >= 1200vp
}
/**
 * Device orientation
 */
export enum Orientation {
    PORTRAIT = "portrait",
    LANDSCAPE = "landscape"
}
/**
 * Device utility class for multi-device adaptation
 */
export class DeviceUtils {
    private static deviceType: DeviceType = DeviceType.UNKNOWN;
    private static screenWidth: number = 0;
    private static screenHeight: number = 0;
    private static screenDensity: number = 1.0;
    private static initialized: boolean = false;
    /**
     * Initialize device information
     */
    static init(): void {
        if (DeviceUtils.initialized) {
            return;
        }
        try {
            // Get device type
            const deviceType = deviceInfo.deviceType;
            Logger.info('DeviceUtils', `Device type: ${deviceType}`);
            switch (deviceType) {
                case 'phone':
                    DeviceUtils.deviceType = DeviceType.PHONE;
                    break;
                case 'tablet':
                    DeviceUtils.deviceType = DeviceType.TABLET;
                    break;
                case 'tv':
                    DeviceUtils.deviceType = DeviceType.TV;
                    break;
                case 'car':
                    DeviceUtils.deviceType = DeviceType.CAR;
                    break;
                case 'wearable':
                    DeviceUtils.deviceType = DeviceType.WEARABLE;
                    break;
                default:
                    DeviceUtils.deviceType = DeviceType.UNKNOWN;
            }
            // Get screen information
            const displayInfo = display.getDefaultDisplaySync();
            const density = displayInfo.densityPixels;
            // Convert pixels to virtual pixels (vp)
            DeviceUtils.screenWidth = displayInfo.width / density;
            DeviceUtils.screenHeight = displayInfo.height / density;
            DeviceUtils.screenDensity = density;
            Logger.info('DeviceUtils', `Screen: ${DeviceUtils.screenWidth}x${DeviceUtils.screenHeight}, density: ${DeviceUtils.screenDensity}`);
            DeviceUtils.initialized = true;
        }
        catch (error) {
            Logger.error('DeviceUtils', `Failed to init device info: ${JSON.stringify(error)}`);
            // Default to phone for fallback
            DeviceUtils.deviceType = DeviceType.PHONE;
            DeviceUtils.screenWidth = 360;
            DeviceUtils.screenHeight = 780;
            DeviceUtils.screenDensity = 1.0;
            DeviceUtils.initialized = true;
        }
    }
    /**
     * Get current device type
     */
    static getDeviceType(): DeviceType {
        if (!DeviceUtils.initialized) {
            DeviceUtils.init();
        }
        return DeviceUtils.deviceType;
    }
    /**
     * Check if device is phone
     */
    static isPhone(): boolean {
        return DeviceUtils.getDeviceType() === DeviceType.PHONE;
    }
    /**
     * Check if device is tablet
     */
    static isTablet(): boolean {
        return DeviceUtils.getDeviceType() === DeviceType.TABLET;
    }
    /**
     * Check if device is TV
     */
    static isTV(): boolean {
        return DeviceUtils.getDeviceType() === DeviceType.TV;
    }
    /**
     * Check if device is car
     */
    static isCar(): boolean {
        return DeviceUtils.getDeviceType() === DeviceType.CAR;
    }
    /**
     * Check if device is wearable
     */
    static isWearable(): boolean {
        return DeviceUtils.getDeviceType() === DeviceType.WEARABLE;
    }
    /**
     * Get screen width in vp
     */
    static getScreenWidth(): number {
        if (!DeviceUtils.initialized) {
            DeviceUtils.init();
        }
        return DeviceUtils.screenWidth;
    }
    /**
     * Get screen height in vp
     */
    static getScreenHeight(): number {
        if (!DeviceUtils.initialized) {
            DeviceUtils.init();
        }
        return DeviceUtils.screenHeight;
    }
    /**
     * Get screen density
     */
    static getScreenDensity(): number {
        if (!DeviceUtils.initialized) {
            DeviceUtils.init();
        }
        return DeviceUtils.screenDensity;
    }
    /**
     * Get screen size category
     */
    static getScreenSize(): ScreenSize {
        const width = DeviceUtils.getScreenWidth();
        if (width < 600) {
            return ScreenSize.SMALL;
        }
        else if (width < 840) {
            return ScreenSize.MEDIUM;
        }
        else if (width < 1200) {
            return ScreenSize.LARGE;
        }
        else {
            return ScreenSize.XLARGE;
        }
    }
    /**
     * Get current orientation
     */
    static getOrientation(): Orientation {
        const width = DeviceUtils.getScreenWidth();
        const height = DeviceUtils.getScreenHeight();
        return width > height ? Orientation.LANDSCAPE : Orientation.PORTRAIT;
    }
    /**
     * Check if screen is in landscape mode
     */
    static isLandscape(): boolean {
        return DeviceUtils.getOrientation() === Orientation.LANDSCAPE;
    }
    /**
     * Check if screen is in portrait mode
     */
    static isPortrait(): boolean {
        return DeviceUtils.getOrientation() === Orientation.PORTRAIT;
    }
    /**
     * Get responsive font size based on device type and screen size
     */
    static getResponsiveFontSize(baseSize: number): number {
        const screenSize = DeviceUtils.getScreenSize();
        let multiplier = 1.0;
        switch (screenSize) {
            case ScreenSize.SMALL:
                multiplier = 0.9;
                break;
            case ScreenSize.MEDIUM:
                multiplier = 1.0;
                break;
            case ScreenSize.LARGE:
                multiplier = 1.1;
                break;
            case ScreenSize.XLARGE:
                multiplier = 1.2;
                break;
        }
        // Adjust for device type
        if (DeviceUtils.isTablet() || DeviceUtils.isTV()) {
            multiplier *= 1.1;
        }
        else if (DeviceUtils.isWearable()) {
            multiplier *= 0.8;
        }
        return Math.round(baseSize * multiplier);
    }
    /**
     * Get responsive padding based on device type and screen size
     */
    static getResponsivePadding(basePadding: number): number {
        const screenSize = DeviceUtils.getScreenSize();
        let multiplier = 1.0;
        switch (screenSize) {
            case ScreenSize.SMALL:
                multiplier = 0.8;
                break;
            case ScreenSize.MEDIUM:
                multiplier = 1.0;
                break;
            case ScreenSize.LARGE:
                multiplier = 1.2;
                break;
            case ScreenSize.XLARGE:
                multiplier = 1.5;
                break;
        }
        // Adjust for device type
        if (DeviceUtils.isTablet() || DeviceUtils.isTV()) {
            multiplier *= 1.3;
        }
        else if (DeviceUtils.isWearable()) {
            multiplier *= 0.7;
        }
        return Math.round(basePadding * multiplier);
    }
    /**
     * Get responsive margin based on device type and screen size
     */
    static getResponsiveMargin(baseMargin: number): number {
        return DeviceUtils.getResponsivePadding(baseMargin);
    }
    /**
     * Check if device supports volume key events
     */
    static supportsVolumeKeys(): boolean {
        const deviceType = DeviceUtils.getDeviceType();
        return deviceType === DeviceType.PHONE ||
            deviceType === DeviceType.TABLET ||
            deviceType === DeviceType.TV ||
            deviceType === DeviceType.CAR;
    }
    /**
     * Check if device supports touch gestures
     */
    static supportsTouch(): boolean {
        const deviceType = DeviceUtils.getDeviceType();
        return deviceType === DeviceType.PHONE ||
            deviceType === DeviceType.TABLET ||
            deviceType === DeviceType.WEARABLE;
    }
    /**
     * Check if device has remote control (TV, car)
     */
    static hasRemoteControl(): boolean {
        const deviceType = DeviceUtils.getDeviceType();
        return deviceType === DeviceType.TV || deviceType === DeviceType.CAR;
    }
}
