openssl rand -base64 756 > mongo-keyfile

chmod 600 mongo-keyfile


docker exec -it mongo1 mongosh -u root -p example --eval 'rs.initiate({_id: "rs0", members: [{ _id: 0, host: "mongo1:27017" }, { _id: 1, host: "mongo2:27018" }, { _id: 2, host: "mongo3:27019" }]})'

https://chatgpt.com/c/66dfe989-81a0-8006-90e4-4155d41d7328



docker exec -it mongo1 mongosh -u root -p example --port 27017 --eval 'rs.status()'
docker exec -it mongo1 mongosh -u root -p example --eval 'db.adminCommand({ setDefaultRWConcern: 1, defaultWriteConcern: { w: "1" } })'
docker exec -it mongo1 mongosh -u root -p example --eval 'rs.addArb("mongo-arbiter:27020")'



config = rs.conf()
config.members[1].slaveDelay = 60
config.members[2].slaveDelay = 60
rs.reconfig(config)