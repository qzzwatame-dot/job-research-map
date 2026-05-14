# 友達に共有する方法

この就活企業研究マップは、`visualizer/index.html` が `data/*.csv` を読み込む静的サイトです。個人の入力データは各ユーザーのブラウザ内 `localStorage` に保存されるため、公開しても作成者のMy ProfileやInterested Companiesは共有されません。

## おすすめ: GitHub Pages

1. このフォルダをGitHubリポジトリに入れる
2. GitHubの `Settings > Pages` で公開ブランチを選ぶ
3. 公開URLの `/visualizer/` を友達に共有する

例:

```text
https://ユーザー名.github.io/リポジトリ名/visualizer/
```

## Netlify / Vercel

リポジトリを連携して静的サイトとして公開できます。ビルドコマンドは不要です。公開ディレクトリはリポジトリルートにして、共有URLの `/visualizer/` を開きます。

## ローカルで渡す場合

ZIPで渡すだけだと、ブラウザの制限でCSVが読めない場合があります。友達のPCで以下を実行してもらうと安定します。

```bash
python3 -m http.server 8766
```

その後、以下を開きます。

```text
http://127.0.0.1:8766/visualizer/
```

## 共有前の注意

- `job_research.db` は開発用のSQLiteです。Web表示はCSVを読んでいるため、公開に必須ではありません。
- `data/target_companies_100.csv` には150社が入っていますが、ファイル名は互換性維持のためそのままです。
- 選考体験記リンクは、将来データ提供元を確保してから追加する前提です。
- 公開前に、企業URLが古くなっていないか定期的に確認してください。
