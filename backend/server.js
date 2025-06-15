require('dotenv').config()

const cors = require('cors')
const express = require('express')
const { CompletionCopilot } = require('monacopilot')

const app = express()
app.use(cors())
app.use(express.json())

const copilot = new CompletionCopilot(process.env.MISTRAL_API_KEY, {
    provider: 'mistral',
    model: 'codestral',
})

app.post('/code-completion', async (req, res) => {
    const metadata = req.body?.completionMetadata
    const { textBeforeCursor, textAfterCursor, language, technologies } = metadata
    console.log('Text Before Cursor: ', textBeforeCursor)
    try {
        const completion = await copilot.complete({
            body: {
                completionMetadata: {
                    textBeforeCursor,
                    textAfterCursor,
                    language,
                    technologies: technologies || ['Bosun'],
                },
                customPrompt: {
                    context: `You're working with ${language} expression language using the following datasource integrations ${technologies?.join(', ') || 'Bosun'}.`,
                    instruction: `Given the previous code as context, guess the objective and complete the code after the cursor with appropriate ${language} syntax and best practices.`,
                }
            }
        })
        console.log('Completion:', completion)
        res.json(completion)
    } catch (err) {
        console.error('[Completion Error]', err)
        res.status(500).json({ error: 'Failed to generate completion' })
    }
})
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`)
})