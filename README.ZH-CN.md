<div align="center">
  <img src="logo.jpg" width=256></img>
  <p><strong>Dogger - 快速简单的Docker Web UI</strong></p>
  
  [English](README.md) | 简体中文
  
</div>

Crane 是一个使用`Rust`和`React`编写的简单、快速Docker Web UI，旨在通过一个Web UI查看，管理你的`Container` 和 `Images`。
## 功能特点

1. **快速**: 使用Rust作为后端，React作为前端，Docker镜像仅。


![screenshot](/screenshot/1.png)

## 安装说明

1. 使用 Docker

```bash
docker run -p 8595:8595 wangyucode/dogger:0.1.0
```

2. 使用 docker-compose

```yaml
services:
  crane:
    image: wangyucode/dogger:0.1.0
    ports:
      - 8594:8594
```

## 路线图

- [ ] 显示正在运行的容器

