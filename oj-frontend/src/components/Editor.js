import { Editor } from '@monaco-editor/react';

export default function TextEditor() {
  const handleEditorChange = (value, event) => {
    console.log('Here is the current value:', value);
  };

  return (
    <>
      <Editor
        height="50vh"
        defaultLanguage="cpp"
        theme="vs-dark"
        defaultValue="// Write code here"
        onChange={handleEditorChange}
      />
    </>
  );
}
