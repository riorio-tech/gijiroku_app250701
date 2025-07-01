#!/bin/bash

echo "🔧 エラー修正スクリプトを実行中..."

# Node.jsのバージョンを確認
echo "📋 Node.jsバージョン: $(node --version)"

# node_modulesを削除
echo "🗑️  node_modulesを削除中..."
rm -rf node_modules package-lock.json

# 依存関係を再インストール
echo "📦 依存関係を再インストール中..."
npm install

# 追加パッケージをインストール
echo "📦 追加パッケージをインストール中..."
npm install @types/node date-fns lucide-react react-dropzone

# 開発サーバーを起動
echo "🚀 開発サーバーを起動中..."
npm run dev 