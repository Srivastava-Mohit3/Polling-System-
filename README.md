# Polling System

## Overview

This project implements a high-concurrency polling system using Node.js, Kafka, and PostgreSQL. It allows users to create polls, vote on them, and view real-time results. The system is designed to handle high traffic and ensure fault tolerance through the use of Kafka for message queuing and Zookeeper for distributed coordination.

Key features include:

- Creation of polls with multiple options
- High-concurrency voting mechanism
- Real-time updates of poll results via WebSockets
- Global leaderboard of popular poll options
- Fault-tolerant architecture using Kafka and Zookeeper
- Scalable database solution with PostgreSQL

## Technology Stack

- Backend: Node.js with Express.js
- Message Broker: Apache Kafka
- Distributed Coordination: Apache Zookeeper
- Database: PostgreSQL
- Real-time Updates: WebSockets (ws library)
- Containerization: Docker and Docker Compose

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Project Setup

### 1. Clone the Repository

```cmd
git clone https://github.com/Srivastava-Mohit3/Polling-System-.git
cd polling-system
```

### 2. Install Dependencies

Install the required Node.js dependencies:

```cmd
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root of the project and populate it with the following variables:

```env
DB_HOST = localhost
DB_PORT = 5432
DB_USER = polluser
DB_PASSWORD = pollpassword
DB_NAME = polldb
KAFKA_HOST = localhost:9092
PORT = 3000
```


### 4. Start Services with Docker Compose

The project includes a `docker-compose.yml` file to spin up Kafka, Zookeeper, and PostgreSQL. Run the following command to start the services:

```cmd
docker-compose up -d
```

This will start Kafka, Zookeeper, and PostgreSQL containers in the background.

### 5. Run Database Migrations

Ensure the database schema is set up by running migrations:

```cmd
node schema/pollSchema.js
```

### 6. Start the Application

Run the server in development mode:

```cmd
npm run dev
```

Alternatively, start it in production mode:

```cmd
npm start
```

### 7. Access the Application

- REST API: `http://localhost:3000/`


## Additional Commands

- **Stop Services**:

  ```cmd
  docker-compose down
  ```

- **View Logs for Kafka or PostgreSQL**:

  ```
  docker logs polling-system
  ```
### 8. Testing APIs


- **Check**:
  ```http
  GET / 
  Response: {
    "message": "App is live"
  }
  ```

- **Create a new Poll**:
  ```http
  POST http://localhost:3000/api/polls
  Body: {
      "title": "Favorite Programming Language",
      "options": ["JavaScript", "Python", "Java", "C++"]
  }
  Response: {
    "id": 1,
    "message": "Poll created successfully"
  }
  ```

- **Vote on a Poll**:
  ```http
  POST http://localhost:3000/api/polls/1/vote
  Body: {
    "optionId": 2
  }
  Response: {
    "message": "Vote registered successfully"
  }
  ```

- **Get Poll Results**:
  ```http
  GET http://localhost:3000/api/polls/1
  Response: {
    "poll": {
        "id": 1,
        "title": "Favorite Programming Language",
        "created_at": "2025-01-17T05:48:44.974Z"
    },
    "options": [
        {
            "id": 1,
            "poll_id": 1,
            "option_text": "JavaScript",
            "votes": 0
        },
        {
            "id": 3,
            "poll_id": 1,
            "option_text": "Java",
            "votes": 0
        },
        {
            "id": 4,
            "poll_id": 1,
            "option_text": "C++",
            "votes": 0
        },
        {
            "id": 2,
            "poll_id": 1,
            "option_text": "Python",
            "votes": 4
        }
    ]
  }
  ```

- **Leaderboard**:
  ```http
  GET http://localhost:3000/api/leaderboard
  Response: [
    {
        "id": 2,
        "option_text": "Python",
        "votes": 4,
        "poll_title": "Favorite Programming Language"
    },
    {
        "id": 3,
        "option_text": "Java",
        "votes": 0,
        "poll_title": "Favorite Programming Language"
    },
    {
        "id": 4,
        "option_text": "C++",
        "votes": 0,
        "poll_title": "Favorite Programming Language"
    },
    {
        "id": 1,
        "option_text": "JavaScript",
        "votes": 0,
        "poll_title": "Favorite Programming Language"
    }
  ]
  ```


## Contribution

1. Fork the repository.
2. Create a new branch:
   ```cmd
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```cmd
   git commit -m "Add new feature"
   ```
4. Push to your branch:
   ```cmd
   git push origin feature-name
   ```
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contact

For inquiries or support, please email mohit.srivastava.0002@gmail.com
