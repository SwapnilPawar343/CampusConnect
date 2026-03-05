import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get mentor recommendations based on student skills
 * @param {Array<string>} skills - Student skills list
 * @returns {Promise<Array>} - Top 5 matching mentors
 */
const getMentorRecommendations = (skills) => {
    return new Promise((resolve, reject) => {
        const pythonScriptPath = path.join(__dirname, '../..', 'Python/controller/predictsmentor.py');
        
        // Create skill string for Python script
        const skillsString = Array.isArray(skills) ? skills.join(' ') : skills;
        
        const python = spawn('python', [pythonScriptPath, skillsString]);
        
        let output = '';
        let errorOutput = '';
        
        python.stdout.on('data', (data) => {
            output += data.toString();
        });
        
        python.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });
        
        python.on('close', (code) => {
            if (code === 0) {
                try {
                    const result = JSON.parse(output);
                    resolve(result);
                } catch (e) {
                    reject(new Error(`Failed to parse Python output: ${output}`));
                }
            } else {
                reject(new Error(`Python script failed: ${errorOutput}`));
            }
        });
    });
};

/**
 * Recommendation endpoint - returns top 5 mentors matching student skills
 */
const recommendMentors = async (req, res) => {
    try {
        const { skills } = req.body;
        
        if (!skills || (Array.isArray(skills) && skills.length === 0)) {
            return res.status(400).json({
                message: "Skills required",
                required: ["skills"],
                example: { skills: ["Python", "Django", "REST API"] }
            });
        }
        
        const recommendations = await getMentorRecommendations(skills);
        
        res.status(200).json({
            success: true,
            message: "Mentor recommendations retrieved successfully",
            data: recommendations,
            count: recommendations.length
        });
    } catch (error) {
        console.error('Error getting mentor recommendations:', error);
        res.status(500).json({
            success: false,
            message: "Failed to get mentor recommendations",
            error: error.message
        });
    }
};

/**
 * Get single mentor profile by ID
 */
const getMentorProfile = async (req, res) => {
    try {
        const { mentorId } = req.params;
        
        if (!mentorId) {
            return res.status(400).json({
                message: "Mentor ID required"
            });
        }
        
        // This would fetch from your mentor database
        // For now, return a placeholder
        res.status(200).json({
            success: true,
            message: "Mentor profile retrieved successfully",
            mentorId: mentorId
        });
    } catch (error) {
        console.error('Error getting mentor profile:', error);
        res.status(500).json({
            success: false,
            message: "Failed to get mentor profile",
            error: error.message
        });
    }
};

export { recommendMentors, getMentorProfile };
