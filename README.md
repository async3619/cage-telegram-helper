<h1 align="center">
  <br />
  🦜
  <br />
  Cage Telegram Helper
  <sup>
    <br />
    <br />
  </sup>    
</h1>

<div align="center">
    <a href="https://registry.hub.docker.com/r/async3619/cage-telegram-helper">
        <img alt="Docker Image Version (latest by date)" src="https://img.shields.io/docker/v/async3619/cage-telegram-helper?label=docker&style=flat-square">
    </a>
    <a href="https://github.com/async3619/cage-telegram-helper/blob/main/LICENSE">
        <img src="https://img.shields.io/github/license/async3619/cage-telegram-helper.svg?style=flat-square" alt="MIT License" />
    </a>
    <br />
    <sup>notification message relay server for <a href="https://github.com/async3619/cage">Cage</a></sup>
    <br />
    <br />
</div>

## Introduction

This is Telegram notification message relaying server for [Cage](https://github.com/async3619/cage) project. this will relay notification messages from your Cage instance to Telegram Bot to send message to your telegram account.

In most cases, you will not need this since Cage already provides hosted version of this server out of the box. but if you want to use Telegram notification with your own Telegram Bot, you will need this.

## Usage

Firstly, you should create your own telegram bot. you can follow [this guide](https://core.telegram.org/bots/features#botfather) to create your own bot. after you created your bot, you will get a token for your bot. you will need this token to configure this server.

```bash
docker run -d --name cage-telegram-helper \
    -e TELEGRAM_BOT_TOKEN=<YOUR BOT TOKEN HERE> \
    -p 8080:3000 \
    async3619/cage-telegram-helper
```

or you can use docker-compose:

```yaml
version: "3.9"

services:
    cage-telegram-helper:
        image: async3619/cage-telegram-helper
        container_name: cage-telegram-helper
        environment:
            - TELEGRAM_BOT_TOKEN=<YOUR BOT TOKEN HERE>
        ports:
            - 8080:3000
```

once you started this server, your bot will be able to provide you a token that you can use to configure your Cage instance:

```bash

```text
You: /start

Bot: Now you can configure your cage instance with this token:
<YOUR CAGE-TELEGRAM TOKEN HERE>
```

then you should configure your Cage instance to use this server. you can do this by adding `url` property to your `config.json` file:

```json5
{
    // ...
    "notifiers": {
        "telegram": {
            "type": "telegram",
            "url": "http://localhost:8080",
            "token": "<YOUR CAGE-TELEGRAM TOKEN HERE>"
        }
    },
    // ...
}
```
now you all set. you can start to use your Cage instance with Telegram notification.
