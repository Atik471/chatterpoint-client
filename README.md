# ChatterPoint - a forum website

ChatterPoint is a forum website where users can create, view, comment on, and interact with posts. The platform allows users to register, log in, vote on posts, comment, and share content across social media.

## Features

- **User Authentication**: Users can register, log in, and manage their accounts.
- **Post Creation**: Users can create posts with titles and descriptions.
- **Upvote/Downvote**: Users can vote on posts to show their approval or disapproval.
- **Comments**: Users can comment on posts and engage in discussions.
- **Social Media Sharing**: Posts can be shared on social media platforms (Facebook, Twitter, LinkedIn, WhatsApp).
- **Admin Panel**: Admins can manage user roles and content.
- **Responsive Design**: The platform is fully responsive, adapting to different screen sizes.

## Tech Stack

- **Frontend**: 
  - React.js
  - Tailwind CSS
  - React Router for navigation
  - React Helmet for managing the document head
  - Social Media Share Buttons (React Share)

- **Backend**: 
  - Node.js
  - Express.js
  - MongoDB (Mongoose for ODM)
  - JWT for authentication and session management

## Live Demo

Check out the live site: **[ChatterPoint](https://chatterpoint.web.app)**

## Admin Credentials

Use the following credentials to access the admin panel:

- **Email**: `admin@gmail.com`
- **Password**: `Admin12`

## 🛠️ Setup & Installation

Follow these steps to get ChatterPoint up and running locally:

### 1. **Clone the Repository**

```bash
git clone https://github.com/your-username/chatterpoint.git
cd chatterpoint
```

### 2. **Install Dependencies**

Make sure you have **Node.js (v18+)** installed. Then, install all required packages:

```bash
npm install
```

### 3. **Environment Variables**

Create a `.env` file in the root directory and add your environment-specific variables. Example:

```env
VITE_API_URL=https://your-backend-api.com
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

> 🔐 **Do not commit `.env` to version control.**

### 4. **Run the Development Server**

```bash
npm run dev
```

The app will be available at:

```
http://localhost:5173
```

### 5. **Build for Production**

```bash
npm run build
```

### 6. **Preview Production Build**

```bash
npm run preview
```