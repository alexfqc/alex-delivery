## Getting Started

Please make sure you have the version 22.11.0 or higher of [node](https://nodejs.org/en) installed in your computer.
If you are using a mac or linux you can use nvm (there is a `.nvmrc` file at the project).

You'll need to have [docker](https://www.docker.com/) installed in your machine to run the postgres image.

First, install your node packages by running:

```bash
npm install
```

Now you'll need to create a file named `.env.local` at the root folder of the project and add the following env vars:

```bash
OPENAI_API_KEY=
```

Notice that you'll need to create an account at openai website and charge at least 5 dollars to use openai api.

Create your docker image for postgres by running the command:

```bash
docker-compose up -d
```

NOTE: make sure your are not running another postgres application on port 5432

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application working.
