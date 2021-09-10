# co2-hackaton
*Ссылка на сайт: http://app.hamster-bot.ru*

Используется express.js, redis
Эндпоинты сделаны в соответствии с https://co2ding-2021.herokuapp.com/api-docs/, только ID начинаются не с 1, а с 0.
Помимо, был намек на панель админки, но не успел. Но зато есть эндпоинты на изменение/удаление/создание данных.

## `POST` /api/auth/login
Body: ```{
  "password": string
}```
Пароль устанавливается в .env `ADMIN_PASSWORD`

## `GET` /api/auth/logout
Необходимо быть авторизованным, редиректит на `/`

## `DELETE` /api/distribution/regions/:id

## `PATCH` /api/distribution/regions/:id
Body: ```{ "name": string }```

## `DELETE` /api/distribution/dataTypes/:id

## `PATCH` /api/distribution/dataTypes/:id
Body: ```{ "name": ?string, "units": ?string }```

## `DELETE` /api/distribution/summary
Body: ```{ "year": number, "region": number, "dataType": number, "month": number }```

## `PATCH` /api/distribution/summary
Body: ```{ "year": number, "region": number, "dataType": number, "month": number, "value": number }```

## `POST` /api/distribution/summary
Body: ```{ "year": number, "region": number, "dataType": number, "month": number, "value": number }```




