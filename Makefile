test:
	echo "Hi bro"
build-go:
	echo "-----[Building Go-gin server...]-----"
	sudo service goweb stop
	cd server/apisrv && go build main.go
	sudo systemctl daemon-reload
	sudo service goweb start
migrate-up:
	echo "-----[Migrations UP...]-----"
	cd server/lib && migrate -database $DATABASE_URL -path migrate/migrations up