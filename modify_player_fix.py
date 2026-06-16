#!/usr/bin/env python3
# -*- coding: utf-8 -*-

def fix_player_file():
    # 读取文件
    with open('entry/src/main/ets/pages/Player.ets', 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # 找到EQ Settings部分开始
    eq_start = -1
    for i, line in enumerate(lines):
        if '// EQ Settings' in line and i+1 < len(lines) and 'Column()' in lines[i+1]:
            eq_start = i
            break
    
    if eq_start == -1:
        print("未找到EQ Settings部分")
        return False
    
    # 找到EQ部分的结束（找到包含'.width('100%')'的行）
    eq_end = -1
    for i in range(eq_start, len(lines)):
        if ".width('100%')" in lines[i] and lines[i].strip().startswith('.'):
            # 检查下一行是否以'}'开头
            if i+1 < len(lines) and lines[i+1].strip().startswith('}'):
                eq_end = i+1
            else:
                eq_end = i
            break
    
    if eq_end == -1:
        print("未找到EQ部分结束")
        return False
    
    print(f"EQ部分: 第{eq_start+1}行到第{eq_end+1}行")
    
    # 构建新的EQ部分
    new_eq_section = '''      // EQ Settings
      Column() {
        // EQ Settings Button
        Button('EQ Settings', { type: ButtonType.Normal })
          .width('100%')
          .height(48)
          .backgroundColor('#F0F7FF')
          .fontColor('#0A59F7')
          .onClick(() => {
            // Navigate to EQ page
            router.pushUrl({
              url: 'pages/EQPage'
            })
          })
          .margin({ bottom: 12 })
      }
      .padding({ left: 16, right: 16 })
      .width('100%')
'''
    
    # 替换整个EQ部分
    lines[eq_start:eq_end+1] = [new_eq_section]
    
    # 写回文件
    with open('entry/src/main/ets/pages/Player.ets', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    
    print("成功修复Player.ets文件")
    return True

if __name__ == '__main__':
    fix_player_file()