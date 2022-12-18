test:
	echo "Hi bro"
build-go-temp:
	echo "-----[Building Go-gin server...]-----"
	sudo service goweb stop
	cd server/apisrv && go build main.go
	sudo systemctl daemon-reload
	sudo service goweb start
build-go:
	echo "-----[Building Go-gin server...]-----"
	cd server && go mod download
	cd server && go mod tidy -go=1.16 && go mod tidy -go=1.17
migrate-up:
	echo "-----[Migrations UP...]-----"
	cd server/lib && migrate -database $$DATABASE_URL -path migrate/migrations up
migrate-down:
	echo "-----[Migrations UP...]-----"
	cd server/lib && migrate -database $$DATABASE_URL -path migrate/migrations down



wtf:
	echo $$DATABASE_URL

# migrate create -ext sql -dir lib/migrate/migrations -seq create_test    