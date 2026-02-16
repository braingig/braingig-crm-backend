# Entity-Relationship Diagram

## Database Schema Overview

This document contains the ER diagram for the BrainGig CRM system database.

## Mermaid ER Diagram

```mermaid
erDiagram
    User ||--o{ Project : "creates"
    User ||--o{ Task : "assigned to"
    User ||--o{ Task : "creates"
    User ||--o{ Timesheet : "has"
    User ||--o{ TimeEntry : "tracks"
    User ||--o{ Payroll : "receives"
    User ||--o{ Sale : "assigned to"
    User ||--o{ ActivityLog : "performs"
    User ||--o{ Notification : "receives"
    User ||--o{ Comment : "writes"
    User ||--o{ ActivityEvent : "generates"
    
    Project ||--o{ Task : "contains"
    
    Task ||--o{ Task : "has subtasks"
    Task ||--o{ TimeEntry : "tracked in"
    Task ||--o{ Comment : "has"
    
    User {
        string id PK
        string email UK
        string password
        string name
        enum role
        string phone
        string department
        string[] skills
        enum salaryType
        float salaryAmount
        enum workType
        datetime joiningDate
        string status
        datetime lastActive
        string refreshToken
        datetime createdAt
        datetime updatedAt
    }
    
    Project {
        string id PK
        string name
        string description
        float budget
        float hourlyRate
        enum status
        datetime startDate
        datetime endDate
        string clientName
        string createdById FK
        datetime createdAt
        datetime updatedAt
    }
    
    Task {
        string id PK
        string projectId FK
        string title
        string description
        enum status
        enum priority
        string assignedToId FK
        datetime startDate
        datetime dueDate
        int timeSpent
        int estimatedTime
        string createdById FK
        string parentTaskId FK
        datetime createdAt
        datetime updatedAt
    }
    
    Timesheet {
        string id PK
        string employeeId FK
        date date
        datetime checkIn
        datetime checkOut
        float totalHours
        enum status
        string notes
        int sessionNumber
        datetime createdAt
        datetime updatedAt
    }
    
    TimeEntry {
        string id PK
        string employeeId FK
        string taskId FK
        datetime startTime
        datetime endTime
        int duration
        string description
        boolean isManual
        datetime createdAt
    }
    
    Payroll {
        string id PK
        string employeeId FK
        date month
        float baseSalary
        float bonus
        float deductions
        float totalPaid
        float hoursWorked
        enum status
        datetime paidAt
        datetime createdAt
        datetime updatedAt
    }
    
    Sale {
        string id PK
        string leadName
        string companyName
        string email
        string phone
        string source
        enum status
        float estimatedValue
        float actualValue
        string assignedToId FK
        string notes
        datetime expectedCloseDate
        datetime closedAt
        datetime createdAt
        datetime updatedAt
    }
    
    ActivityLog {
        string id PK
        string userId FK
        string action
        string entityType
        string entityId
        json metadata
        string ipAddress
        datetime createdAt
    }
    
    Notification {
        string id PK
        string userId FK
        string title
        string message
        enum type
        boolean isRead
        string link
        datetime createdAt
    }
    
    Comment {
        string id PK
        string taskId FK
        string userId FK
        string content
        datetime createdAt
        datetime updatedAt
    }
    
    ActivityEvent {
        string id PK
        string employeeId FK
        string type
        json metadata
        datetime createdAt
    }
```

## Entity Descriptions

### User
The central entity representing employees/users in the system. Supports multiple roles (ADMIN, HR, TEAM_LEAD, DEVELOPER, SALES, FINANCE) and work types (REMOTE, ONSITE).

**Key Relationships:**
- Creates Projects (one-to-many)
- Assigned to Tasks (one-to-many)
- Creates Tasks (one-to-many)
- Has Timesheets (one-to-many)
- Tracks TimeEntries (one-to-many)
- Receives Payroll (one-to-many)
- Assigned to Sales (one-to-many)
- Generates ActivityLogs (one-to-many)
- Receives Notifications (one-to-many)
- Writes Comments (one-to-many)
- Generates ActivityEvents (one-to-many)

### Project
Represents client projects with budget, timeline, and status tracking.

**Key Relationships:**
- Created by User (many-to-one)
- Contains Tasks (one-to-many)

### Task
Represents work items with support for subtasks, priorities, and status tracking.

**Key Relationships:**
- Belongs to Project (many-to-one)
- Assigned to User (many-to-one, optional)
- Created by User (many-to-one)
- Has Subtasks (self-referential, one-to-many)
- Tracked in TimeEntries (one-to-many)
- Has Comments (one-to-many)

### Timesheet
Tracks daily check-in/check-out times for employees. Supports multiple sessions per day for remote workers.

**Key Relationships:**
- Belongs to User (many-to-one)

**Unique Constraint:** (employeeId, date, sessionNumber)

### TimeEntry
Detailed time tracking entries linked to specific tasks.

**Key Relationships:**
- Belongs to User (many-to-one)
- Linked to Task (many-to-one, optional)

### Payroll
Monthly payroll records for employees.

**Key Relationships:**
- Belongs to User (many-to-one)

**Unique Constraint:** (employeeId, month)

### Sale
Sales leads and opportunities tracking.

**Key Relationships:**
- Assigned to User (many-to-one)

### ActivityLog
Audit log of user actions in the system.

**Key Relationships:**
- Performed by User (many-to-one)

### Notification
User notifications for various system events.

**Key Relationships:**
- Sent to User (many-to-one)

### Comment
Comments on tasks for collaboration.

**Key Relationships:**
- Belongs to Task (many-to-one)
- Written by User (many-to-one)

### ActivityEvent
Employee activity events (e.g., screenshots, activity monitoring).

**Key Relationships:**
- Generated by User (many-to-one)

## Enums

### UserRole
- ADMIN
- HR
- TEAM_LEAD
- DEVELOPER
- SALES
- FINANCE

### SalaryType
- FIXED
- HOURLY

### WorkType
- REMOTE
- ONSITE

### ProjectStatus
- PLANNING
- ACTIVE
- ON_HOLD
- COMPLETED
- CANCELLED

### TaskStatus
- TODO
- IN_PROGRESS
- REVIEW
- COMPLETED

### TaskPriority
- LOW
- MEDIUM
- HIGH
- URGENT

### SalesStatus
- NEW
- QUALIFIED
- PROPOSAL
- NEGOTIATION
- CLOSED_WON
- CLOSED_LOST

### PayrollStatus
- PENDING
- PROCESSED
- PAID

### TimesheetStatus
- PENDING
- APPROVED
- REJECTED

### NotificationType
- INFO
- SUCCESS
- WARNING
- ERROR

## Indexes

### User
- email (unique)
- role
- status

### Project
- status
- createdById

### Task
- projectId
- assignedToId
- status
- priority
- parentTaskId

### Timesheet
- employeeId
- date
- Unique: (employeeId, date, sessionNumber)

### TimeEntry
- employeeId
- taskId
- startTime

### Payroll
- employeeId
- month
- status
- Unique: (employeeId, month)

### Sale
- assignedToId
- status

### ActivityLog
- userId
- (entityType, entityId)
- createdAt

### Notification
- (userId, isRead)
- createdAt

### Comment
- taskId
- userId

### ActivityEvent
- (employeeId, createdAt)

## Cascade Rules

- **Project → Task**: Cascade delete (deleting a project deletes all its tasks)
- **Task → SubTask**: Cascade delete (deleting a parent task deletes all subtasks)
- **User → Timesheet**: Cascade delete
- **User → TimeEntry**: Cascade delete
- **User → Payroll**: Cascade delete
- **User → ActivityLog**: Cascade delete
- **User → Notification**: Cascade delete
- **User → Comment**: Cascade delete
- **User → ActivityEvent**: Cascade delete
- **Task → TimeEntry**: Set null on delete
- **Task → Comment**: Cascade delete
