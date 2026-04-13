# Planix API Documentation

Base URL: `http://localhost:5000/api` (Development)

## Authentication

Planix uses Google OAuth2 for authentication and JWT (Base64 encoded cookies) for session management.

### Google Login
- **URL**: `/auth/google`
- **Method**: `GET`
- **Description**: Redirects the user to the Google OAuth2 consent screen.

### Authentication Callback
- **URL**: `/auth/google/callback`
- **Method**: `GET`
- **Description**: Internal route handled by the server to exchange code for tokens and establish a session.

### Get Current User
- **URL**: `/auth/me`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <jwt_token>` (or via cookie)
- **Success Response**: `200 OK` with user profile data.

### Logout
- **URL**: `/auth/logout`
- **Method**: `POST`
- **Description**: Clears the authentication cookies and terminates the session.

---

## Events & Tasks

Routes starting with `/events` require authentication.

### List Events
- **URL**: `/events`
- **Method**: `GET`
- **Description**: Retrieves all events and tasks for the authenticated user, synchronized with Google Calendar and Tasks.

### Create Event
- **URL**: `/events`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "title": "Project Meeting",
    "startTime": "2024-04-15T10:00:00Z",
    "endTime": "2024-04-15T11:00:00Z",
    "description": "Weekly sync",
    "location": "Zoom",
    "eventType": "event" // or 'task'
  }
  ```

### Update Event
- **URL**: `/events/:eventId`
- **Method**: `PUT`
- **Description**: Updates an existing event or task. Synchronously pushes changes to Google API.

### Patch Status
- **URL**: `/events/:eventId/status`
- **Method**: `PATCH`
- **Body**: `{ "status": "completed" }`
- **Description**: Quickly update the status of an event or task.

### Delete Event
- **URL**: `/events/:eventId`
- **Method**: `DELETE`
- **Description**: Removes the event from the local database and Google Calendar.

---

## Reminders

Routes starting with `/reminders` require authentication.

### List Reminders
- **URL**: `/reminders`
- **Method**: `GET`
- **Description**: Fetches all pending and completed reminders.

### Create Reminder
- **URL**: `/reminders`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "eventId": "uuid",
    "remindAt": "2024-04-15T09:45:00Z",
    "message": "Meeting in 15 mins"
  }
  ```

### Mark as Completed
- **URL**: `/reminders/:reminderId/complete`
- **Method**: `PATCH`
- **Description**: Manually clear a reminder notification.

---

## Error Handling

The API returns standard HTTP status codes:

- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Input validation failed.
- `401 Unauthorized`: Missing or invalid authentication.
- `404 Not Found`: The resource does not exist.
- `500 Internal Server Error`: Generic server error.

**Error Response Format**:
```json
{
  "success": false,
  "message": "Detailed error message here"
}
```
