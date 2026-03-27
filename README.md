# Movie API Code Test

## Getting Started

This repo contains a sqlite database with movie information as well as a local instance of an API providing movie ratings.  
You need to create an API that will pull data from the database and interact with the ratings API.

#### Pre-requisites

- An IDE or text editor of your choice
- Node es2016 & Typescript
- [Sqlite3](http://www.sqlitetutorial.net/)

#### Set Up

1. Run `npm install` to install the javascript dependencies
2. Start the ratings API with `npm run dev`. It will be available at [localhost:3000](http://localhost:3000).
3. Test the response by visiting [http://localhost:3000/heartbeat](http://localhost:3000/heartbeat)
4. BONUS: Run the automated tests with `npm run test`

## Task

Your task is to create an API on top of several data sources including a database, an API that you can edit and an external API.
You are free to use whatever language you prefer, but we prefer you use Typescript or Javascript.

**The Database**
The database is provided as a SQLite3 database in `model/movies.db`. It does not require any credentials to login. You can run SQL queries directly against the database using:

```
sqlite3 <path to db file>
```

`.tables` will return a list of available tables and `.schema <table>` will provide the schema.

**The Local API**
There is a local API that provides ratings for a specific movie when provided with the IMDB movie id.

**The External API**
The [Open Movie Database (OMDB)](https://www.omdbapi.com) provides Rotten Tomato ratings. API documentation is available at: [omdbapi.com](https://www.omdbapi.com).

**Tests**
Automated tests using Jest are provided in the `test` directory. You can run them with `npm run test`. There is no requirement to write your own tests, but you may find that writing tests is a useful development tool.

## Considerations

When developing a solution, please consider the following:

- Structure of the endpoints - So, you can easily extend the API to support new endpoints as feature requests come in?
- Quality of the code - Does the code demonstrate the use of design patterns?
- Testability - Is the code testable?

## User Stories

#### List All Movies

AC:

- All movies are able to be listed from the database
- List is paginated: 50 movies per page, the page can be altered with the `page` query parameter
- Columns should include: imdb id, title, genres, release date, budget
- Budget is displayed in USD

#### Movie Details

AC:

- A specific movie's details are able to be retrieved from the database using the movie id
- Details should include: imdb id, title, description, release date, budget, runtime, average rating, genres, original language, production companies
- Budget should be displayed in USD
- Ratings are pulled from the rating API and the Rotten Tomatoes score from OMDB
- The source of each rating is clear in the response

#### Movies By Year

AC:

- Movies can be listed by year through the API
- List is paginated: 50 movies per page, the page can be altered with the `page` query parameter
- List is sorted by date in chronological order
- Sort order can be descending
- Columns include: imdb id, title, genres, release date, budget

#### Movies By Genre

AC:

- Movies can be listed by genre through the API
- List is paginated: 50 movies per page, the page can be altered with the `page` query parameter
- Columns include: imdb id, title, genres, release date, budget

## Tips

- It is more important to produce well structured code that meets the criteria in the user stories rather than getting all stories done.
- Some requirements of the assignment are left ambiguous on purpose - we want this challenge to spark a conversation around your unique problem-solving abilities and allow you to show us your strengths
- You may use outside resources such as google, but we ask that you do not simply copy a solution from the internet.

**A Special Note on AI Usage**

Here at CVS, we value original thought and creativity alongside innovation and progress.
**You may use a GenAI assistant (such as ChatGPT, Github Copilot, etc.) to help you plan your approach** and generate code,
but you must write the final code yourself. You must also be able to explain the code you write.
You will be asked about your approach to solving the problem, and our expectation is that you can speak to the tradeoffs and strategy you employ.
**We ask that you share your prompts in the form of screenshots with us** so we can better understand your thought process
and facilitate a productive conversation around how you may enhance your work at CVS with AI.

## How to Run

1. Install dependencies:
   npm install

2. Start the server:
   npm run dev

Server runs on:
http://localhost:3005

Test the API by visiting:

http://localhost:3005/heartbeat

## These are the End Points I have tested.
* http://localhost:3005/api/movies
* http://localhost:3005/api/movies?page=1
* http://localhost:3005/api/movies/search/by-year?year=2010
* http://localhost:3005/api/movies/search/by-year?year=2010&page=1
* http://localhost:3005/api/movies/search/by-year?year=2010&page=1&sort=desc
* http://localhost:3005/api/movies/search/by-genre?genre=Action
* http://localhost:3005/api/movies/search/by-genre?genre=Action&page=1
* http://localhost:3005/api/movies/<imdbId>