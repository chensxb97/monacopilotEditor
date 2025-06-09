require('dotenv').config();

const cors = require('cors');
const express = require('express');
const { CompletionCopilot } = require('monacopilot');

const app = express();
app.use(cors());
app.use(express.json());

const copilot = new CompletionCopilot(process.env.MISTRAL_API_KEY, {
    provider: 'mistral',
    model: 'codestral',
})

const bosunCopilot = new CompletionCopilot(undefined, {
    model: async prompt => {
        const response = await fetch(
            'https://api.mistral.ai/v1/chat/completions',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'codestral-latest',
                    messages: [
                        { role: 'system', content: 'You are a helpful coding assistant for the Bosun expression langauge.' },
                        {
                            role: 'user',
                            content: `${prompt.instruction}\n\n${prompt.fileContent}`,
                        },
                    ],
                    temperature: 0.2,
                    max_tokens: 256,
                }),
            },
        );

        const data = await response.json();
        return {
            text: data.choices[0].message.content,
        };
    },
});

app.post('/code-completion', async (req, res) => {
    const completion = await copilot.complete({ body: req.body });
    console.log(completion);
    res.json(completion);
});

app.post('/code-completion/bosun', async (req, res) => {
    const completion = await bosunCopilot.complete({ body: req.body });
    console.log(completion);
    res.json(completion);
});

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});