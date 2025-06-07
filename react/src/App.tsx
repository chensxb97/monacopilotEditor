import React, { useEffect, useRef } from 'react'
import * as monaco from 'monaco-editor'
import { registerCompletion } from 'monacopilot'

function App() {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!editorRef.current) return

    monaco.languages.register({ id: 'bosun' })
    monaco.languages.setMonarchTokensProvider('bosun', {
      tokenizer: {
        root: [
          // Keywords
          [/\b(alert|template|crit|warn|ok|unknown|macro|lookup|len|avg|min|max|sum|count|diff|change|abs|pct_diff|over|foreach|groupBy)\b/, 'keyword'],

          // Prometheus-style query wrapper
          [/\bq\(/, { token: 'function', next: '@query' }],

          // Numbers
          [/\b\d+(\.\d+)?\b/, 'number'],

          // Strings
          [/"/, { token: 'string.quote', next: '@string' }],

          // Identifiers
          [/[a-zA-Z_][\w-]*/, 'identifier'],

          // Brackets and operators
          [/[{}[\]()]/, '@brackets'],
          [/[=><!]+/, 'operator'],
        ],

        string: [
          [/[^"]+/, 'string'],
          [/"/, { token: 'string.quote', next: '@pop' }],
        ],

        query: [
          [/[^)]+/, 'query-content'],
          [/\)/, { token: 'function', next: '@pop' }],
        ],
      },
    })

    monaco.editor.defineTheme('vs-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '569cd6' },
        { token: 'number', foreground: 'b5cea8' },
        { token: 'string', foreground: 'ce9178' },
        { token: 'identifier', foreground: 'dcdcaa' },
        { token: 'operator', foreground: 'd4d4d4' },
        { token: 'brackets', foreground: 'd4d4d4' },
        { token: 'query-content', foreground: '9cdcfe' },
      ],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.foreground': '#d4d4d4',
      },
    })


    const javascriptEditor = monaco.editor.create(editorRef.current, {
      value: '// Start coding in javascript!\n',
      language: 'javascript',
      theme: 'vs-dark',
    })

    const jsCompletion = registerCompletion(monaco, javascriptEditor, {
      language: 'javascript',
      endpoint: 'http://localhost:5000/code-completion',
    })

    const bosunEditor = monaco.editor.create(editorRef.current, {
      value: '// Start coding in Bosun...!\n',
      language: 'bosun',
      theme: 'vs-dark',
    })

    const bosunCompletion = registerCompletion(monaco, bosunEditor, {
      language: 'bosun',
      endpoint: 'http://localhost:5000/bosun-code-completion',
    })

    return () => {
      jsCompletion.deregister()
      bosunCompletion.deregister()
      javascriptEditor.dispose()
      bosunEditor.dispose()
    }
  }, [])

  return (
    <div className="App" style={{ padding: 20 }}>
      <h1>Monaco Editor + Monacopilot in CRA</h1>
      <div
        ref={editorRef}
        style={{ width: 800, height: 400, border: '1px solid #ccc' }}
      />
    </div>
  )
}

export default App
