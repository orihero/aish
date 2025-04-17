declare module '@/components/LoadingSpinner' {
  const LoadingSpinner: () => JSX.Element;
  export default LoadingSpinner;
}

declare module '@/components/ErrorMessage' {
  const ErrorMessage: (props: { message: string }) => JSX.Element;
  export default ErrorMessage;
} 