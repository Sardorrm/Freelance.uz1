import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

class AppErrorBoundary extends React.Component<React.PropsWithChildren, { hasError: boolean; message: string }> {
  state = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown) {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : String(error),
    };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    console.error('Freelance.uz render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7fb', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ width: '100%', maxWidth: 520, padding: 24, borderRadius: 20, background: '#fff', border: '1px solid #e5e7eb', boxShadow: '0 10px 30px rgba(15,23,42,.08)' }}>
            <h1 style={{ margin: 0, fontSize: 22, color: '#111827' }}>Freelance.uz</h1>
            <p style={{ margin: '12px 0', color: '#4b5563' }}>Ilova yuklanishida xatolik yuz berdi. Sahifani yangilang.</p>
            <button onClick={() => window.location.reload()} style={{ border: 0, borderRadius: 12, padding: '11px 16px', background: '#4f46e5', color: '#fff', fontWeight: 700 }}>Qayta yuklash</button>
            {this.state.message && <details style={{ marginTop: 16, color: '#6b7280', fontSize: 12 }}><summary>Xatolik tafsiloti</summary><pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.message}</pre></details>}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>,
);
