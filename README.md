<div align="center">
  <img src="logo.jpg" width=256></img>
  <p><strong>Dogger - A fast and simple Docker Web UI</strong></p>
  
  English | [简体中文](README.ZH-CN.md)
  
</div>

Crane is a simple and fast Docker Web UI written in `Rust` and `React`, designed to view and manage your `Containers` and `Images` through a Web UI.
## Features

1. **Lightweight & Fast**: Uses Rust as the backend and React as the frontend, Docker image is only 30MB. It runs with just 4MB of memory usage and almost zero CPU usage.

2. **Simple**: Currently able to display containers with cpu/memory usage, and images, and supports showing Docker version information.

3. **Security**: use `DOGGER_KEY` as an environment variable to protect the service from unauthorized access. this is optional. if you don't set it, you will see a warning on the web page.

![screenshot](/screenshot/1.png)

## Installation

1. Using Docker

```bash
docker run -d \
  -p 8595:8595 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -e DOGGER_KEY=your-super-strong-dogger-key \
  wangyucode/dogger:0.2.1
```

2. Using docker-compose

```yaml
services:
  dogger:
    image: wangyucode/dogger:0.2.1
    ports:
      - 8595:8595
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      DOGGER_KEY: your-super-strong-dogger-key
```

## Roadmap

- [ ] Provide an external API to update containers, enabling automated updating/deployment of new image versions.

- [ ] Display more container information, including container logs.

- [ ] Add more Docker image and container management features.
