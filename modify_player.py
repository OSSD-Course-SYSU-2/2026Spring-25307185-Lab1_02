#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re

def modify_player_file():
    # 读取文件
    with open('entry/src/main/ets/pages/Player.ets', 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # 找到EQ Settings部分
    in_eq_section = False
    eq_start = -1
    eq_end = -1
    brace_count = 0
    
    for i, line in enumerate(lines):
        if '// EQ Settings' in line and 'Column()' in lines[i+1]:
            eq_start = i
            in_eq_section = True
            # 找到第一个{
            for j in range(i, len(lines)):
                if '{' in lines[j]:
                    brace_count += lines[j].count('{')
                    break
        
        if in_eq_section:
            # 计算大括号
            brace_count += line.count('{')
            brace_count -= line.count('}')
            
            # 如果大括号计数归零，说明EQ部分结束
            if brace_count == 0 and eq_start != -1:
                eq_end = j
                # 找到包含'.width('100%')'的行
                for k in range(j, len(lines)):
                    if ".width('100%')" in lines[k] and lines[k].strip().startswith('.'):
                        eq_end = k
                        break
                break
    
    if eq_start != -1 and eq_end != -1:
        print(f'找到EQ部分: 第{eq_start+1}行到第{eq_end+1}行')
        
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
        
        # 替换行
        lines[eq_start:eq_end+1] = [new_eq_section]
        
        # 写回文件
        with open('entry/src/main/ets/pages/Player.ets', 'w', encoding='utf-8') as f:
            f.writelines(lines)
        
        print('成功修改Player.ets文件')
        return True
    else:
        print('未找到EQ部分')
        return False

if __name__ == '__main__':
    modify_player_file()