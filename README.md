# Shut-Your-Mouth-TG-App

Shut-Your-Mouth-TG-App is an application designed to prevent you from speaking in Telegram groups. If you attempt to send a message in the group, your message will be automatically deleted. As the saying goes, "Distance makes the heart grow fonder." When you speak too often in a group, you may inadvertently get too close to others, revealing both your strengths and weaknesses. This may lead people to dislike or even detest you. For those who are not psychologically strong, this app can be a helpful tool to prevent unwanted conversations in groups.

In a way, this app is quite extreme in its approach.

## Features

Currently, the app has two modes:

- **FULL_DELETE_MODE**: Deletes all messages you send in the group. Once you send a message, it will be deleted.
- **TEXT_ONLY_DELETE_MODE**: Deletes only pure text messages you send. Other types of messages, such as media or files, will not be deleted.

Additionally, you can control the speed of message deletion in seconds. For example, setting it to `0` will delete your message immediately, while setting it to `10` will delete it 10 seconds after sending. This can be configured in the deployment tutorial below.

## Deployment Guide

### Prerequisites

1. You will need a server with **Docker** installed.
2. Register a Telegram application on [https://my.telegram.org/](https://my.telegram.org/) to obtain your `app_id` and `app_hash`.

Our guide is based on deploying the app using Docker.

### Step 1: Initial Setup

1. Download the `docker-compose.yml` file and upload it to your server.
2. Configure the file by entering your `app_id`, `app_hash`, and preferred delete mode.
3. Navigate to the directory where the `docker-compose.yml` file is located and run the following command to initiate the login process:

```bash
docker compose run -it --rm shut-your-mouth-tg-app
```
You will be prompted to enter your phone number and the verification code. Once completed, the bot will output some information about your Telegram account, indicating a successful login.

4. Exit the application once you’re logged in. If exiting fails, you can manually stop the running container by using the following command:
```
docker ps -a
docker stop xxx && docker rm xxx
```
This step only needs to be done once for the login process. After logging in, all configurations are saved in the /config directory.

### Step 2: Running the Application

After completing the setup:

1. Run the following command to start the application in the background:

```bash
docker compose up -d
```