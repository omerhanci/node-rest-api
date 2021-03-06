# node-rest-api

A simple node.js rest api application that communicates with mongodb

## Getting Started

To run the application you should have npm and node installed on your computer

### Prerequisites

You should set MONGO_DB_URL in .env file

### Run Application

To run project you should execute following command: 

```
npm run start
```

### Run Tests

To run the tests 

```
npm run integration-test
```

### Usage

After running the application, you can fetch filtered results by sending below curl request.

```
curl -X POST \
  http://localhost:3000/fetchByCountAndDate \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '{
    "startDate": "2016-11-16",
    "endDate": "2018-02-22",
    "minCount": 125,
    "maxCount": 160
  }'
```

All fields are required. 

