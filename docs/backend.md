# Backend Mechanics

This document explains how the backend of the CSAS Engine operates. It provides insight into the routing structure, security, and logic execution without requiring you to read the raw code.

## Cloudflare Pages Functions
The backend is powered by Cloudflare Pages Functions. Unlike traditional Node.js servers (like Express.js) where all routes are defined in a single massive file, Cloudflare Functions use **File-Based Routing**.

### The Directory Structure
If you look inside the `functions/api/` folder, the folder and file names exactly match the API URLs that the frontend calls.
- `functions/api/auth/login.js` handles requests to `/api/auth/login`
- `functions/api/jobs/index.js` handles requests to `/api/jobs`
- `functions/api/jobs/applications/index.js` handles requests to `/api/jobs/applications`

When the frontend needs data, it sends a request to one of these specific endpoints. The corresponding `.js` file wakes up, executes its logic, and goes back to sleep.

## Security and Middleware
Before a specific function is allowed to process a request, the system must ensure the user is who they claim to be. This is handled by a "Middleware."

In the `functions/api/` directory, there is a special file called `_middleware.js`. 
1. **Interception:** Every time a request comes into the backend (except for login or registration), the middleware intercepts it.
2. **Token Verification:** It checks if the request contains a valid JWT (JSON Web Token)—a secure digital ID card.
3. **Role Assignment:** If the token is valid, the middleware decodes it to find out if the user is a `CANDIDATE` or a `RECRUITER`. It attaches this user profile to the request.
4. **Pass-Through:** Finally, it allows the request to proceed to its intended destination. If the token is invalid, the middleware blocks the request and returns an "Unauthorized" error.

## Endpoint Logic Execution
Once a request passes the middleware, the specific endpoint file takes over. 

For example, when a recruiter calls the `GET /api/jobs` endpoint:
1. The function checks the user's role. 
2. It constructs an SQL query asking the database for a list of jobs.
3. It formats the data returned by the database. If the user is a Candidate, it hides sensitive information (like other people's final AI scores). If the user is a Recruiter, it provides the full data set.
4. It packages the data into a clean JSON response and sends it back to the frontend.

This modular, file-based approach ensures that the backend is incredibly organized. Each file has exactly one responsibility, making it easy to maintain and expand in the future.
