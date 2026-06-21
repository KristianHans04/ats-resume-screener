# Frontend Architecture

The CSAS Engine frontend is the user-facing portion of the application. It is built using modern web development standards to ensure a fast, responsive, and secure experience for both Candidates and Recruiters.

## The Technology Stack
- **React 18:** A JavaScript library used for building user interfaces using discrete, reusable "components."
- **Vite:** A build tool that dramatically speeds up the development process and optimizes the final code for production.
- **Tailwind CSS:** A utility-first styling framework used to create the "Minimalist Semantic" design theme without writing massive, messy CSS files.
- **React Router:** A library used to handle navigation between different pages without forcing the browser to reload.

## Application Structure and Routing
The frontend is logically separated into two distinct "worlds": The Candidate Portal and the Recruiter Portal.

Inside `src/routes.jsx`, the system defines a strict route tree. It utilizes a "Protected Route" mechanism. 
- If a user tries to access `/recruiter/command-center` but is not logged in, the Protected Route intercepts them and redirects them to the Login page.
- Once authenticated, Candidates are restricted to the `/candidate/*` routes, and Recruiters are restricted to the `/recruiter/*` routes. This prevents data leakage and ensures users only see interfaces relevant to their role.

## Component Hierarchy
The UI is built using nested components. For example, a Recruiter's view is not one massive file. 
- It starts with a `RecruiterLayout` component (which contains the top navigation bar and sidebar).
- Inside that layout, it renders a specific "Page View" component, like `CommandCenterView` or `SemanticProfileView`.
- Inside the Page View, it renders smaller components, like a `JobCard` or a `SemanticGapHighlighter`.

This modular component design makes the codebase highly maintainable. If a button needs to be changed, developers only have to update the specific button component, and the change automatically applies everywhere that button is used.

## State Management and API Communication
To display data, the frontend must communicate with the backend API.
- The system uses a centralized `AuthContext` to manage the user's login state globally.
- When a Candidate navigates to their Dashboard, a React component "mounts" (loads onto the screen). 
- Upon mounting, it triggers an asynchronous `fetch` request to the backend API (`/api/jobs`).
- The frontend waits for the JSON response from the backend. Once received, it saves that data into its local "State."
- The React framework detects the change in state and instantly updates the visual UI to display the list of jobs to the user.
