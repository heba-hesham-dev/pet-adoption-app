# Pet Adoption App

A mobile app for adopting pets from a shelter, or offering your own pet for adoption. Designed in Figma and built end to end: React Native front end and a Node.js + MongoDB backend.

**[Live demo](https://pet-adoption-app-server.vercel.app)** · API: [pet-adoption-api](https://pet-adoption-api-ten.vercel.app)

> The app is made for phones, so the live demo looks best when opened on a phone.
> The UI/UX design and Figma prototype are in my **[Design Portfolio](https://claude.ai/artifact/4MHNpoHnHKavu3Lv2Bv99Y)**.

## What it does

- **Browse pets:** dogs, cats and other pets, each with a profile (age, health, who they're good with, and more).
- **Favorites:** save pets for later. Favorites are kept on the device, no account needed.
- **Request to adopt:** fill in a short form and pick a visit date and time. The request is saved in the database and a confirmation email is sent to the user.
- **Add a pet:** offer a pet for adoption with up to 5 photos and its details. Photos are uploaded to the cloud, the post is saved in the database, and a confirmation email is sent. The shelter reviews posts before they appear in the app.

## Tech stack

**Front end**
- React Native with **Expo** (SDK 58) and **Expo Router**
- TypeScript
- React Context + AsyncStorage for favorites
- expo-image-picker (camera and gallery) and expo-image-manipulator (shrinks photos before upload)

**Backend** (`server/` folder)
- **Node.js** + **Express** REST API
- **MongoDB Atlas** with **Mongoose** (schemas and validation)
- **Multer** to receive photos + **Cloudinary** to store them
- **Nodemailer** (Gmail) for confirmation emails

**Hosting:** the app (web build) and the API are deployed as two projects on **Vercel**.

## API

| Method | Route | What it does |
| --- | --- | --- |
| `POST` | `/api/requests` | Saves an adoption request and emails the user |
| `POST` | `/api/pets` | Uploads the photos, saves the pet post and emails the user |

## Project structure

```
src/
  app/          screens (Expo Router): home, pet profile, request to adopt, favorites, add a pet
  components/   reusable UI (buttons, pet cards, form parts, success screen)
  constants/    colors, fonts, API address
  context/      favorites
  data/         the shelter's pets
server/
  index.js      Express app and routes
  models/       Mongoose models: Request, PetPost
  upload.js     photo upload (Multer + Cloudinary)
  email.js      confirmation emails (Nodemailer)
```

## Run locally

**App**

```
npm install
npx expo start
```

Press `w` to open it in the browser, or scan the QR code with Expo Go. To use your own server, add a `.env` file in the project folder:

```
EXPO_PUBLIC_API_URL=http://YOUR_COMPUTER_IP:3000
```

**Server**

```
cd server
npm install
npm run dev
```

Copy `server/.env.example` to `server/.env` and fill in your MongoDB, Gmail App Password and Cloudinary keys.

## About

Designed and built by **Heba Hesham**: from the Figma design to the database.
