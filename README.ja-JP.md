<div align="center"> <a href="https://github.com/anncwb/vue-vben-admin"> <img alt="VbenAdmin Logo" width="215" src="https://unpkg.com/@vbenjs/static-source@0.1.7/source/logo-v1.webp"> </a> <br> <br>

[![license](https://img.shields.io/github/license/anncwb/vue-vben-admin.svg)](LICENSE)

<h1>Vue Vben Admin</h1>
</div>

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=vbenjs_vue-vben-admin&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=vbenjs_vue-vben-admin) ![codeql](https://github.com/vbenjs/vue-vben-admin/actions/workflows/codeql.yml/badge.svg) ![build](https://github.com/vbenjs/vue-vben-admin/actions/workflows/build.yml/badge.svg) ![ci](https://github.com/vbenjs/vue-vben-admin/actions/workflows/ci.yml/badge.svg) ![deploy](https://github.com/vbenjs/vue-vben-admin/actions/workflows/deploy.yml/badge.svg)

**日本語** | [English](./README.md) | [中文](./README.zh-CN.md)

## 紹介

Vue Vben Adminは、最新の`vue3`、`vite`、`TypeScript`などの主流技術を使用して開発された、無料でオープンソースの中・後端テンプレートです。すぐに使える中・後端のフロントエンドソリューションとして、学習の参考にもなります。

## アップグレード通知

これは最新バージョン5.0であり、以前のバージョンとは互換性がありません。新しいプロジェクトを開始する場合は、最新バージョンを使用することをお勧めします。古いバージョンを表示したい場合は、[v2ブランチ](https://github.com/vbenjs/vue-vben-admin/tree/v2)を使用してください。

## 特徴

- **最新技術スタック**: Vue 3やViteなどの最先端フロントエンド技術で開発
- **TypeScript**: アプリケーション規模のJavaScriptのための言語
- **テーマ**: 複数のテーマカラーが利用可能で、カスタマイズオプションも豊富
- **国際化**: 完全な内蔵国際化サポート
- **権限管理**: 動的ルートベースの権限生成ソリューションを内蔵

## プレビュー

- [Vben Admin](https://vben.pro/) - フルバージョンの中国語サイト

テストアカウント: vben/123456

<p align="center">
    <img alt="VbenAdmin Logo" width="100%" src="https://anncwb.github.io/anncwb/images/preview1.png">
    <img alt="VbenAdmin Logo" width="100%" src="https://anncwb.github.io/anncwb/images/preview2.png">
    <img alt="VbenAdmin Logo" width="100%" src="https://anncwb.github.io/anncwb/images/preview3.png">
</p>

### Gitpodを使用

Gitpod（GitHub用の無料オンライン開発環境）でプロジェクトを開き、すぐにコーディングを開始します。

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/vbenjs/vue-vben-admin)

## ドキュメント

[ドキュメント](https://doc.vben.pro/)

## インストールと使用

- プロジェクトコードを取得

```bash
git clone https://github.com/vbenjs/vue-vben-admin.git
```

- 依存関係のインストール

```bash
cd vue-vben-admin

corepack enable

pnpm install

```

- 実行

```bash
pnpm dev
```

- ビルド

```bash
pnpm build
```

## 変更ログ

[CHANGELOG](https://github.com/vbenjs/vue-vben-admin/releases)

## 貢献方法

ご参加をお待ちしております！[Issueを提出](https://github.com/anncwb/vue-vben-admin/issues/new/choose)するか、Pull Requestを送信してください。

**Pull Request:**

1. コードをフォーク！
2. 自分のブランチを作成: `git checkout -b feat/xxxx`
3. 変更をコミット: `git commit -am 'feat(function): add xxxxx'`
4. ブランチをプッシュ: `git push origin feat/xxxx`
5. `pull request`を送信

## Git貢献提出規則

- 参考 [vue](https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md) 規則 ([Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular))

  - `feat` 新機能の追加
  - `fix` 問題/バグの修正
  - `style` コードスタイルに関連し、実行結果に影響しない
  - `perf` 最適化/パフォーマンス向上
  - `refactor` リファクタリング
  - `revert` 変更の取り消し
  - `test` テスト関連
  - `docs` ドキュメント/注釈
  - `chore` 依存関係の更新/スキャフォールディング設定の変更など
  - `ci` 継続的インテグレーション
  - `types` 型定義ファイルの変更
  - `wip` 開発中

## ブラウザサポート

ローカル開発には`Chrome 80+`ブラウザを推奨します

モダンブラウザをサポートし、IEはサポートしません

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| :-: | :-: | :-: | :-: | :-: |
| サポートしない | 最新2バージョン | 最新2バージョン | 最新2バージョン | 最新2バージョン |

## メンテナー

[@Vben](https://github.com/anncwb)

## スター歴史

[![Star History Chart](https://api.star-history.com/svg?repos=vbenjs/vue-vben-admin&type=Date)](https://star-history.com/#vbenjs/vue-vben-admin&Date)

## 寄付

このプロジェクトが役に立つと思われた場合、作者にコーヒーを一杯おごってサポートを示すことができます！

![donate](https://unpkg.com/@vbenjs/static-source@0.1.7/source/sponsor.png)

<a style="display: block;width: 100px;height: 50px;line-height: 50px; color: #fff;text-align: center; background: #408aed;border-radius: 4px;" href="https://www.paypal.com/paypalme/cvvben">Paypal Me</a>

## 貢献者

<a href="https://github.com/vbenjs/vue-vben-admin/graphs/contributors">
 <img alt="Contributors"
        src="https://opencollective.com/vbenjs/contributors.svg?button=false" />
</a>

## Discord

- [Github Discussions](https://github.com/anncwb/vue-vben-admin/discussions)

## ライセンス

[MIT © Vben-2020](./LICENSE)
