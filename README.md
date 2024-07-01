
# SwitchBot example app on Fitbit Versa 4 

このrepositoryは、Fitbit OS ([Versa 4](https://www.fitbit.com/global/jp/products/smartwatches/versa4))向けのサンプルアプリを格納しています。

2024年7月時点では、Versa 4のSDKやEmulatorの準備が整っていないようでしたので、[Unofficialの対応(@fitbit/sdk-build-targets)](https://github.com/cmengler/fitbit-app-versa4)を参考にVersa 4用のアプリを実装しました。


## アプリの概要

SwitchBotのHub2を使った赤外線機器の調整アプリです。
対象とする赤外線機器は、筆者の自宅にあるリモコン制御機能付きの「扇風機」です。

## 使い方

0. 開発者向けのFitbit アカウントの作成（スマホアプリに「開発者向けメニュー」が表示されるようになる）
1. npm install にて必要パッケージのインストール
2. スマホのFitbitアプリで「開発者向けメニュー」から「開発者用ブリッジ接続」をOnにする
3. Fitbit Versa 4を電源に接続(設定の「開発者用ブリッジ」のUSBデバッグを有効にする必要があるのかどうか不明)
4. 環境変数の設定（**export FITBIT_QA_COMMANDS=1**）
5. npx fitbitでシェル起動
6. fitbitシェルで biを実行 (build & install)


[Unofficial Versa 4対応](https://github.com/cmengler/fitbit-app-versa4)の一部として、上記4で記載している環境変数の設定が必要らしい。

```shell
export FITBIT_QA_COMMANDS=1
```


## 仕組み

SwitchBotのWeb APIを使って、赤外線機器を制御します。
Web APIは以下で公開されているものを使っています。

* [Command set for virtual infrared remote devices](https://github.com/OpenWonderLabs/SwitchBotAPI?tab=readme-ov-file#command-set-for-virtual-infrared-remote-devices)


## config について

SwitchBotのWeb APIを呼び出すアプリとなっています。

そのため、token, secretというデータをSwitchBotアプリから取り出す必要があります。token, secretの取り出し方は、[SwitchBot Web API の使い方ページ](https://github.com/OpenWonderLabs/SwitchBotAPI?tab=readme-ov-file#how-to-sign)にあります。

それらを common/config-sample.jsに記載する。

また、デバイスIDは固定にしてあります。common/config-sample.jsのdeviceIdに記載します。

common/config-sample.jsは、設定後config.jsに名前を変えて実行します。


## Emulatorでの実行について

2024年7月現在、EmulatorでVersa 4が動作しないようなので、以下の方法でEmulatorと本物のデバイスの切り替えを行います。

1. package.jsonを package.json_versa4などに退避
2. package.json_emuを package.jsonに名前変更
3. npm install
4. npx fitbitの bi を実行してemulatorにインストール

## リンク
* [Fitbit SDK](https://dev.fitbit.com/build/guides/)
* [SwitchBot Web API](https://github.com/OpenWonderLabs/SwitchBotAPI)
* [Unofficial approach to sideload app on Versa 4](https://community.fitbit.com/t5/SDK-Development/Unofficial-approach-to-sideload-app-on-Versa-4/m-p/5338575)