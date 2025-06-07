import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { registerCompletion } from 'monacopilot';

function App() {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const editor = monaco.editor.create(editorRef.current, {
      value: '// Start coding...\n',
      language: 'javascript',
      theme: 'vs-dark',
    });

    const completion = registerCompletion(monaco, editor, {
      language: 'javascript',
      endpoint: 'http://localhost:5000/code-completion',
    });

    return () => {
      completion.deregister();
      editor.dispose();
    };
  }, []);

  return (
    <div className="App" style={{ padding: 20 }}>
      <h1>Monaco Editor + Monacopilot in CRA</h1>
      <div
        ref={editorRef}
        style={{ width: 800, height: 400, border: '1px solid #ccc' }}
      />
    </div>
  );
}

export default App;
