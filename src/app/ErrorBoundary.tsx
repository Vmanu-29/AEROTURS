import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Suprimir silenciosamente errores de removeChild
    if (error.message?.includes('removeChild') && error.message?.includes('not a child')) {
      console.log('[Suppressed] DOM cleanup error from cmdk:', error.message);
      this.setState({ hasError: false, error: null });
      return;
    }
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error?.message?.includes('removeChild')) {
      // Renderizar la app normalmente si es el error conocido de removeChild
      return this.props.children;
    }

    return this.props.children;
  }
}
