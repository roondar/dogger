<div align="center">
  <img src="logo.jpg" width=256></img>
  <p><strong>Dogger - A fast and simple Docker Web UI</strong></p>
  
  English | [简体中文](README.ZH-CN.md)
  
</div>

Crane is a simple and fast Docker Web UI written in `Rust` and `React`, designed to view and manage your `Containers` and `Images` through a Web UI.
## Features

1. **Fast**: Uses Rust as the backend and React as the frontend, Docker image is only 30MB. It runs with just 4MB of memory usage and almost zero CPU usage.

2. **Simple**: Currently able to display containers and images, and supports showing Docker version information.

![screenshot](/screenshot/1.png)

## Installation

1. Using Docker

```bash
docker run -d \
  -p 8594:8594 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  wangyucode/dogger:0.1.0
```

2. Using docker-compose

```yaml
services:
  dogger:
    image: wangyucode/dogger:0.1.0
    ports:
      - 8594:8594
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
```

## Roadmap

- [ ] Provide an external API to update containers, enabling automated updating/deployment of new image versions.

- [ ] Display more container information, including container logs.

- [ ] Add more Docker image and container management features.
