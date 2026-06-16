## EQ功能说明

### 功能特点
- **10段均衡器**：支持10个不同频段的精细调节
- **预设模式**：提供5种预设模式（Flat、Rock、Pop、Jazz、Classical）
- **自定义模式**：用户可手动调整每个频段
- **实时应用**：EQ设置变化时立即应用到正在播放的音频
- **智能算法**：采用加权平均算法，考虑正增益和负增益

### 频段范围
1. 32Hz - 超低频
2. 64Hz - 低频
3. 125Hz - 低频
4. 250Hz - 中低频
5. 500Hz - 中频
6. 1kHz - 中高频
7. 2kHz - 高频
8. 4kHz - 高频
9. 8kHz - 超高频
10. 16kHz - 极高频

### 技术架构

#### 1. 数据模型
- **EQ模式枚举** (`PlayerViewModel.ets`): 定义Flat、Rock、Pop、Jazz、Classical、Custom六种模式
- **EQ频段数组**: 10个频段的增益值数组，范围[-12, 12]dB
- **AppStorage存储**: EQ设置通过AppStorage全局管理，支持跨组件状态同步

#### 2. 用户界面
- **EQ页面** (`EQPage.ets`): 提供完整的EQ调节界面
- **预设选择器**: 6种预设模式选择
- **频段滑块**: 10个独立的滑块控件，支持精细调节
- **实时预览**: 显示EQ曲线变化
- **开关控制**: 全局EQ启用/禁用

#### 3. 音频处理
- **EQ算法** (`AudioRendererController.ets`): 加权平均算法计算总体增益
- **音量重应用**: EQ变化时重新应用当前音量
- **实时监听**: 使用`@Watch`装饰器监听EQ设置变化
- **状态同步**: 通过AppStorage实现组件间状态同步

#### 4. 状态管理
```typescript
// EQ状态定义
@StorageLink('eqEnabled') eqEnabled: boolean = CommonConstants.DEFAULT_EQ_ENABLED;
@StorageLink('eqMode') eqMode: number = CommonConstants.DEFAULT_EQ_MODE;
@StorageLink('eqBands') eqBands: number[] = CommonConstants.DEFAULT_EQ_PRESET;

// EQ变化监听
@Watch('eqEnabled') onEQEnabledChange() { /* ... */ }
@Watch('eqMode') onEQModeChange() { /* ... */ }
@Watch('eqBands') onEQBandsChange() { /* ... */ }
```

#### 5. EQ算法实现
```typescript
private applyEQ(volume: number, eqBands: number[]): number {
  // 计算加权平均值（考虑所有频段）
  let totalWeightedGain = 0;
  let totalWeight = 0;
  
  // 频率权重：低频和高频权重更高
  const frequencyWeights = [1.2, 1.2, 1.0, 1.0, 1.0, 1.0, 1.0, 1.2, 1.2, 1.2];
  
  for (let i = 0; i < eqBands.length; i++) {
    const gain = eqBands[i];
    const weight = frequencyWeights[i];
    totalWeightedGain += gain * weight;
    totalWeight += weight;
  }
  
  const averageGain = totalWeightedGain / totalWeight;
  const eqMultiplier = Math.pow(10, averageGain / 20); // dB转线性
  
  let finalVolume = volume * eqMultiplier;
  
  // 音量限制
  finalVolume = Math.max(0.1, Math.min(15, finalVolume));
  
  return finalVolume;
}
```

### 修复的问题
1. **EQ调节不生效**：修复了EQ算法只计算正增益的问题
2. **实时响应问题**：添加了EQ变化监听机制
3. **音量状态不一致**：确保`currentVolume`正确初始化和更新