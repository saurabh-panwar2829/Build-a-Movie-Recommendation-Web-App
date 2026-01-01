from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, DateTime, Text, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import datetime
import json
import os
from typing import List, Optional
from openai import OpenAI
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

# Database Setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./movies.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class RecommendationModel(Base):
    __tablename__ = "recommendations"
    id = Column(Integer, primary_key=True, index=True)
    user_input = Column(String, index=True)
    recommended_movies = Column(Text)  # JSON string
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

Base.metadata.create_all(bind=engine)

# Pydantic Schemas
class MoviePref(BaseModel):
    preference: str

class MovieInfo(BaseModel):
    title: str
    description: str
    reason: str

class RecommendationResponse(BaseModel):
    id: int
    user_input: str
    recommendations: List[MovieInfo]
    timestamp: datetime.datetime

# Azure OpenAI Client
client = None
if os.getenv("AZURE_OPENAI_API_KEY"):
    from openai import AzureOpenAI
    client = AzureOpenAI(
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),
        api_version=os.getenv("AZURE_OPENAI_API_VERSION", "2023-05-15"),
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
    )

app = FastAPI(title="Movie Recommendation API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/recommend", response_model=RecommendationResponse)
async def get_recommendation(pref: MoviePref, db: Session = Depends(get_db)):
    user_input = pref.preference
    
    try:
        deployment_name = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")
        if not client or not deployment_name:
            # Mock data if no Azure config
            recommendations = [
                MovieInfo(title="The Dark Knight", description="Batman faces the Joker.", reason="Classic action with a strong lead."),
                MovieInfo(title="Inception", description="Dreams within dreams.", reason="Mind-bending sci-fi."),
                MovieInfo(title="Parasite", description="A family cons their way into a rich house.", reason="Thrilling social commentary.")
            ]
        else:
            response = client.chat.completions.create(
                model=deployment_name,
                messages=[
                    {"role": "system", "content": "You are a movie recommendation assistant. Return 3-5 movies as a JSON list of objects with 'title', 'description', and 'reason' keys based on the user's preference."},
                    {"role": "user", "content": f"I like: {user_input}"}
                ],
                response_format={ "type": "json_object" }
            )
            data = json.loads(response.choices[0].message.content)
            # Handle possible nested key "movies" or similar from AI response
            raw_recommendations = data.get("movies", data.get("recommendations", list(data.values())[0] if isinstance(data, dict) and data else []))
            if not isinstance(raw_recommendations, list):
                raw_recommendations = [data] if isinstance(data, dict) else []
            
            recommendations = [MovieInfo(**m) for m in raw_recommendations[:5]]

        # Save to DB
        db_rec = RecommendationModel(
            user_input=user_input,
            recommended_movies=json.dumps([m.dict() for m in recommendations])
        )
        db.add(db_rec)
        db.commit()
        db.refresh(db_rec)

        return RecommendationResponse(
            id=db_rec.id,
            user_input=db_rec.user_input,
            recommendations=recommendations,
            timestamp=db_rec.timestamp
        )
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history", response_model=List[RecommendationResponse])
async def get_history(db: Session = Depends(get_db)):
    recs = db.query(RecommendationModel).order_by(RecommendationModel.timestamp.desc()).all()
    return [
        RecommendationResponse(
            id=r.id,
            user_input=r.user_input,
            recommendations=json.loads(r.recommended_movies),
            timestamp=r.timestamp
        ) for r in recs
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
