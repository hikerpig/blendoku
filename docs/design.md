# Blendoku

彩读

就这个游戏而言似乎不用svg库，但是最好框架搭好了以后尝试更复杂的grid based game

### GameController (Blendoku)
需要和其他层连接的部分, GameController

### 游戏逻辑
主要的工作应该还是在这里, 定义一个游戏的数据结构以及算法, 考虑用 Typescript。

### 显示和动画层
处理显示好交互
- Snap.svg

### 数据层

请求不多，异步事件也不多
- action 在操作store的时候如何影响 game ?

### 数据

- class Vunit  可绘的基类
    - gx, gy     grid x/y
    - size
- class Board 画板
- class Block 格子
    - 当前颜色
    - 真正颜

## RoadMap

- Mobx

## TODO

- IRiddleDef 中定义好初始提示的色块位置
