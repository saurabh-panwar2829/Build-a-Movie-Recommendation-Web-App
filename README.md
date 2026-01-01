# 🎬 Movie Recommendation Web App

A premium, AI-powered movie recommendation system built with **FastAPI** and **React**. This application uses **Azure OpenAI** to provide personalized movie suggestions based on user preferences and maintains a history of recommendations using **SQLite**.

---

## ✨ Features

- 🧠 **AI Recommendations**: Personalized movie suggestions powered by Azure OpenAI (GPT-4).
- 📜 **History Tracking**: View your previous recommendations stored in a local SQLite database.
- 🎨 **Premium UI**: Modern, glassmorphic design featuring smooth animations with Framer Motion.
- 📱 **Responsive Design**: Fully responsive layout built with Tailwind CSS.
- ⚡ **Fast Performance**: Powered by Vite and FastAPI for a snappy user experience.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Database**: [SQLite](https://www.sqlite.org/index.html) with [SQLAlchemy](https://www.sqlalchemy.org/)
- **AI Integration**: [Azure OpenAI Service](https://azure.microsoft.com/en-us/products/ai-services/openai-service)
- **Environment**: Python 3.9+

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- Azure OpenAI API Credentials (Optional: Mock data is used if not provided)

### 1. Clone the Repository
```bash
git clone https://github.com/saurabh-panwar2829/Build-a-Movie-Recommendation-Web-App.git
cd Build-a-Movie-Recommendation-Web-App
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend` folder:
```env
AZURE_OPENAI_API_KEY=your_api_key
AZURE_OPENAI_ENDPOINT=your_endpoint
AZURE_OPENAI_DEPLOYMENT_NAME=your_deployment_name
AZURE_OPENAI_API_VERSION=2023-05-15
```

Run the backend:
```bash
python main.py
```
The API will be available at `http://localhost:8000`.

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
The app will be available at `http://localhost:5173`.

---

## 📁 Project Structure

```text
.
├── backend/            # FastAPI source code
│   ├── main.py         # Main API routes & DB logic
│   ├── requirements.txt
│   └── .env            # Environment variables
├── frontend/           # React source code
│   ├── src/            # Components & Logic
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

---

## 📝 License
This project is licensed under the MIT License.
