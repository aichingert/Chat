#!/bin/sh

update_and_leave() {
	cd $1 && npm i
	cd ..
}

echo "Installing: "
if test ! -d "chat-frontend/node_modules" ; then
	update_and_leave "chat-frontend/"
fi
echo "* frontend - done"

if test ! -d "chat-server/node_modules" ; then
	update_and_leave "chat-server/"
fi
echo "* server - done"

if test ! -d "db/node_modules" ; then
	update_and_leave "db/"
fi
echo "* db/express - done"

echo "====================="
echo "Starting: "

cd "chat-frontend/" && nohup npm run dev > out &
cd "chat-server/" && nohup npm run start > out &

cd "db/" && sudo docker compose up -d
nohup npm run start > out &
