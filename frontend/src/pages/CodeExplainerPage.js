import React from 'react';
import CodeExplainer from '../components/codeexplainer/CodeExplainer';


export default function CodeExplainerPage() {
  return (
    <div className="code-page-wrapper">
      <div className="code-header">
        <h1>AI Code Explainer</h1>
        <p>Paste your snippet and let AI decode the logic for you.</p>
      </div>
      <CodeExplainer />
    </div>
  );
}