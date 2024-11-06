# New App

## Overview

New App is a fun and interactive web application where users can generate, save, and enjoy jokes. The app allows users to generate new jokes using AI, save their favorite jokes, and explore additional features such as generating images, converting jokes to speech, and reading markdown stories.

With accessibility in mind, New App includes tools to enhance usability for blind or visually impaired users, ensuring an inclusive experience for everyone.

No login or registration is required—you can start enjoying the app right away!

## User Journeys

### 1. Add a New Joke

1. **Access the App**: Open New App in your web browser.
2. **Navigate to Add Joke Section**: On the main page, locate the "Add New Joke" section.
3. **Enter Joke Details**: Input the joke setup and punchline in the provided text fields.
4. **Save Joke**: Click the "Save Joke" button to save your joke. The joke will be added to the joke list displayed on the page.

### 2. Generate a Joke Using AI

1. **Generate Joke**: In the "Add New Joke" section, click on the "Generate Joke" button.
2. **Wait for Generation**: The app will generate a new joke using AI and populate the setup and punchline fields.
3. **Save Generated Joke**: If you like the joke, click the "Save Joke" button to save it to the list.

### 3. View Joke List

1. **Navigate to Joke List**: On the main page, find the "Joke List" section.
2. **Browse Jokes**: Scroll through the saved jokes.
3. **Accessibility Features**: The list is navigable via keyboard, and screen readers can read the jokes aloud thanks to ARIA labels and semantic HTML.

### 4. Additional Features

#### Generate Image

1. **Click Generate Image**: In the "Additional Features" section, click the "Generate Image" button.
2. **View Image**: An AI-generated image related to humor will appear below.
3. **Accessibility**: Images include descriptive alt text for screen readers.

#### Text to Speech

1. **Ensure Joke is Present**: Make sure there is a joke in the setup and punchline fields.
2. **Click Text to Speech**: Click the "Text to Speech" button.
3. **Listen to Joke**: An audio player will appear, allowing you to listen to the joke.
4. **Accessibility**: Audio controls are accessible via keyboard and screen readers.

#### Generate Markdown Story

1. **Click Generate Markdown**: Click the "Generate Markdown" button.
2. **Read Story**: A funny story in markdown format will be displayed.
3. **Accessibility**: The story is formatted for easy reading, and screen readers can read the content seamlessly.

## External APIs and Services

- **AI Joke Generation**: Utilizes an AI service to generate jokes based on prompts.
- **Image Generation**: Uses an AI service to create images from text prompts.
- **Text to Speech**: Converts joke text into speech audio files.
- **Markdown Story Generation**: Generates humorous stories in markdown format using AI.

## Accessibility Features

- **Screen Reader Support**: All interactive elements have ARIA labels, and semantic HTML is used throughout the app.
- **Keyboard Navigation**: Buttons and controls can be navigated and activated using the keyboard.
- **Alt Text for Images**: Images include descriptive alt text for users relying on screen readers.
- **Accessible Forms**: Input fields are labeled appropriately for assistive technologies.

## Notes

- The app is free to use.
- For any assistance or feedback, please visit [ZAPT](https://www.zapt.ai).

## Required Environment Variables

Create a `.env` file in the root of your project and include the following variables:

- `VITE_PUBLIC_SENTRY_DSN` - Your Sentry DSN for error logging.
- `VITE_PUBLIC_APP_ENV` - The environment (e.g., development, production).
- `VITE_PUBLIC_APP_ID` - Your ZAPT app ID.
- `NEON_DB_URL` - Your Neon database URL.
- `PROJECT_ID` - Your project ID.

These variables are necessary for the application to function correctly.