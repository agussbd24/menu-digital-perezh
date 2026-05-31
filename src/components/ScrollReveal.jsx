import { useInView } from '../hooks/useInView.js'

export default function ScrollReveal({ children, className = '', delay = 0 }) {
  const [ref, isInView] = useInView({ threshold: 0.1, rootMargin: '0px 0px -30px 0px' })

  return (
    <div
      ref={ref}
      className={`transition-all duration-600 ease-out ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
