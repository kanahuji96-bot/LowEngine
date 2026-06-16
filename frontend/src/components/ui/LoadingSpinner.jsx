const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizeClass = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }[size] || 'w-8 h-8'

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClass} border-2 border-dark-500 border-t-primary rounded-full animate-spin`} />
      {text && <p className="text-sm text-gray-400">{text}</p>}
    </div>
  )
}

export const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <LoadingSpinner size="lg" text="Memuat..." />
  </div>
)

export default LoadingSpinner
