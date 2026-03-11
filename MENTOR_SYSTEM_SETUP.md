# Mentor Recommendation System - Setup & Integration Guide

## Overview
The mentor recommendation system uses TF-IDF vectorization to match students with mentors based on skill compatibility. When a new alumni registers, they're automatically added to the mentor database and the model is retrained.

## System Architecture

### Python Components

#### 1. **mentorRecomandation.py** (Model Training)
- **Location**: `Backend/Python/Models/mentorRecomandation.py`
- **Purpose**: Trains the mentor recommendation model
- **Input**: `datasets/mentor.csv`
- **Output**: `Models/mentor_model.pkl`
- **Process**:
  - Reads mentor profiles from CSV
  - Creates TF-IDF vectorizer from mentor skills
  - Generates vector matrix for all mentors
  - Saves vectorizer, matrix, and mentor data to pickle file

#### 2. **predictsmentor.py** (Mentor Prediction)
- **Location**: `Backend/Python/controller/predictsmentor.py`
- **Purpose**: Returns top 5 mentors matching student skills
- **Usage**: `python predictsmentor.py "Python Django REST API"`
- **Output**: JSON array of mentor profiles with match percentages
- **Returns**:
  ```json
  [
    {
      "userId": 1,
      "username": "mentor_name",
      "skills": "Python Django REST API",
      "jobRole": "Backend Developer",
      "match_percent": 92.5
    }
  ]
  ```

#### 3. **mentorModelUpdate.py** (Model Retraining)
- **Location**: `Backend/Python/controller/mentorModelUpdate.py`
- **Purpose**: Adds new alumni to mentor database and retrains model
- **Usage**: `python mentorModelUpdate.py "userId" "username" "skills" "jobRole"`
- **Example**: `python mentorModelUpdate.py "123" "john_doe" "Python Django REST" "Backend Developer"`
- **Process**:
  1. Reads current mentor.csv
  2. Adds new alumni record
  3. Saves updated CSV
  4. Retrains the TF-IDF model
  5. Updates mentor_model.pkl
  6. Returns success/error status

### CSV Format
**mentor.csv** columns:
```
userId,username,skills,jobRole
1,user1,Spring Boot Express Python MongoDB,Backend Developer
2,user2,Linux Systems Design Bash Security,System Engineer
```

### Node.js Components

#### 1. **mentorController.js** (Mentor Endpoints)
- **Location**: `Backend/Node/controller/mentorController.js`
- **Functions**:
  - `recommendMentors(req, res)`: Get mentor recommendations
  - `getMentorProfile(req, res)`: Get single mentor profile

#### 2. **mentorRoutes.js** (Mentor Routes)
- **Location**: `Backend/Node/routes/mentorRoutes.js`
- **Endpoints**:
  - `POST /api/mentors/recommend`: Get recommendations
  - `GET /api/mentors/:mentorId`: Get mentor profile

#### 3. **alumniController.js** (Updated)
- **New Function**: `retrainMentorModel()` helper
- **Modified Function**: `createAlumni()` now:
  1. Saves alumni to database
  2. Calls `mentorModelUpdate.py` to add to mentor.csv
  3. Retrains the mentor model
  4. Returns result (non-blocking)

## API Endpoints

### 1. Get Mentor Recommendations
**Endpoint**: `POST /api/mentors/recommend`

**Request**:
```json
{
  "skills": ["Python", "Django", "REST API", "PostgreSQL"]
}
```

**Response**:
```json
{
  "success": true,
  "message": "Mentor recommendations retrieved successfully",
  "data": [
    {
      "userId": 17,
      "username": "mentor_17",
      "skills": "PostgreSQL Spring Boot Django Node.js",
      "jobRole": "Backend Developer",
      "match_percent": 89.75
    }
  ],
  "count": 5
}
```

### 2. Register New Alumni
**Endpoint**: `POST /api/alumni`

**Request**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password",
  "age": 22,
  "department": "Computer Science",
  "skils": ["Python", "Django", "REST API"],
  "jobRole": "Backend Developer",
  "currentCompany": "Tech Corp",
  "graduationYear": 2022,
  "bio": "Passionate about backend development"
}
```

**Process**:
1. Alumni saved to database
2. Automatically added to mentor.csv
3. Mentor model retrained with new alumni
4. New alumni becomes available as a mentor to future students

## Setup Instructions

### 1. Initial Setup (One-time)

```bash
# Navigate to Models directory
cd Backend/Python/Models

# Train the initial mentor model
python mentorRecomandation.py
# Output: "Mentor model trained and saved ✅"

# Verify mentor_model.pkl was created
ls -la mentor_model.pkl  # On Linux/Mac
dir mentor_model.pkl     # On Windows
```

### 2. Testing the System

**Test Mentor Recommendation**:
```bash
cd Backend/Python/controller
python predictsmentor.py "Python Django REST API"
```

**Test Adding New Alumni**:
```bash
python mentorModelUpdate.py "999" "test_mentor" "Python Django REST API" "Backend Developer"
```

### 3. Node.js Integration

Ensure all new imports are added to `server.js`:
```javascript
import mentorRoutes from './routes/mentorRoutes.js';
// ...
app.use('/api/mentors', mentorRoutes);
```

## Workflow Example

### Student Request Flow
1. **Frontend**: Student selects their skills (e.g., "Python, Django, REST API")
2. **Backend**: POST request to `/api/mentors/recommend`
3. **Node.js**: mentorController calls Python script
4. **Python**: predictsmentor.py finds top 5 matching mentors
5. **Frontend**: Display matched mentors with profile info and match percentage

### Alumni Registration Flow
1. **Frontend**: New alumni fills registration form with skills and job role
2. **Backend**: POST request to `/api/alumni`
3. **Node.js**: alumniController saves to MongoDB
4. **Node.js**: Calls `retrainMentorModel()` helper
5. **Python**: mentorModelUpdate.py:
   - Adds alumni to mentor.csv
   - Retrains TF-IDF model
   - Updates mentor_model.pkl
6. **New Alumni**: Now available as a mentor to other students

## Project Structure After Setup
```
Backend/
  Node/
    controller/
      alumniController.js (UPDATED - adds mentor retraining)
      mentorController.js (NEW)
    routes/
      mentorRoutes.js (NEW)
    server.js (UPDATED - imports mentor routes)
  Python/
    Models/
      jobRecomandation.py
      mentorRecomandation.py (NEW)
      mentor_model.pkl (CREATED AFTER TRAINING)
    controller/
      predictsJob.py
      predictsmentor.py (NEW)
      mentorModelUpdate.py (NEW)
    datasets/
      jobs.csv
      mentor.csv (UPDATED by mentorModelUpdate.py)
```

## Dependencies

### Python
- pandas (for CSV handling)
- scikit-learn (TfidfVectorizer, cosine_similarity)
- pickle (built-in)

### Node.js
- express
- mongoose
- bcrypt
- child_process (built-in - for spawning Python)

### Install Python dependencies
```bash
pip install pandas scikit-learn
```

## Troubleshooting

### Issue: "mentor_model.pkl not found"
**Solution**: Run the training script:
```bash
python Backend/Python/Models/mentorRecomandation.py
```

### Issue: "Python script not found" in Node.js
**Solution**: Verify file paths in mentorController.js match your directory structure

### Issue: Mentor model not updating after alumni registration
**Solution**: Check MongoDB connection and mentor.csv write permissions

### Issue: No mentors returned for valid skills
**Solution**: Mentors in CSV may not have matching skills. Add more mentor profiles with diverse skills.

## Performance Notes

- **Model Size**: mentor_model.pkl ≈ 10-50 KB (small file)
- **Training Time**: < 1 second for up to 500+ mentors
- **Prediction Time**: < 100ms per request
- **Scalability**: Current TF-IDF approach scales to 10,000+ mentors efficiently

## Future Enhancements

1. **Advanced Matching**:
   - Consider company, experience level, availability
   - Use collaborative filtering for better matches

2. **Rating System**:
   - Students rate mentor sessions
   - Use ratings to boost mentor ranking

3. **Scheduling Integration**:
   - Check mentor availability
   - Auto-schedule mentor sessions

4. **Content-Based Filtering**:
   - Consider job role similarity
   - Weight recent skills higher

## File Change Summary

### Modified Files
- `Backend/Node/controller/alumniController.js` - Added mentor retraining on registration
- `Backend/Node/server.js` - Added mentor routes import

### New Files
- `Backend/Python/Models/mentorRecomandation.py` - Model training script
- `Backend/Python/controller/predictsmentor.py` - Mentor prediction API
- `Backend/Python/controller/mentorModelUpdate.py` - Alumni addition and retraining
- `Backend/Node/controller/mentorController.js` - Mentor endpoints
- `Backend/Node/routes/mentorRoutes.js` - Mentor route definitions

### Generated Files
- `Backend/Python/Models/mentor_model.pkl` - Trained model (auto-generated)
- `Backend/Python/datasets/mentor.csv` - Updated with new alumni (auto-updated)
