## PowerBI Assistant

## How can I edit this code?

There are several ways of editing your application.

Follow these steps:  

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

**More**
- Python microservice is abandoned as it used to get the json responses back from API hosted on render.com but,response was too big and wasn't fitting in free tier
- Python embedding is used now, the streamlit app is hosted on https://pbi-scrapper.onrender.com and rendered into the iframe in react app [ CORS/CSS templating is handled in config gile of streamlit app ]
