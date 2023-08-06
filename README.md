
# Online coding platform

An online platform where you're able to practise coding and solve many different kinds of coding problems.

It is developed using the sphere-engine API, and you can use it to build submissions and run different test cases for your solution.


## Tech Stack

**Frontend:** React,TailwindCSS

**Server:** Node, Express, JWT, Socket.io, Nodemailer


## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

* Run server and frontend seprately.

### Server setup

```bash
  cd server
```

Create environment variables in ```.env``` file.

```bash
PORT=5000

MONGODB_URI
JWT_SECRET

SPHERE_SECRET
SPHERE_ENDPOINT
```
Sphere engine documentation : https://docs.sphere-engine.com/index

Install dependencies

```bash
  npm install
```

Run the server

```bash
  nodemon index.js
```

### Frontend dashboard setup

```bash
  cd dashboard
```

Configure base URL

```src/config.js```

```bash
  const API_BASE_URL = <Add base url here , default : localhost:5000/api/>

```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```
## Features

- Light/dark mode toggle
- Live previews
- Fullscreen mode
- Cross platform


## Screenshots

![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)


## Demo

Insert gif or link to demo


## 🚀 About Me
I'm a full stack developer...


## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://seraj.swiftcoder.in/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/serajj)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/)


## Support

For support, email seraj.dev@gmail.com .

