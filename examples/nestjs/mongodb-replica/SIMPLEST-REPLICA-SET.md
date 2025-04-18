## Изменение файла hosts на macOS и Windows

### Изменение файла hosts на macOS

#### 1. Открыть Терминал
Нажмите `Cmd + Space`, введите **Terminal**, нажмите `Enter`.

#### 2. Открыть файл hosts
Выполните команду:
```sh
sudo nano /etc/hosts
```
Введите пароль администратора при запросе.

#### 3. Редактирование файла
Используйте стрелки для навигации и добавьте/измените записи.

Пример для привязки `mongo1`, `mongo2`, `mongo3` к `localhost`:
```sh
127.0.0.1   mongo1
127.0.0.1   mongo2
127.0.0.1   mongo3
```

#### 4. Сохранение и выход
- Нажмите `Ctrl + X`, чтобы выйти.
- Нажмите `Y`, чтобы подтвердить изменения.
- Нажмите `Enter`, чтобы сохранить файл.

### Изменение файла hosts на Windows

#### 1. Открыть Блокнот от имени администратора
- Нажмите `Win + S`, введите **Блокнот**, нажмите `Правой кнопкой мыши → Запуск от имени администратора`.

#### 2. Открыть файл hosts
- В Блокноте нажмите `Файл → Открыть`.
- Перейдите в `C:\Windows\System32\drivers\etc`.
- Выберите `hosts` (если его не видно, выберите "Все файлы" в фильтре).

#### 3. Редактирование файла
Добавьте/измените записи:
```sh
127.0.0.1   mongo1
127.0.0.1   mongo2
127.0.0.1   mongo3
```

#### 4. Сохранение и выход
- Нажмите `Ctrl + S`, чтобы сохранить файл.
- Закройте Блокнот.



## Создание ключа авторизации для всех реплик

Откройте bash терминал в винде или дефолтный терминал на macos в папке проекта

```bash
openssl rand -base64 756 > mongo-keyfile
```

## Создание Docker файла

Положите в корень папки проекта файл с названием Dockerfile (без расширений)

```dockerfile
# Use the official MongoDB image
FROM mongo:7

# Copy key file into the container
COPY mongo-keyfile /data/mongo-keyfile

# Set correct permissions for the key file
RUN chmod 600 /data/mongo-keyfile && chown mongodb:mongodb /data/mongo-keyfile
```

## Создание Docker Compose файла

Положите в корень папки проекта файл с названием docker-compose.yml 

```yaml
x-mongo-base: &mongo-base
  build: .
  networks:
    - mongo-cluster
  environment:
    MONGO_INITDB_ROOT_USERNAME: root
    MONGO_INITDB_ROOT_PASSWORD: example

services:
  mongo1:
    <<: *mongo-base
    container_name: mongo1
    ports:
      - 27017:27017
    command: ["mongod", "--replSet", "rs0", "--port", "27017", "--bind_ip_all", "--keyFile", "/data/mongo-keyfile"]

  mongo2:
    <<: *mongo-base
    container_name: mongo2
    ports:
      - 27018:27018
    command: ["mongod", "--replSet", "rs0", "--port", "27018", "--bind_ip_all", "--keyFile", "/data/mongo-keyfile"]

  mongo3:
    <<: *mongo-base
    container_name: mongo3
    ports:
      - 27019:27019
    command: ["mongod", "--replSet", "rs0", "--port", "27019", "--bind_ip_all", "--keyFile", "/data/mongo-keyfile"]
networks:
  mongo-cluster:
    driver: bridge
```

## Запуск узлов

```bash
   docker compose up -d
```

Откройте docker desktop и проверьте, что всё запустилось

## Инициализация кластера

```bash
docker exec -it mongo1 mongosh -u root -p example --eval 'rs.initiate({_id: "rs0", members: [{ _id: 0, host: "mongo1:27017" }, { _id: 1, host: "mongo2:27018" }, { _id: 2, host: "mongo3:27019" }]})'
```

Проверим что всё хорошо (должны в массиве JSON увидеть все 3 реплики):
```bash
docker exec -it mongo1 mongosh --username root --password example --authenticationDatabase admin --eval "rs.status()"
```

## Строка подключения

В приложении используйте данную строку подключения
```typescript
const connectionString = 'mongodb://root:example@localhost:27017,localhost:27018,localhost:27019/nest?retryWrites=true&loadBalanced=false&replicaSet=rs0&authSource=admin&readPreference=primary'
```