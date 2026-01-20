
// This file will simulate a backend service since we are running client-side only.
// In a real app, this would be an API endpoint.
// For this demo, we will use a server-side script or simply log the intention
// but since the user specifically asked to save to a JSON file, and we are in a web environment,
// we can't directly write to the file system from the browser.
// However, I can create a node script to handle this if I were running a backend,
// OR I can use the existing `process_questions.py` pattern or similar to "mock" this action
// by providing a downloadable JSON or using a local server if available.

// WAIT, I am an AI assistant with file system access. I can modify the file directly if the user asks me to "implement the feature".
// But the React app running in the browser CANNOT write to the file system directly.
// The user likely wants the FORM in the React app to *trigger* a save.
// Since this is a local dev environment, I will implement a "mock" service in the React app
// that perhaps logs to console, AND I will provide a way for the user (me) to actually save the data
// if I were automating it.

// BUT, the user said "新题目 数据放到 ... new_questions.json".
// Since the React app runs in the browser, it can't write to disk.
// I will implement a "Download JSON" feature OR
// I will assume the user might be okay with me creating a server-side handler if this was a full stack app.
// Given the context (local file editing), I'll implement a helper script `server.js` (using Express) to handle file writes?
// Or maybe just for now, I will modify the React code to *read* from it (if it could) and maybe use a simple
// method to append to it via a node script that I run?

// actually, the simplest way to satisfy "data items just like now" and "form to fill"
// is to make the form working.
// For the "saving" part, since I cannot make the browser write to disk without user interaction (download),
// I will create a simple Node.js server to handle the API request to save the file.
// This is the most robust way to actually "save to c:\...\new_questions.json" from a web page.

import fs from 'fs';
import path from 'path';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3001;
const DATA_FILE = String.raw`c:\Users\WZP10\OneDrive\桌面\trae_friend\src\data\new_questions.json`;

app.use(cors());
app.use(bodyParser.json());

// Ensure file exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
}

app.post('/api/questions', (req, res) => {
    try {
        const newQuestion = req.body;
        const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
        let questions = [];
        try {
            questions = JSON.parse(fileContent || '[]');
        } catch (e) {
            questions = [];
        }
        
        // Assign a new ID if not present (simple max + 1)
        if (!newQuestion.id) {
             const maxId = questions.reduce((max: number, q: any) => Math.max(max, q.id || 0), 0);
             newQuestion.id = maxId + 1;
        }

        questions.push(newQuestion);
        fs.writeFileSync(DATA_FILE, JSON.stringify(questions, null, 2), 'utf-8');
        
        console.log('Saved new question:', newQuestion);
        res.json({ success: true, question: newQuestion });
    } catch (error) {
        console.error('Error saving question:', error);
        res.status(500).json({ error: 'Failed to save question' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
