const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.getSuggestions = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ success: false, message: 'Gemini API Key is missing in backend.' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const systemInstruction = `You are a helpful, expert financial advisor. Talk directly to the user in a conversational manner. Format your responses using clean, semantic HTML (like <p>, <ul>, <strong>) so it renders nicely on the frontend. Do NOT use markdown code blocks like \`\`\`html. Just raw HTML output.`;

        // Initialize chat with history
        const chat = model.startChat({
            history: history || [],
        });

        // Combine system instruction if this is the first message
        const finalMessage = (!history || history.length === 0) 
            ? `${systemInstruction}\n\nUser: ${message}` 
            : message;

        const result = await chat.sendMessage(finalMessage);
        let responseText = result.response.text();
        
        // Clean up markdown blocks if the AI still adds them
        responseText = responseText.replace(/```html/g, '').replace(/```/g, '').trim();

        res.json({ success: true, data: responseText });
    } catch (error) {
        console.error('Gemini API Error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};
