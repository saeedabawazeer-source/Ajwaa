import React from 'react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: 20, background: '#fee2e2', color: '#991b1b', height: '100vh', fontFamily: 'monospace' }}>
                    <h1>Something went wrong.</h1>
                    <h3 style={{ marginTop: 20 }}>Error:</h3>
                    <pre>{this.state.error && this.state.error.toString()}</pre>
                    <h3 style={{ marginTop: 20 }}>Component Stack:</h3>
                    <pre style={{ overflow: 'auto' }}>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
                    <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ padding: 10, marginTop: 20, background: 'black', color: 'white', border: 'none', borderRadius: 8 }}>
                        CLEAR DATA & RELOAD
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
