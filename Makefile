test:
	echo "Hi bro"
build-go:
	echo "Building Go-gin server..."
	sudo service goweb stop
	sudo systemctl daemon-reload
	cd server/apisrv && go build main.go
	sudo service goweb start

all: test build-go