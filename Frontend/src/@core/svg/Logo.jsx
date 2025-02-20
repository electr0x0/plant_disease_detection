'use client'

const Logo = ({ className = 'text-2xl text-primary', ...props }) => {
  return (
    <svg
      className={className}
      width='40'
      height='40'
      viewBox='0 0 40 40'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      {/* Paste your SVG path data here */}
      <path d='M20 5C15 5 10 10 10 15C10 25 20 35 20 35C20 35 30 25 30 15C30 10 25 5 20 5Z' fill='currentColor'/>
      <path d='M25 15C25 16.6569 23.6569 18 22 18C20.3431 18 19 16.6569 19 15C19 13.3431 20.3431 12 22 12C23.6569 12 25 13.3431 25 15Z' fill='currentColor'/>
    </svg>
  )
}

export default Logo
