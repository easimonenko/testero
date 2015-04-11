# /users/login
Помечает пользователя, как вошедшего в систему. Если пользователя не нужно запоминать, то remember должен отсутствовать в запросе. Если status==1, то пользовтаель либо успешно зашёл, либо уже до этого был вошедшим. Поэтому этот url можно исопльзовать для проверки того, атворизован ли пользователь (при этом тело запроса можно оставить пустым).
### Запрос: 
`{ email, password, remember }`  
### Ответ:  
`{ status, msg }`

# /users/logout
Прекращает сессию пользователя. На данный момент status всегда 1.
### Ответ:  
`{ status, msg }`

# /users/signup
Регистрация обычного пользователя. Если status==1, то регистрация прошла успешно.
### Запрос: 
`{ email, password, passwordDuplicate}`  
### Ответ:  
`{ status, msg }`

# /users/addAdmin
Регистрация админа. Отличается от /users/signup тем, что самого первого админа может зарегистрировать любой, а вот следующих админов может добавлять только админ. Если status==1, то регистрация прошла успешно.
### Запрос: 
`{ email, password, passwordDuplicate}`
### Ответ:  
`{ status, msg }`

# /users/isAdminExists
Если status==0, то ещё нет пользователя с правами админа. Если status==1, то админ уже есть.
### Ответ:  
`{ status, msg }`