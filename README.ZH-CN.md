<div align="center">
  <img src="logo.jpg" width=256></img>
  <p><strong>Dogger - 快速简单的Docker Web UI</strong></p>
  
  [English](README.md) | 简体中文
  
</div>

Crane 是一个使用`Rust`和`React`编写的简单、快速Docker Web UI，旨在通过一个Web UI查看，管理你的`Container` 和 `Images`。

## 功能特点

1. **快速**: 使用Rust作为后端，React作为前端，Docker镜像仅30MB，运行时仅占用4MB内存，CPU占用几乎为0。

2. **简洁**: 目前能够显示容器和镜像，并支持显示Docker版本信息。

![screenshot](/screenshot/1.png)

## 安装方法

1. 使用 Docker

```bash
docker run -d \
  -p 8594:8594 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  wangyucode/dogger:0.1.0
```

2. 使用 docker-compose

```yaml
services:
  dogger:
    image: wangyucode/dogger:0.1.0
    ports:
      - 8594:8594
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
```

## 路线图

- [ ] 提供一个外部API，通过API更新容器，从而自动化更新/部署新版本的镜像
- [ ] 显示更多容器信息，以及容器日志
- [ ] 添加更多Docker镜像和容器管理功能

