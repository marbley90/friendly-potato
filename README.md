# Friendly Potato API

This API is a simple geo-tracking service

The Swagger documentation can be found under the path /api or if you want to download the JSON file navigate to /api-json  

Below is the JSON Schema Validation called "geo" that is used for the implementation of the current API
```
{
   $jsonSchema: {
      bsonType: 'object',
      properties: {
		  driver: {
				bsonType: "string",
				description: "must be a string"
			 },
		  location: {
				bsonType: "string",
				description: "must be a string"
			 },
		  coordinates: {
			  bsonType: ["array"],
              maxItems: 2,
			  items: {
				bsonType: "number",
			  }
		  },
		  timestamp: {
			  bsonType: "int"
		  }
      }
   }
}
```
### Instructions before you launch the API
* Rename dotenv.txt file to .env
* Fill DATABASE_NAME, DATABASE_URL, REDIS_PORT in .env file
* Use the ACCESS_TOKEN to the requests you are going to perform (see .env file)
* Fill with the appropriate name of containers for database (see YOUR_MONGO_NAME) and redis (see YOUR_REDIS_NAME) in docker-compose.yml

```
# Commands to define and run docker containers
docker compose build
docker compose up
```

