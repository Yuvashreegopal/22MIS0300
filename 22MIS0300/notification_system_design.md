
# Notification System Design

---

# Stage 1

## Core Features

The notification platform supports:

- Placement notifications
- Event notifications
- Result notifications
- Mark notifications as read
- Fetch unread notifications
- Real-time notification delivery

---

## REST API Design

### Get Notifications

GET /api/notifications

Response:

```json
{
  "notifications": []
}
```

---

### Mark Notification as Read

PUT /api/notifications/:id/read

Response:

```json
{
  "message": "Notification marked as read"
}
```

---

### Create Notification

POST /api/notifications

Request:

```json
{
  "type": "Placement",
  "message": "TCS Hiring",
  "studentId": 101
}
```

Response:

```json
{
  "message": "Notification created successfully"
}
```

---

## Real-Time Notifications

WebSockets can be used for real-time notification delivery.

Advantages:
- Instant updates
- Reduced API polling
- Better user experience

---

# Stage 2

## Database Choice

PostgreSQL is preferred because:
- Structured data
- ACID compliance
- Better indexing support
- Reliable transactions

---

## Database Schema

### notifications table

| Column | Type |
|---|---|
| id | UUID |
| studentId | INT |
| type | VARCHAR |
| message | TEXT |
| isRead | BOOLEAN |
| createdAt | TIMESTAMP |

---

## Scaling Problems

As data grows:
- Slow queries
- Increased storage
- High DB load

Solutions:
- Indexing
- Partitioning
- Caching
- Pagination

---

# Stage 3

## Query Problem

The query becomes slow because:
- Full table scan
- Large notification volume
- Missing indexes

---

## Better Index

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(studentId, isRead, createdAt DESC);
```

---

## Optimized Query

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt DESC;
```

---

## Placement Notifications in Last 7 Days

```sql
SELECT *
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 days';
```

---

## Why Not Index Every Column?

Indexing every column:
- increases storage
- slows inserts/updates
- wastes memory

Indexes should only be added for frequently queried columns.

---

# Stage 4

## Performance Improvements

### Redis Caching
Frequently accessed notifications can be cached using Redis.

### Pagination
Load notifications page-by-page instead of loading all data.

### Lazy Loading
Fetch notifications only when needed.

### WebSockets
Avoid repeated API polling.

---

## Tradeoffs

| Strategy | Advantage | Disadvantage |
|---|---|---|
| Redis | Faster reads | Extra memory |
| Pagination | Lower DB load | More API calls |
| WebSockets | Real-time updates | Persistent connections |

---

# Stage 5

## Problems in Existing Design

- Sequential processing is slow
- Single failure affects all users
- No retry mechanism
- High response time

---

## Better Architecture

Use:
- Message Queue
- Background Workers
- Retry Mechanism

Tools:
- Kafka
- RabbitMQ

---

## Improved Flow

1. Save notification in DB
2. Push task to queue
3. Worker sends emails
4. Worker pushes app notifications

---

## Advantages

- Faster processing
- Fault tolerance
- Retry support
- Better scalability

---

## Revised Pseudocode

```python
save_notification_to_db()

push_email_job_to_queue()

push_notification_job_to_queue()
```

---

# Stage 6

## Priority Logic

Priority is based on:
1. Notification type
2. Recency

Priority order:

Placement > Result > Event

---

## Scoring Formula

```txt
score = typeWeight * 10 - ageInHours
```

Where:
- Placement = 3
- Result = 2
- Event = 1

---

## Efficient Top 10 Strategy

Use:
- Min Heap / Priority Queue
- Real-time sorting

Advantages:
- Faster retrieval
- Efficient updates
- Lower computation cost

---

## Scalability

New notifications can be inserted dynamically while maintaining top notifications efficiently.
