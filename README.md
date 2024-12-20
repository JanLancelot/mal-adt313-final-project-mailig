# Jan Lancelot P. Mailig || BSCS-3A

There's only one codebase for both user and admin. Admin routes and API endpoints are protected using access tokens and the user's role.

# Database Diagram
![image3](https://github.com/JanLancelot/mal-adt313-final-project-mailig/blob/main/DB%20Diagram.png?raw=true)
# API Endpoints

## Authentication

| **Method** | **URL** | **Payload** | **Headers** | **Description** |
| --- | --- | --- | --- | --- |
| POST | localhost/mal-project/register.php | { 
"username": "JanL", "password": "123", "firstName": "Jan", "lastName": "Mailig", "middleName": "P", "contactNo": "091212312", 
"role": "user" 
} | None | Registers a new user |
| POST | localhost/mal-project/login.php | { 
"username": "testuser", "password": "password123" 
} | None | Authenticates user and returns JWT |

## ANIME

| **Method** | **URL** | **Payload** | **Headers** | **Description** |
| --- | --- | --- | --- | --- |
| GET | localhost/mal-project/anime_operations.php | N/A | N/A | Get all anime |
| POST | localhost/mal-project/anime_operations.php | {
"title": "Fullmetal Alchemist: Brotherhood",
"genres": ["Animation", "Drama"],
"score": 9.1,
"synopsis": "Two brothers search for a Philosopher's Stone...",
"coverPhoto": "https://m.media-amazon.com/images/M/MV5BMzNiODA5NjYtYWExZS00OTc4LTg3N2ItYWYwYTUyYmM5MWViXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
"popularity": 98,
"releaseDate": "2009-04-05",
"number_of_episodes": 64,
"number_of_seasons": 1,
"status": "Finished Airing",
"date_created": "2024-01-26 12:00:00",
"date_updated": "2024-01-26 12:00:00",
"posterPath": "https://miro.medium.com/v2/resize:fit:1400/1*9IqR88lb9NRRVLNid4OBJw.jpeg"
} | Authorization (Admin JWT Token) | Adds an anime |
| PUT | localhost/mal-project/anime_operations.php | {
"id": 1,
"score": 8.6,
"number_of_episodes": 88,
"status": "Currently Airing",
"date_updated": "2024-01-26 14:30:00"
} | Authorization (Admin JWT Token) | Updates the anime |
| DELETE | localhost/mal-project/anime_operations.php | {
"id": 1
} | Authorization (Admin JWT Token) | Deletes anime by ID |

## CASTS

| **Method** | **URL** | **Payload** | **Headers** | **Description** |
| --- | --- | --- | --- | --- |
| GET | [localhost/mal-project/cast_operations.php](localhost/mal-project/cast_operations.php) | None | None | Gets all casts |
| GET | localhost/mal-project/cast_operations.php?anime_id=196 | None | Authorization (Admin JWT Token) | Gets casts by anime id |
| POST | [localhost/mal-project/cast_operations.php](localhost/mal-project/cast_operations.php) | {
"anime_id": 1,
"data": {
"name": "Jan Lancelot Mailig",
"character": "Liquid Lance",
"profile_path": "https://imageio.forbes.com/specials-images/imageserve/61804bce3ea8563e80e89209/Italy-G20-Summit/960x0.jpg?format=jpg&width=960"
}
} | Authorization (Admin JWT Token) | Posts a cast member to an anime |
| PUT | [localhost/mal-project/cast_operations.php](localhost/mal-project/cast_operations.php) | {
"id": 1,
"anime_id": 1,
"name": "Jonathan Lancelot Mailig",
"character": "Liquid Lance",
"profile_path": "https://imageio.forbes.com/specials-images/imageserve/61804bce3ea8563e80e89209/Italy-G20-Summit/960x0.jpg?format=jpg&width=960"
} | Authorization (Admin JWT Token) | Updates the cast member using PUT |
| DELETE | [localhost/mal-project/cast_operations.php](localhost/mal-project/cast_operations.php) | {
"anime_id": 1
} | Authorization (Admin JWT Token) | Delete casts by anime id |

## **CREW**

| **Method** | **URL** | **Payload** | **Headers** | **Description** |
| --- | --- | --- | --- | --- |
| GET | [localhost/mal-project/crew_operations.php](localhost/mal-project/cast_operations.php) | None | None | Gets all crew |
| GET | [localhost/mal-project/crew_operations.php?anime_id=](localhost/mal-project/crew_operations.php?anime_id=199)1 | None | None | Gets crew by anime id |
| POST | [localhost/mal-project/crew_operations.php](localhost/mal-project/cast_operations.php) | {
"anime_id": 1,
"data": {
"name": "Jan Lancelot P. Mailig",
"job": "Animator",
"profile_path": "https://imageio.forbes.com/specials-images/imageserve/61804bce3ea8563e80e89209/Italy-G20-Summit/960x0.jpg?format=jpg&width=960"
}
} | Authorization (Admin JWT Token) | Posts a crew member to an anime |
| PUT | [localhost/mal-project/crew_operations.php](localhost/mal-project/cast_operations.php) |  {
"id": 1,
"anime_id": 1,
"name": "Jonathan Mailig",
"job": "Director",
"profile_path": "https://imageio.forbes.com/specials-images/imageserve/61804bce3ea8563e80e89209/Italy-G20-Summit/960x0.jpg?format=jpg&width=960"
} | Authorization (Admin JWT Token) | Updates a crew member |
| DELETE | [localhost/mal-project/crew_operations.php](localhost/mal-project/cast_operations.php) | {
"anime_id":  1
} | Authorization (Admin JWT Token) | Deletes crew members by anime id |

## **Videos**

| **Method** | **URL** | **Payload** | **Headers** | **Description** |
| --- | --- | --- | --- | --- |
| GET | [localhost/mal-project/videos_operations.php](https://www.notion.so/localhost/mal-project/cast_operations.php) | None | None | Gets all videos |
| GET | [localhost/mal-project/videos_operations.php](https://www.notion.so/localhost/mal-project/cast_operations.php)?anime_id=198 | None | None | Gets videos by anime_id |
| POST | [localhost/mal-project/videos_operations.php](https://www.notion.so/localhost/mal-project/cast_operations.php) | {
"anime_id": 1,
"data": {
"name": "Despacito",
"key": "asdasadwzscwz"
}
} | Authorization (Admin JWT Token) | Posts video to an anime |
| PUT | [localhost/mal-project/videos_operations.php](https://www.notion.so/localhost/mal-project/cast_operations.php) | {
"id": 1,
"anime_id": 1,
"name": "Despacito 2",
"key": "sasd21axcq12as"
} | Authorization (Admin JWT Token) | Updates a video |
| DELETE | [localhost/mal-project/videos_operations.php](https://www.notion.so/localhost/mal-project/cast_operations.php) | {
"anime_id": 1
} | Authorization (Admin JWT Token) | Deletes crew members by anime id |

## Photos

| **Method** | **URL** | **Payload** | **Headers** | **Description** |
| --- | --- | --- | --- | --- |
| GET | localhost/mal-project/photos_operations.php | None | None | Gets all photos |
| GET | localhost/mal-project/photos_operations.php?anime_id=1 | None | None | Gets photos by anime id |
| POST | localhost/mal-project/photos_operations.php | {
"anime_id": 1, "data": "https://i.pinimg.com/originals/54/11/bd/5411bd40e99f3ea2f4ea05fafaeb4450.jpg"
} | Authorization (Admin JWT Token) | Posts a photo to an anime |
| PUT | localhost/mal-project/photos_operations.php | { 
"id": 1, 
"anime_id": 1, 
"url": "https://i.pinimg.com/originals/54/11/bd/5411bd40e99f3ea2f4ea05fafaeb4450.jpg" } | Authorization (Admin JWT Token) | Updates a photo |
| DELETE | localhost/mal-project/photos_operations.php | { 
"anime_id": 1 
} | Authorization (Admin JWT Token) | Deletes photos by anime id |

## Favorites

| **Method** | **URL** | **Payload** | **Headers** | **Description** |
| --- | --- | --- | --- | --- |
| POST | localhost/mal-project/favorites_operations.php | {
"userId": 1, "animeId": 2, "action": "add"
} or 
{
"userId": 1, "animeId": 2, "action": "remove"
} | Authorization | Adds or removes an anime from a user's favorites. |
| GET | localhost/mal-project/favorites_operations.php?userId=1 | None | Authorization | Retrieves a user's favorite anime IDs.  |

## User Ratings

| **Method** | **URL** | **Payload** | **Headers** | **Description** |
| --- | --- | --- | --- | --- |
| GET | localhost/mal-project/ratings_operations.php?userId=1&animeId=2 | None | Authorization | Retrieves a user's rating for an anime, if it exists.  |
| POST | localhost/mal-project/ratings_operations.php | { 
"userId": 1, "animeId": 2, "rating": 8 
} | Authorization | Adds or updates a user's rating for an anime. |

## User Reviews

| **Method** | **URL** | **Payload** | **Headers** | **Description** |
| --- | --- | --- | --- | --- |
| GET | localhost/mal-project/reviews_operations.php?userId=1 | None | Authorization | Retrieves reviews of a user with a given userId. |
| GET | localhost/mal-project/reviews_by_anime_operations.php?animeId=1 | None | Authorization | Retrieves all reviews for the given anime ID. |
| POST | localhost/mal-project/reviews_operations.php | { 
"userId": 1, "animeId": 2, "reviewText": "This is a great anime!" 
} | Authorization | Adds or updates a review of an anime by the given user.  |
