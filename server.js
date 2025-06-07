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

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});