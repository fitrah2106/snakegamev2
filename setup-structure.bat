@echo off
REM ========== SETUP STRUKTUR PROJECT SNAKE GAME ==========

echo Membuat folder prisma dan file schema.prisma
mkdir prisma
type nul > prisma\schema.prisma

echo Membuat folder public
mkdir public

echo Membuat folder src
mkdir src

cd src

REM ===== App Router =====
mkdir app
cd app
type nul > layout.tsx
type nul > page.tsx

echo Membuat folder dashboard dan komponen dalamnya
mkdir dashboard
cd dashboard
type nul > page.tsx
mkdir components
cd components
type nul > SnakeGame.tsx
type nul > ScoreReport.tsx
cd ..
cd ..

REM ===== API Routes =====
mkdir api
cd api

mkdir login
cd login
type nul > route.ts
cd ..

mkdir register
cd register
type nul > route.ts
cd ..

mkdir save-game
cd save-game
type nul > route.ts
cd ..
cd ..
cd ..

REM ===== Komponen Umum =====
mkdir components
cd components
type nul > Header.tsx
type nul > Hero.tsx
type nul > Footer.tsx
cd ..

REM ===== Prisma Client =====
mkdir lib
cd lib
type nul > prisma.ts
cd ..

REM ===== Global CSS =====
mkdir styles
cd styles
type nul > globals.css
cd ..

REM ===== Typescript Types =====
mkdir types
cd types
type nul > index.ts
cd ..
cd ..

echo Struktur proyek berhasil dibuat!
pause
