# Backend API Specification

## Database Models

```prisma
model User {
  id              Int      @id @default(autoincrement())
  email           String   @unique
  name            String?
  password        String
  role            String   @default("USER")
  isEmailVerified Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  tokens          Token[]
  notes           Note[]
}

model Token {
  id          Int      @id @default(autoincrement())
  token       String
  type        String
  expires     DateTime
  blacklisted Boolean
  createdAt   DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id])
  userId      Int
}

model Note {
  id        String   @id @default(cuid())
  title     String
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id])
  userId    Int
}
```

## Authentication Endpoints

---

EP: POST /v1/auth/register
DESC: Register a new user account.
IN: body:{name:str!, email:str!, password:str!}
OUT: 201:{user:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}, tokens:{access:{token:str, expires:str}, refresh:{token:str, expires:str}}}
ERR: {"400":"Email already taken or validation failed", "500":"Internal server error"}
EX_REQ: curl -X POST /v1/auth/register -H "Content-Type: application/json" -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
EX_RES_201: {"user":{"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":false,"createdAt":"2025-10-31T10:30:45Z","updatedAt":"2025-10-31T10:30:45Z"},"tokens":{"access":{"token":"eyJ...","expires":"2025-10-31T11:30:45Z"},"refresh":{"token":"eyJ...","expires":"2025-11-07T10:30:45Z"}}}

---

EP: POST /v1/auth/login
DESC: Authenticate user with email and password.
IN: body:{email:str!, password:str!}
OUT: 200:{user:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}, tokens:{access:{token:str, expires:str}, refresh:{token:str, expires:str}}}
ERR: {"400":"Invalid input", "401":"Invalid email or password", "500":"Internal server error"}
EX_REQ: curl -X POST /v1/auth/login -H "Content-Type: application/json" -d '{"email":"john@example.com","password":"password123"}'
EX_RES_200: {"user":{"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":false,"createdAt":"2025-10-31T10:30:45Z","updatedAt":"2025-10-31T10:30:45Z"},"tokens":{"access":{"token":"eyJ...","expires":"2025-10-31T11:30:45Z"},"refresh":{"token":"eyJ...","expires":"2025-11-07T10:30:45Z"}}}

---

EP: POST /v1/auth/logout
DESC: Logout user and invalidate refresh token.
IN: body:{refreshToken:str!}
OUT: 204:{}
ERR: {"400":"Invalid refresh token", "404":"Token not found", "500":"Internal server error"}
EX_REQ: curl -X POST /v1/auth/logout -H "Content-Type: application/json" -d '{"refreshToken":"eyJ..."}'
EX_RES_204: 

---

EP: POST /v1/auth/refresh-tokens
DESC: Refresh access token using refresh token.
IN: body:{refreshToken:str!}
OUT: 200:{access:{token:str, expires:str}, refresh:{token:str, expires:str}}
ERR: {"400":"Invalid refresh token", "401":"Token expired or invalid", "500":"Internal server error"}
EX_REQ: curl -X POST /v1/auth/refresh-tokens -H "Content-Type: application/json" -d '{"refreshToken":"eyJ..."}'
EX_RES_200: {"access":{"token":"eyJ...","expires":"2025-10-31T11:30:45Z"},"refresh":{"token":"eyJ...","expires":"2025-11-07T10:30:45Z"}}

---

EP: POST /v1/auth/forgot-password
DESC: Send password reset email to user.
IN: body:{email:str!}
OUT: 204:{}
ERR: {"400":"Invalid email format", "404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X POST /v1/auth/forgot-password -H "Content-Type: application/json" -d '{"email":"john@example.com"}'
EX_RES_204: 

---

EP: POST /v1/auth/reset-password
DESC: Reset user password using reset token.
IN: query:{token:str!}, body:{password:str!}
OUT: 204:{}
ERR: {"400":"Invalid input or token", "401":"Token expired or invalid", "500":"Internal server error"}
EX_REQ: curl -X POST "/v1/auth/reset-password?token=resetToken123" -H "Content-Type: application/json" -d '{"password":"newPassword123"}'
EX_RES_204: 

---

EP: POST /v1/auth/send-verification-email
DESC: Send email verification to authenticated user.
IN: headers:{Authorization:str!}
OUT: 204:{}
ERR: {"401":"Unauthorized - invalid or missing token", "500":"Internal server error"}
EX_REQ: curl -X POST /v1/auth/send-verification-email -H "Authorization: Bearer eyJ..."
EX_RES_204: 

---

EP: POST /v1/auth/verify-email
DESC: Verify user email using verification token.
IN: query:{token:str!}
OUT: 204:{}
ERR: {"400":"Invalid token", "401":"Token expired or invalid", "500":"Internal server error"}
EX_REQ: curl -X POST "/v1/auth/verify-email?token=verifyToken123"
EX_RES_204: 

## User Management Endpoints

---

EP: POST /v1/users
DESC: Create a new user (admin only).
IN: headers:{Authorization:str!}, body:{name:str!, email:str!, password:str!, role:str!}
OUT: 201:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}
ERR: {"400":"Email already taken or validation failed", "401":"Unauthorized", "403":"Forbidden - admin access required", "500":"Internal server error"}
EX_REQ: curl -X POST /v1/users -H "Authorization: Bearer eyJ..." -H "Content-Type: application/json" -d '{"name":"Jane Doe","email":"jane@example.com","password":"password123","role":"USER"}'
EX_RES_201: {"id":2,"email":"jane@example.com","name":"Jane Doe","role":"USER","isEmailVerified":false,"createdAt":"2025-10-31T10:35:45Z","updatedAt":"2025-10-31T10:35:45Z"}

---

EP: GET /v1/users
DESC: Get all users with optional filtering and pagination (admin only).
IN: headers:{Authorization:str!}, query:{name:str, role:str, sortBy:str, limit:int, page:int}
OUT: 200:{results:arr[{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}], page:int, limit:int, totalPages:int, totalResults:int}
ERR: {"401":"Unauthorized", "403":"Forbidden - admin access required", "500":"Internal server error"}
EX_REQ: curl -X GET "/v1/users?limit=10&page=1&sortBy=createdAt:desc" -H "Authorization: Bearer eyJ..."
EX_RES_200: {"results":[{"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":false,"createdAt":"2025-10-31T10:30:45Z","updatedAt":"2025-10-31T10:30:45Z"}],"page":1,"limit":10,"totalPages":1,"totalResults":1}

---

EP: GET /v1/users/:userId
DESC: Get a specific user by ID.
IN: headers:{Authorization:str!}, params:{userId:int!}
OUT: 200:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}
ERR: {"401":"Unauthorized", "403":"Forbidden", "404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X GET /v1/users/1 -H "Authorization: Bearer eyJ..."
EX_RES_200: {"id":1,"email":"john@example.com","name":"John Doe","role":"USER","isEmailVerified":false,"createdAt":"2025-10-31T10:30:45Z","updatedAt":"2025-10-31T10:30:45Z"}

---

EP: PATCH /v1/users/:userId
DESC: Update a specific user by ID.
IN: headers:{Authorization:str!}, params:{userId:int!}, body:{name:str, email:str, password:str}
OUT: 200:{id:int, email:str, name:str, role:str, isEmailVerified:bool, createdAt:str, updatedAt:str}
ERR: {"400":"Email already taken or validation failed", "401":"Unauthorized", "403":"Forbidden", "404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X PATCH /v1/users/1 -H "Authorization: Bearer eyJ..." -H "Content-Type: application/json" -d '{"name":"John Smith"}'
EX_RES_200: {"id":1,"email":"john@example.com","name":"John Smith","role":"USER","isEmailVerified":false,"createdAt":"2025-10-31T10:30:45Z","updatedAt":"2025-10-31T10:40:45Z"}

---

EP: DELETE /v1/users/:userId
DESC: Delete a specific user by ID.
IN: headers:{Authorization:str!}, params:{userId:int!}
OUT: 200:{}
ERR: {"401":"Unauthorized", "403":"Forbidden", "404":"User not found", "500":"Internal server error"}
EX_REQ: curl -X DELETE /v1/users/1 -H "Authorization: Bearer eyJ..."
EX_RES_200: {}

## Notes Endpoints

---

EP: GET /v1/notes
DESC: Get all notes for authenticated user with optional filtering and sorting.
IN: headers:{Authorization:str!}, query:{query:str, sortBy:str, sortOrder:str}
OUT: 200:{notes:arr[{id:str, title:str, content:str, createdAt:str, updatedAt:str}], total:int}
ERR: {"401":"Unauthorized - invalid or missing token", "500":"Internal server error"}
EX_REQ: curl -X GET "/v1/notes?query=meeting&sortBy=updatedAt&sortOrder=desc" -H "Authorization: Bearer eyJ..."
EX_RES_200: {"notes":[{"id":"ckx1y2z3a","title":"Meeting Notes","content":"Discussed project roadmap...","createdAt":"2025-10-31T10:30:45Z","updatedAt":"2025-10-31T10:35:45Z"}],"total":1}

---

EP: GET /v1/notes/:id
DESC: Get a specific note by ID for authenticated user.
IN: headers:{Authorization:str!}, params:{id:str!}
OUT: 200:{note:{id:str, title:str, content:str, createdAt:str, updatedAt:str}}
ERR: {"401":"Unauthorized - invalid or missing token", "403":"Forbidden - note belongs to another user", "404":"Note not found", "500":"Internal server error"}
EX_REQ: curl -X GET /v1/notes/ckx1y2z3a -H "Authorization: Bearer eyJ..."
EX_RES_200: {"note":{"id":"ckx1y2z3a","title":"Meeting Notes","content":"Discussed project roadmap...","createdAt":"2025-10-31T10:30:45Z","updatedAt":"2025-10-31T10:35:45Z"}}

---

EP: POST /v1/notes
DESC: Create a new note for authenticated user.
IN: headers:{Authorization:str!}, body:{title:str!, content:str!}
OUT: 201:{note:{id:str, title:str, content:str, createdAt:str, updatedAt:str}}
ERR: {"400":"Invalid input - title and content are required", "401":"Unauthorized - invalid or missing token", "500":"Internal server error"}
EX_REQ: curl -X POST /v1/notes -H "Authorization: Bearer eyJ..." -H "Content-Type: application/json" -d '{"title":"New Note","content":"This is a new note content"}'
EX_RES_201: {"note":{"id":"ckx1y2z3b","title":"New Note","content":"This is a new note content","createdAt":"2025-10-31T10:45:45Z","updatedAt":"2025-10-31T10:45:45Z"}}

---

EP: PUT /v1/notes/:id
DESC: Update a specific note by ID for authenticated user.
IN: headers:{Authorization:str!}, params:{id:str!}, body:{title:str, content:str}
OUT: 200:{note:{id:str, title:str, content:str, createdAt:str, updatedAt:str}}
ERR: {"400":"Invalid input", "401":"Unauthorized - invalid or missing token", "403":"Forbidden - note belongs to another user", "404":"Note not found", "500":"Internal server error"}
EX_REQ: curl -X PUT /v1/notes/ckx1y2z3a -H "Authorization: Bearer eyJ..." -H "Content-Type: application/json" -d '{"title":"Updated Meeting Notes","content":"Updated content..."}'
EX_RES_200: {"note":{"id":"ckx1y2z3a","title":"Updated Meeting Notes","content":"Updated content...","createdAt":"2025-10-31T10:30:45Z","updatedAt":"2025-10-31T10:50:45Z"}}

---

EP: DELETE /v1/notes/:id
DESC: Delete a specific note by ID for authenticated user.
IN: headers:{Authorization:str!}, params:{id:str!}
OUT: 204:{}
ERR: {"401":"Unauthorized - invalid or missing token", "403":"Forbidden - note belongs to another user", "404":"Note not found", "500":"Internal server error"}
EX_REQ: curl -X DELETE /v1/notes/ckx1y2z3a -H "Authorization: Bearer eyJ..."
EX_RES_204: 

## MCP (Model Context Protocol) Endpoints

---

EP: POST /v1/mcp
DESC: Handle MCP POST requests with authentication middleware.
IN: headers:{Authorization:str!}, body:{[dynamic]}
OUT: 200:{[dynamic]}
ERR: {"400":"Invalid input", "401":"Unauthorized", "500":"Internal server error"}
EX_REQ: curl -X POST /v1/mcp -H "Authorization: Bearer eyJ..." -H "Content-Type: application/json" -d '{[MCP_PAYLOAD]}'
EX_RES_200: {[MCP_RESPONSE]}

---

EP: GET /v1/mcp
DESC: Handle MCP GET requests with authentication middleware.
IN: headers:{Authorization:str!}, query:{[dynamic]}
OUT: 200:{[dynamic]}
ERR: {"401":"Unauthorized", "500":"Internal server error"}
EX_REQ: curl -X GET /v1/mcp -H "Authorization: Bearer eyJ..."
EX_RES_200: {[MCP_RESPONSE]}

---

EP: DELETE /v1/mcp
DESC: Handle MCP DELETE requests with authentication middleware.
IN: headers:{Authorization:str!}, body:{[dynamic]}
OUT: 200:{[dynamic]}
ERR: {"400":"Invalid input", "401":"Unauthorized", "500":"Internal server error"}
EX_REQ: curl -X DELETE /v1/mcp -H "Authorization: Bearer eyJ..." -H "Content-Type: application/json" -d '{[MCP_PAYLOAD]}'
EX_RES_200: {[MCP_RESPONSE]}