# YouApp Backend

## Project Overview

**YouApp Backend** is a microservice-based application built with NestJS. It comprises two primary services:

- **User Service**: Manages user authentication, profile creation, and user-related operations.
- **Chat Service**: Handles chat functionalities including message handling and room management.

## Stack

- **Framework**: NestJS

## Folder Structure

```plaintext
/root
  ├── user-service
  └── chat-service

```

## Setup and Installation

### Prerequisites

- Node.js (v20.x or later)
- npm (v9.x or later)

### Installation

1. **Clone the Repository**

   ```bash
   git clone repo-link
   cd youapp-backend
   ```

2. **Install Dependencies**

   Navigate to the `user-service` and `chat-service` directories and install dependencies:

      ```bash
      cd user-service
      npm install

      cd ../chat-service
      npm install
      ```

### Environment Configuration

  Create Environment Files:
   In both `user-service` and `chat-service` directories, create a `.env` file with the necessary
   environment variables.

   ```bash
   DATABASE_URL=your-database-url
   JWT_SECRET=your-jwt-secret
   JWT_EXPIRES=30d
   ```

### Running the Application

  User service:

   ```bash
   cd user-service
   npm run start:dev 
   ```

  Chat service:

   ```bash
   cd chat-service
   npm run start:dev 
   ```

### Testing

To run tests for each service, navigate to the respective service directory and execute

  User service:

   ```bash
   cd user-service
   npm test 
   ```

  Chat service:

   ```bash
   cd ../chat-service
   npm test
   ```

## User Service Documentation

## Endpoints

### Register

- **Endpoint**: `POST /register`
- **Description**: Registers a new user and returns a JWT token.
- **Request**:

  ```bash
  curl --location -g '{{url}}/register' \
  --data-raw '{
     "email": "badiru@gmail.com",
     "userName": "Badiru",
     "password": "sunshine"
  }'
  ```

- **Response**:

   ```bash
      {
        "token": " Bearer token"
      }
  ```

### Login

- **Endpoint**: `POST /login`

- **Description**: Authenticates a user and returns a JWT token.

- **Request**:

  ```bash
  curl --location -g '{{url}}/login' \
  --data '{
     "userName": "Badiru",
     "password": "sunshine"
  }'
  ```

  **OR**

    ```bash
  curl --location -g '{{url}}/login' \
  --data '{
     "email": "test@email.com",
     "password": "sunshine"
  }'
  ```

### Create Profile

- **Endpoint**: `POST /createProfile`

- **Description**: Creates a new user profile and returns it with zodiac and horoscope information.

- **Request**:

  ```bash
  curl --location -g '{{url}}/createProfile' \
  --data '{
      "displayName": "Badiru Sulaimon",
      "gender": "MALE",
      "birthday": "2002-08-31",
      "height": 160,
      "weight": 70,
      "imageUrl": "ww.image.com",
      "interest": ["Dance", "Code"]
  }'
  ```

- **Response**:

   ```bash
     {
  "data": {
    "id": "66d2d76cb6f5f8fa4be91c2b",
    "userId": "66d2c332f193f2ae097fc778",
    "displayName": "Badiru Sulaimon",
    "gender": "MALE",
    "birthday": "2002-08-31T00:00:00.000Z",
    "height": 160,
    "weight": 70,
    "imageUrl": "ww.image.com",
    "interest": [
      "Dance",
      "Code"
    ],
    "createdAt": "2024-08-31T08:42:20.765Z",
    "updatedAt": "2024-08-31T08:42:20.765Z",
    "deletedAt": null,
    "zodiac": "Cancer",
    "horoscope": "Crab"
  },
  "success": true,
  "message": "Profile created successfully"
   }
  ```

### Get User Profile

- **Endpoint**: `GET /getUserProfile`

- **Description**: Fetches the user profile including zodiac and horoscope information.

- **Request**:

  Requires authentication via JWT token in headers. Example:

  ```bash
  curl --location --request GET '{{url}}/getUserProfile' \
  --header 'Authorization: Bearer YOUR_JWT_TOKEN'
  ```

### Update Profile

- **Endpoint**: `PUT /updateProfile`

- **Description**: Updates an existing user profile and returns the updated profile with zodiac and horoscope information.

- **Request**:

  Requires authentication via JWT token in headers. Example:

  ```bash
  curl --location --request PUT '{{url}}/updateProfile' \
  --header 'Authorization: Bearer YOUR_JWT_TOKEN' \
  --data-raw '{
    "gender": "FEMALE"
  }'
  ```

- **Response**:

   ```bash
      {
  "data": {
    "id": "66d2d76cb6f5f8fa4be91c2b",
    "userId": "66d2c332f193f2ae097fc778",
    "displayName": "Badiru Sulaimon",
    "gender": "FEMALE",
    "birthday": "2002-08-31T00:00:00.000Z",
    "height": 160,
    "weight": 70,
    "imageUrl": "ww.image.com",
    "interest": [
      "Dance",
      "Code"
    ],
    "createdAt": "2024-08-31T08:42:20.765Z",
    "updatedAt": "2024-08-31T09:37:27.040Z",
    "deletedAt": null,
    "zodiac": "Cancer",
    "horoscope": "Crab"
  },
  "success": true,
  "message": "Profile updated successfully"}
  ```

## Error Responses

### 401 Unauthorized

- **Description**: The request requires user authentication or the provided token is invalid or expired.

- **Example Response**:

  ```json
  {
    "statusCode": 401,
    "message": "Unauthorized",
    "error": "Unauthorized"
  }
  ```

### 404 Not Found

- **Description**: The requested resource could not be found. This may occur if the user profile or any other resource does not exist.

- **Example Response**:

  ```json
  {
    "statusCode": 404,
    "message": "Not Found",
    "error": "Not Found"
  }
  ```

### 500 Internal Server Error

- **Description**: An unexpected error occurred on the server side. This could be due to a problem with the server or an unhandled exception.

- **Example Response**:

  ```json
  {
    "statusCode": 500,
    "message": "Internal Server Error",
    "error": "Internal Server Error"
  }
  ```

## Chat Service

The Chat Service utilizes Socket.IO to facilitate real-time communication between clients.

### Gateway Overview

The `ChatGateway` class is responsible for managing WebSocket connections and handling events related to chat rooms and messages.

#### WebSocket Gateway Configuration

- **CORS Configuration:** Allows requests from any origin.
- **Path:** The default path is empty.

### Events and Methods

#### `handleConnection`

- **Description:** Called when a client connects.
- **Parameters:**
  - `client: Socket` - The connected client.
- **Logs:** Client connection information.

#### `handleDisconnect`

- **Description:** Called when a client disconnects.
- **Parameters:**
  - `client: Socket` - The disconnected client.
- **Logs:** Client disconnection information.

#### `handleCreateRoom`

- **Event:** `createRoom`
- **Description:** Creates a new chat room and adds the client to it.
- **Parameters:**
  - `client: Socket` - The client requesting the room creation.
  - `body: { roomName?: string }` - Optional room name.
- **Guard:** `WsGuard` - Ensures the client is authenticated.

#### `handleJoinRoom`

- **Event:** `joinRoom`
- **Description:** Adds a client to an existing chat room and notifies other room members.
- **Parameters:**
  - `roomId: string` - The ID of the room to join.
  - `client: Socket` - The client requesting to join the room.
- **Guard:** `WsGuard` - Ensures the client is authenticated.
- **Emits:** `userJoined` - Notifies other users in the room about the new member.

#### `handleSendMessage`

- **Event:** `sendMessage`
- **Description:** Sends a message to a chat room and notifies all room members.
- **Parameters:**
  - `roomId: string` - The ID of the room where the message should be sent.
  - `message: string` - The message content.
  - `client: Socket` - The client sending the message.
- **Guard:** `WsGuard` - Ensures the client is authenticated.
- **Emits:** `newMessage` - Notifies all users in the room about the new message.

#### `identifyUser`

- **Event:** `identify`
- **Description:** Identifies the user and adds them to their previously joined rooms.
- **Parameters:**
  - `client: Socket` - The client requesting identification.
- **Guard:** `WsGuard` - Ensures the client is authenticated.

### Client-Side Integration

When the client receives the `newMessage` event, they should call the `viewMessage` API to refresh the chat with the latest messages.

### Example

To create a new room:

```sh
curl --location --request EVENT 'createRoom' \
--data-raw '{"roomName": "General Chat"}'
```

To join a room:

```sh
curl --location --request EVENT 'joinRoom' \
--data-raw '{"roomId": "roomId123"}'
```

To send a message:

```sh
curl --location --request EVENT 'sendMessage' \
--data-raw '{"roomId": "roomId123", "message": "Hello, world!"}'
```

To identify a user:

```sh
curl --location --request EVENT 'identify'
```

When the client receives the `newMessage` event, they should call the `viewMessage` API to refresh the chat with the latest messages.

- **Request**:

  Requires authentication via JWT token in headers. Example:

  ```bash
  curl --location --request GET '{{url}}/viewMessages/roomId' \
  --header 'Authorization: Bearer YOUR_JWT_TOKEN' \
  ```

- **Response**:

 ```bash
{
  "data": [
    {
      "_id": "66d339f54876b56a687e84fd",
      "content": "Hellow",
      "userId": "66d32d933e11d90d7ef74018",
      "roomId": "66d339784876b56a687e84fa",
      "createdAt": "2024-08-31T15:42:45.195Z",
      "updatedAt": "2024-08-31T15:42:45.195Z",
      "deletedAt": null
    },
    {
      "_id": "66d33ade4876b56a687e84fe",
      "content": "Any one here",
      "userId": "66d32d933e11d90d7ef74018",
      "roomId": "66d339784876b56a687e84fa",
      "createdAt": "2024-08-31T15:46:38.812Z",
      "updatedAt": "2024-08-31T15:46:38.812Z",
      "deletedAt": null
    },
    {
      "_id": "66d33b554876b56a687e84ff",
      "content": "Cool",
      "userId": "66d32d933e11d90d7ef74018",
      "roomId": "66d339784876b56a687e84fa",
      "createdAt": "2024-08-31T15:48:37.698Z",
      "updatedAt": "2024-08-31T15:48:37.698Z",
      "deletedAt": null
    },
    {
      "_id": "66d33d2afb1d850ff355606b",
      "content": "me",
      "userId": "66d32d933e11d90d7ef74018",
      "roomId": "66d339784876b56a687e84fa",
      "createdAt": "2024-08-31T15:56:26.901Z",
      "updatedAt": "2024-08-31T15:56:26.901Z",
      "deletedAt": null
    }
  ],
  "success": true,
  "message": "chat messages"
}
  ```
