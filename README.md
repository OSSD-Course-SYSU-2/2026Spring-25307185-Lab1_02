# 音频流音量管理

## 项目简介

此项目基于华为的官方演示代码的[音频流音量管理](https://gitcode.com/HarmonyOS_Samples/audio-volume-management)进行开发

本案例展示如何获取音量、设置音量、使用手势调节音量、自定义音量面板、屏蔽音量键、自动平衡音量功能以及10段均衡器（EQ）调节功能，且支持多端部署与自由流转。

## 主要功能

- [x] 系统音量管理
- [x] 音频流音量控制
- [x] 手势音量调节
- [x] 自定义音量面板
- [x] 音量键屏蔽
- [x] 自动音量平衡
- [x] 10段均衡器（EQ）调节
- [x] 5种预设EQ模式（Flat, Rock, Pop, Jazz, Classical）
- [x] 自定义EQ频段调节
- [x] 实时音频效果应用
- [x] 自由流转（跨设备接续）
- [x] 多端部署（手机、平板、智慧屏、车机、智能穿戴）

## 效果预览

### 手机界面
<img src="./screenshots/device/screenshot_phone.png" width="320" alt="手机主界面">

### 手机EQ调节界面
<img src="./screenshots/device/screenshot_phone_eq.png" width="320" alt="手机EQ调节界面">

### 平板界面
<img src="./screenshots/device/screenshot_tablet.png" width="480" alt="平板界面">

## 使用说明

1. **安装应用**：使用DevEco Studio编译并安装应用到HarmonyOS设备。
2. **进入播放页**：启动应用后，点击"播放页"按钮进入音乐播放界面。
3. **播放音乐**：点击播放按钮开始播放音乐。
4. **音量设置**：点击右上角设置图标进入音量设置面板：
   - **禁用音量键**：点击开关可禁用/启用系统音量键
   - **音频流音量**：滑动滑块调节音乐播放音量
   - **自动平衡音量**：启用后自动平滑音频音量，避免突然变化
   - **压缩强度**：调节自动平衡的强度
   - **EQ设置**：点击"EQ Settings"按钮进入均衡器调节页面
5. **EQ调节**：在EQ页面可以：
   - 选择5种预设EQ模式（Flat, Rock, Pop, Jazz, Classical）
   - 手动调节10个频段的均衡器设置
   - 启用/禁用EQ效果
   - 实时预览音频效果变化
6. **自由流转**：在不同HarmonyOS设备间无缝切换，保持播放状态和设置。

## 工程目录

```
├──entry/src/main/ets/
│  ├──common                           // 公共模块
│  │  └──CommonConstants.ets           // 常量类
│  ├──components                       // 组件模块
│  │  ├──AVVolumePanelView.ets         // 系统音量条组件
│  │  ├──ControlAreaComponent.ets      // 播控区域组件
│  │  ├──SystemVolumePanelView.ets     // 自定义系统音量条组件
│  │  └──VolumePanelView.ets           // 自定义音量条组件
│  ├──entryability
│  │  └──EntryAbility.ets              // Ability的生命周期回调内容
│  ├──entrybackupability
│  │  └──EntryBackupAbility.ets        // EntryBackupAbility的生命周期回调内容
│  ├──model                        
│  │  └──SongData.ets                  // 歌曲实体
│  ├──pages
│  │  ├──Index.ets                     // 首页                             
│  │  ├──Player.ets                    // 播放页
│  │  └──EQPage.ets                    // EQ调节页面
│  ├──player                             
│  │  ├──AudioRendererController.ets   // AudioRenderer播放控制（包含EQ处理）
│  │  └──AudioVolumeController.ets     // AudioVolumeManager音量管理
│  ├──utils
│  │  ├──ColorTools.ets                // 背景颜色工具类
│  │  ├──DeviceUtils.ets               // 设备工具类（多端适配）
│  │  ├──Logger.ets                    // 日志工具类
│  │  └──MediaTools.ets                // 媒体工具类
│  └──viewModel
│     └──PlayerViewModel.ets           // 播放页数据模型
└──entry/src/main/resources            // 应用静态资源目录
```

## 具体实现

### 1. 系统音量管理
- 通过`audioVolumeManager`管理系统音量
- 滑动自定义音量条调节系统音量大小
- 监听系统音量变化并实时更新UI

### 2. 音频流音量控制
- 通过`audioRenderer`管理音频流音量
- 独立于系统音量，可单独调节应用内音频
- 支持手势滑动调节

### 3. 音量键屏蔽
- 通过注册`inputConsumer.on('keyPressed')`拦截音量键
- 可动态启用/禁用系统音量键功能
- 防止误操作干扰应用内音量调节

### 4. 自动音量平衡
- 动态压缩音频音量，避免音量突然变化
- 可调节压缩强度参数
- 提供更平滑的听觉体验

### 5. 10段均衡器（EQ）
- 精细调节10个音频频段（31Hz, 62Hz, 125Hz, 250Hz, 500Hz, 1kHz, 2kHz, 4kHz, 8kHz, 16kHz）
- 5种预设模式：Flat（平坦）、Rock（摇滚）、Pop（流行）、Jazz（爵士）、Classical（古典）
- 支持自定义频段调节
- 实时应用音效调整

### 6. 自由流转支持
- 支持HarmonyOS跨设备无缝接续
- 自动同步播放状态、音量设置、EQ设置
- 基于`continuable: true`配置和`DISTRIBUTED_DATASYNC`权限

### 7. 多端部署
- 支持手机、平板、智慧屏、车机、智能穿戴
- 使用`DeviceUtils`实现响应式布局
- 自适应不同屏幕尺寸和设备类型

## 相关权限

- `ohos.permission.DISTRIBUTED_DATASYNC`：用于自由流转功能，实现跨设备数据同步

## 依赖

- HarmonyOS SDK 6.0.0 Release及以上
- DevEco Studio 6.0.0 Release及以上

## 最近更新

### 增加自动音量平衡功能
新增了智能自动音量平衡功能，主要特性包括：

1. **动态音量压缩**：
   - 实时监测音频音量波动，自动调整增益
   - 平滑音量变化，避免突然的音量跳跃
   - 可调节压缩强度参数（低、中、高）

2. **智能算法**：
   - 基于RMS（均方根）计算音频信号强度
   - 使用动态范围压缩算法
   - 自适应阈值调整，根据音频内容动态优化

3. **实时处理**：
   - 在音频播放过程中实时应用音量平衡
   - 低延迟处理，不影响音频质量
   - 支持后台持续运行

4. **用户控制**：
   - 提供开关控制，可随时启用/禁用
   - 压缩强度滑块调节
   - 实时音量可视化显示

### 增加EQ调节功能
新增了完整的10段均衡器（EQ）调节功能，主要特性包括：

1. **10段均衡器调节**：
   - 支持10个音频频段精细调节（31Hz, 62Hz, 125Hz, 250Hz, 500Hz, 1kHz, 2kHz, 4kHz, 8kHz, 16kHz）
   - 每个频段支持-12dB到+12dB的增益调节
   - 实时音频效果应用，即时听到调节效果

2. **5种预设EQ模式**：
   - Flat（平坦）：所有频段增益为0，保持原始音质
   - Rock（摇滚）：增强低频和高频，突出节奏感
   - Pop（流行）：增强中频和人声，适合流行音乐
   - Jazz（爵士）：增强中高频，突出乐器细节
   - Classical（古典）：增强高频，提升空间感和细节

3. **智能EQ算法**：
   - 加权平均算法计算所有频段的增益值
   - 频率权重优化：低频和高频权重1.2，中频权重1.0
   - 音量限制保护：最小音量0.1，最大音量15，防止过载

4. **实时监听与同步**：
   - 在Player组件中添加`@Watch`装饰器监听EQ设置变化
   - 自动同步EQ状态到音频渲染器
   - 支持跨设备EQ设置同步（自由流转功能）

5. **用户友好的交互界面**：
   - 直观的滑块控制每个频段增益
   - 预设模式一键切换
   - 实时音频效果预览
   - 支持自定义EQ设置保存

## 自由流转支持

本项目支持HarmonyOS自由流转能力，实现跨设备无缝接续体验。

### 功能特性

1. **应用接续**：支持在不同HarmonyOS设备间无缝切换，保持播放状态
2. **状态同步**：自动同步以下数据：
   - 当前播放歌曲索引
   - 播放状态（播放/暂停）
   - 音量设置
   - 自动平衡音量设置
   - EQ均衡器设置
3. **无感切换**：用户在设备间切换时，应用状态自动恢复

### 使用条件

1. **设备要求**：
   - 双端设备均为HarmonyOS 6.0.0及以上版本
   - 双端设备登录同一华为账号
   - 双端设备打开WLAN和蓝牙开关
   - 双端设备在"设置 > 多设备协同 > 接续"中开启接续功能

2. **操作方式**：
   - 在源设备上打开应用并开始播放
   - 在目标设备的Dock栏或任务管理器中点击应用图标
   - 应用自动在目标设备恢复播放状态

### 技术实现

1. **配置文件**：
   - `module.json5`中设置`continuable: true`
   - 申请`ohos.permission.DISTRIBUTED_DATASYNC`权限

2. **数据保存**（`onContinue`回调）：
   ```typescript
   onContinue(wantParam: Record<string, Object>): AbilityConstant.OnContinueResult {
     // 保存播放状态、音量设置、EQ设置等
     wantParam['currentSongIndex'] = currentSongIndex;
     wantParam['isPlaying'] = isPlaying;
     wantParam['currentVolume'] = currentVolume;
     // ... 更多数据
     return AbilityConstant.OnContinueResult.AGREE;
   }
   ```

3. **数据恢复**（`onCreate`/`onNewWant`回调）：
   ```typescript
   if (launchParam.launchReason === AbilityConstant.LaunchReason.CONTINUATION) {
     // 从want.parameters中恢复数据
     this.restoreContinueData(want);
   }
   ```

### 开发注意事项

- 数据大小限制：通过wantParam传输的数据需控制在100KB以下
- 生命周期：`onCreate`用于冷启动，`onNewWant`用于热启动
- 状态管理：使用AppStorage实现跨组件数据同步
- 错误处理：在onContinue中返回REJECT可拒绝迁移

## 多端部署支持

本项目支持HarmonyOS多端部署能力，可在以下设备类型上运行：

- **手机 (Phone)** - 完整功能支持
- **平板 (Tablet)** - 完整功能支持，适配大屏显示
- **智慧屏 (TV)** - 完整功能支持，适配电视界面
- **车机 (Car)** - 完整功能支持，适配车载场景
- **智能穿戴 (Wearable)** - 基础功能支持，适配小屏显示

### 适配特性

1. **响应式布局**：使用`DeviceUtils`工具类实现自适应布局，根据设备屏幕尺寸自动调整UI元素大小和间距
2. **统一API接口**：使用HarmonyOS统一API，确保在不同设备上功能一致性
3. **设备能力检测**：自动检测设备音频能力，适配不同设备的音频系统
4. **触摸交互优化**：针对不同设备类型优化触摸交互体验

### 开发注意事项

- 使用`@Entry`和`@Component`装饰器确保组件在不同设备上的兼容性
- 通过`module.json5`中的`deviceTypes`字段声明支持的设备类型
- 使用ArkUI自适应布局能力，确保UI在不同屏幕尺寸下的良好显示
- 针对不同设备类型测试音频API的兼容性

## 约束与限制

1. 本示例支持在以下HarmonyOS设备上运行：
   - 手机 (Phone)
   - 平板 (Tablet)
   - 智慧屏 (TV)
   - 车机 (Car)
   - 智能穿戴 (Wearable)

2. HarmonyOS系统：HarmonyOS 6.0.0 Release及以上。

3. DevEco Studio版本：DevEco Studio 6.0.0 Release及以上。

4. HarmonyOS SDK版本：HarmonyOS 6.0.0 Release SDK及以上。

5. 音频API支持：
   - 不同设备类型的音频能力可能有所差异
   - 某些高级音频功能在穿戴设备上可能受限
   - 建议在实际设备上测试音频播放和音量控制功能

## 贡献

欢迎提交Issue和Pull Request来改进本项目。

## 许可证

本项目基于Apache License 2.0许可证开源。