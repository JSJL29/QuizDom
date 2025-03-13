@echo off

start cmd /k "cd backend && nodemon backend"

start cmd /k "code . && cd frontend && npm run dev"

start http://localhost:5173/

exit
