# マインクラフトで使用する DiscordBot

## 使い方

### 前提条件

#### 必要なツール

- [Git](https://git-scm.com/downloads)
- [Docker](https://docs.docker.com/engine/installation/)
- [node](https://nodejs.org/ja/)

#### 必要なコマンド

```sh
# 必要なツールが導入されているかの確認
## Docker
which docker
## make
which make
## node
which node
```

### Makefile

| Name   | Description                 |
| ------ | --------------------------- |
| build  | docker compose build        |
| up     | docker compose up -d        |
| down   | docker compose down         |
| buildx | docker build for Repository |
| pushx  | docker push for Repository  |

### Git Cloneしてから
1. npm install
2. envファイルを用意
	```sh
	cp .env.sample .env
	cp docker.env.sample docker.env
	```
	
3. envファイルに環境変数を記述
	- H4の環境変数を参照
4. Dockerの環境をビルドし立ち上げる
	```sh
	make build
	make up
	```

#### 環境変数

|   ファイル名   |   key   |    用途  |
| ---- | ---- | :--- |
| .env | REPOSITORY | Dockerレポジトリで使用するイメージ名 |
| docker.env | TOKEN | DiscordBotのトークン |
|      | AWS_ACCESS_KEY_ID | AWSのアクセスキーID |
| | AWS_SECRET_ACCESS_KEY | AWSのシークレットアクセスキー |
| | INSTANCE_ID | EC2インスタンスのID |
|  | STOP_COMMAND | EC2インスタンスの停止時にSSM経由で実行させるコマンド |
| | PORT | Expressで使用するポート |

