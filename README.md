<div align="center">
  <img src="logo.jpg" width=256></img>
  <p><strong>Dogger - A fast and simple Docker Web UI</strong></p>
  
  English | [简体中文](README.ZH-CN.md)
  
</div>

Crane is a simple and fast Docker Web UI written in `Rust` and `React`, designed to view and manage your `Container` and `Images` through a Web UI.
## Features

1. **Fast**: Uses Rust as the backend and React as the frontend, Docker image is only.


![screenshot](/screenshot/1.png)

## Installation Instructions

1. Using Docker

```bash
docker run -p 8595:8595 wangyucode/dogger:0.1.0
```

2. Using docker-compose

```yaml
services:
  crane:
    image: wangyucode/dogger:0.1.0
    ports:
      - 8594:8594
```

## Roadmap

- [ ] Display running containers
