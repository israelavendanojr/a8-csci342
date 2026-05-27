[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/DEhIkMyK)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=23906964&assignment_repo_type=AssignmentRepo)

# Assignment 8 — CSCI 342

## Live URLs

- **Client:** https://a8-csci342.vercel.app
- **Server:** https://a8-csci342.onrender.com
- **Server health check:** https://a8-csci342.onrender.com/api/health

## Local Setup

1. Clone the repo
2. Copy `server/.env.example` to `server/.env` and fill in `MONGO_URI` + `JWT_SECRET`
3. From the root: `npm install` (client) and `cd server && npm install` (server)
4. Two terminals: `npm run dev` (root, client) + `npm run dev` (server)
5. Open http://localhost:5173

## What I Learned During Deployment

The deployment process was comparable to other times I've deployed. I have used both Vercel and Render before and it was about what I expected. But using MongoDB and Atlas was supringly easy to connect to and use so I am glad it was also seamless there. I am curious how deployment differs when you are handling arcitecture on cloud.
