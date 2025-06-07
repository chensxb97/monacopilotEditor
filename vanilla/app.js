require.config({
    paths: {
        vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.0/min/vs',
    },
});

require(['vs/editor/editor.main'], function () {
    const editor = monaco.editor.create(document.getElementById('editor'), {
        value: '// Start coding...\n',
        language: 'javascript',
        theme: 'vs-dark',
    });

    const completion = monacopilot.registerCompletion(monaco, editor, {
        language: 'javascript',
        // URL to the API endpoint we'll create in server.js below
        endpoint: 'http://localhost:5000/code-completion',
    });

    window.addEventListener('beforeunload', () => {
        completion.deregister();
    });
});