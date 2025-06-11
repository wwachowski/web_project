# web_project

PUT webowka projekt tournamenty - GalaZaGałe

============================================
-----------------TECH STACK-----------------
============================================
Angular + Nodejs (Express + Prisma ORM) + PostgreSQL

============================================
--------------KOMENDY FRONTEND--------------
============================================

### Instalacja

nvm install 22.16.0
npx ng new frontend --directory ./
(SCSS + No SSR + Standalone)

### Uruchomienie

nvm use 22.16.0
npx ng version -0

============================================
--------------KOMENDY BACKEND---------------
============================================

### Instalacja

npm install typescript ts-node-dev @types/node --save-dev
npx tsc --init
npm install express prisma @prisma/client
npx prisma init
npm install bcryptjs jsonwebtoken dotenv
npm install @types/express @types/bcryptjs @types/jsonwebtoken --save-dev

### Uruchomienie

npx prisma generate
npm run dev (ts-node-dev src/index.ts)

============================================
----------------POSTGRESQL------------------
============================================

### Konfiguracja

Postgres 16
Jesli chcemy zmienic haslo: services.msc - zatrzymujemy usluge postgresql.
Edytujemy pg_hba.conf w C:\Program Files\PostgreSQL\16\data
host all all 127.0.0.1/32 trust
ustawiamy na trust - mozna sie logowac bez hasla

Dane shcematu w schema.sql

============================================
-------------------RESZTA-------------------
============================================

Wysyłka email dzieki https://mailtrap.io/
Testowanie backendu - postman
