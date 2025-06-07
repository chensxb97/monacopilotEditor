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
});

app.post('/code-completion', async (req, res) => {
    const completion = await copilot.complete({ body: req.body });
    res.json(completion);
});

app.post('/bosun-code-completion', async (req, res) => {
    const { prompt } = req.body;

    const completion = await copilot.complete({
        body: {
            messages: [
                {
                    role: 'system',
                    content: `You are a helpful code assistant that specializes in the Bosun alerting rule language. 
You help users write alert definitions, templates, Prometheus expressions inside q(...), and correctly apply crit/warn severities. 
Suggest only Bosun-valid syntax and avoid unrelated programming languages.`,
                },
                {
                    role: 'user',
                    content: prompt,
                }
            ],
            temperature: 0.2,
            max_tokens: 200,
        }
    });

    res.json(completion);
});


app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});