Here is the fixed, clean, and fully formatted `README.md` code. I have corrected the code block syntax, removed the conversational filler text, and ensured the author name is updated to **Rohit Kumar Prasad**.

You can copy the entire block below and paste it directly into your `README.md` file.

```markdown
# 🎬 Reelify – Movie Discovery Web App

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

> **Reelify** is a modern movie discovery web application built with React, Vite, and Tailwind CSS, powered by the TMDB API. It allows users to explore movies, view detailed information, watch trailers, search in real-time, and filter Bollywood movies with a single toggle.

---

## 🚀 Features

### 🌟 Discovery
- **Trending & Popular:** Browse the top-rated and most popular movies globally.
- **New Releases:** Stay updated with movies currently in theaters.
- **Upcoming:** Get a sneak peek at movies releasing soon.

### 🇮🇳 Special Feature: Bollywood Filter
- **One-Click Toggle:** Instantly filter movies to show only **Hindi (Bollywood)** content.
- **Smart Filtering:** Works across Home sections, Upcoming, New Releases, Search, and Similar Movies.

### 🔍 Search & Details
- **Real-time Search:** Instant results as you type.
- **Immersive Details Page:**
  - Cinematic banner with gradient fade.
  - Official trailers, Cast list, Ratings, and Runtime.
  - "Similar Movies" recommendations.

### 🎨 UI/UX
- **Fully Responsive:** Optimized for Mobile, Tablet, and Desktop.
- **Smooth Animations:** Fade-in scroll effects and logo-based loading animations.
- **Dark Themed UI:** Cinematic feel with clean typography.

---

## 🛠️ Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Frontend Framework** | React (Vite) |
| **Styling** | Tailwind CSS + Custom CSS |
| **Routing** | React Router DOM |
| **State Management** | React Context API |
| **API** | TMDB (The Movie Database) |
| **HTTP Client** | Axios |

---

## 📂 Project Structure

```text
movie-app/
│
├── public/
│   └── logo.png
│
├── src/
│   ├── api/
│   │   └── tmdb.js          # API configurations
│   │
│   ├── components/
│   │   ├── Navbar.jsx       # Responsive navigation
│   │   ├── MovieCard.jsx    # Reusable movie component
│   │   ├── MovieGrid.jsx    # Grid layout logic
│   │   ├── Loader.jsx       # Animated loader
│   │
│   ├── pages/
│   │   ├── Home.jsx         # Landing page
│   │   ├── Search.jsx       # Search results
│   │   ├── MovieDetails.jsx # Individual movie info
│   │
│   ├── context/
│   │   └── BollywoodContext.jsx # Global state for filter
│   │
│   ├── styles/
│   │   └── main.css         # Custom global styles
│   │
│   ├── App.jsx
│   └── main.jsx
│
└── package.json

```

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### 1️⃣ Clone the repository

```bash
git clone [https://github.com/your-username/reelify.git](https://github.com/your-username/reelify.git)
cd reelify

```

### 2️⃣ Install dependencies

```bash
npm install

```

### 3️⃣ Configure TMDB API

Get your free API Key from [The Movie Database (TMDB)](https://www.themoviedb.org/documentation/api).

Open `src/api/tmdb.js` and add your key:

```javascript
// src/api/tmdb.js
export const API_KEY = "YOUR_TMDB_API_KEY_HERE";

```

> **Pro Tip:** For better security, consider using an `.env` file (e.g., `VITE_TMDB_API_KEY`) instead of hardcoding credentials.

### 4️⃣ Start the development server

```bash
npm run dev

```

Open your browser and navigate to `http://localhost:5173`.

---

## 🧠 Learning Outcomes

Building Reelify provided hands-on experience with:

* **API Integration:** Fetching and handling complex data from TMDB using Axios.
* **Advanced Hooks:** Implementing `useEffect`, `useState`, and `useContext` for state management.
* **Debouncing:** Optimizing search performance to reduce API calls.
* **Responsive Design:** Utilizing Tailwind CSS for a seamless mobile-first approach.
* **State Management:** Using Context API to manage the global "Bollywood" toggle state.

---

## 📌 Future Enhancements

* [ ] User Authentication (Login/Signup)
* [ ] Favorites / Watchlist functionality
* [ ] Genre-based filtering
* [ ] Pagination for search results
* [ ] Actor profile pages
* [ ] Dark/Light mode toggle

---

## 👨‍💻 Author

**Rohit Kumar Prasad**

* **BCA** (Bachelor of Computer Applications)
* *Movie App Project – React & API Integration*

---

## 📄 License

This project is for educational purposes and uses the TMDB API but is not endorsed or certified by TMDB.

```

```
