# Supabase Web App Setup

このアプリは、Supabase設定を入れると `My Profile`、`Interested Companies`、`Application Timeline`、手動追加イベント/ソースを同じGoogleアカウントで同期できます。

## 1. Supabaseプロジェクトを作成

1. Supabaseで新規プロジェクトを作成
2. `SQL Editor` を開く
3. `sql/supabase_schema.sql` の内容を実行

このSQLは `user_job_research_profiles` テーブルを作り、ログイン中の本人だけが自分のデータを読める/書けるRLSを設定します。

## 2. Googleログインを有効化

Supabase Dashboardで以下を設定します。

- `Authentication` → `Providers` → `Google` を有効化
- Google Cloud ConsoleでOAuth Clientを作成
- SupabaseのGoogle providerにClient ID / Client Secretを設定

GitHub PagesのURLは、Supabaseの `Authentication` → `URL Configuration` に登録します。

- Site URL: `https://qzzwatame-dot.github.io/job-research-map/visualizer/`
- Redirect URLs: `https://qzzwatame-dot.github.io/job-research-map/visualizer/`
- Redirect URLs: `https://qzzwatame-dot.github.io/job-research-map/planner/`

## 3. アプリにSupabase情報を入れる

`visualizer/supabase-config.js` を編集します。

```js
window.JOB_RESEARCH_SUPABASE = {
  url: "https://xxxxxxxxxxxx.supabase.co",
  anonKey: "public-anon-key",
};
```

`anonKey` は公開フロントエンドで使う前提のキーです。サービスロールキーは絶対に入れないでください。

## 4. 動作確認

1. GitHub Pagesを開く
2. `My Profile` → `Cloud Sync`
3. `Googleログイン`
4. プロフィールや志望リストを変更
5. スマホ/PCで同じGoogleアカウントで開き、同期されているか確認

未ログイン時は従来通りブラウザ内保存だけで動きます。
