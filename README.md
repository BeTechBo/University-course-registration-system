# Banner-10.0

Banner-10.0 is a **university course management system**.  
It is meant to give students a secure portal to create accounts with their university email, verify and log in, and search the course catalog using both basic and advanced filters.

> ⚠️ **Note:** The project currently has a **frontend** and a **backend** only.  
> There is **no `Makefile` / `make` workflow yet** – everything is run with `npm` commands.

---

## Project Overview

Banner-10.0 aims to replicate the core functionality of a typical university “Banner” system:

- Student registration using an official university email  
- Email verification & account activation  
- Secure login & logout with session management  
- Course catalog browsing  
- Basic and advanced course search  

Future sprints will extend this into a fuller course enrollment and administration system.

---

## Tech Stack

**Frontend**

- Vite  
- React  
- JavaScript  
- HTML / CSS  

**Backend**

- Node.js  
- Express.js  
- MongoDB (or another DB, depending on `server/config`)  
- REST-style JSON API  

---

## Repository Structure

```text
Banner-10.0/
  ├─ package.json           # Frontend package.json
  ├─ src/                   # Frontend React source
  ├─ public/                # Frontend static assets
  ├─ server/
  │   ├─ package.json       # Backend package.json
  │   ├─ server.js          # Express app entry point
  │   ├─ config/            # DB / environment config
  │   ├─ controllers/       # Route controllers
  │   ├─ middleware/        # Express middleware
  │   └─ models/ routes/    # Data models and routes
  └─ README.md
```
## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- npm (comes with Node)

---

## Setup

Clone the repository:

~~~bash
git clone <REPO_URL>
cd Banner-10.0
~~~

### Install frontend dependencies

~~~bash
npm install
~~~

### Install backend dependencies

~~~bash
cd server
npm install
cd ..
~~~

---

## Running the Project

> Exact script names may differ slightly depending on the `package.json`.  
> If they do, adjust the commands below to whatever exists under `"scripts"`.

### Start the backend (server)

In one terminal:

~~~bash
cd server
npm start        # or: npm run dev
~~~

This should start the Express server on a port defined in your backend config  
(for example `http://localhost:5000` or similar).

### Start the frontend (client)

In a second terminal (from the project root):

~~~bash
npm run dev
~~~

Vite will start the React dev server, usually at:

~~~text
http://localhost:5173
~~~

The frontend is configured to call the backend API (for example `http://localhost:5000/api/...`).

---

## Current Functionality

### Authentication

- Student **account creation** using a valid university email  
- **Email verification & activation** flow  
- **Secure login** for verified users only  
- **Logout & session management**  

### Course Search

- **Basic search** by course name or code  
- **Advanced search with filters** (e.g. department, level, or other attributes defined in the backend)  

---

## Example Usage Flow

1. Open the frontend in your browser (`npm run dev` → Vite URL).  
2. Create a **new student account** using a university email address.  
3. Complete the **verification step** (real email or simulated, depending on current implementation).  
4. Log in with the verified account.  
5. Use the **course search** UI:
   - Simple text search by course name/code.  
   - Apply advanced filters to narrow down the results.  

---

## Development Notes

- There is **no `Makefile`** in this project yet; please use only `npm` scripts for now.  
- If you add new scripts for frontend or backend, please document them in this README.  
- For new routes or models, keep the backend structure consistent (`controllers/`, `routes/`, `models/`).  

---

## Contributing

1. Create a new branch for your feature or bugfix.  
2. Implement your changes in the appropriate `src/` or `server/` folder.  
3. Update this `README.md` if you add new commands or change setup steps.  
4. Open a Pull Request and request review from the team.  

---

## License

> TODO: Add license information here (e.g. MIT, proprietary, etc.) once decided.
