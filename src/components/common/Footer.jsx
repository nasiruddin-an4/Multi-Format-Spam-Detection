import { Link } from 'react-router-dom'
import Logo from './Logo'

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="container-custom mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <nav className="flex flex-wrap justify-center -mx-5 -my-2" aria-label="Footer">
          <div className="px-5 py-2">
            <Link to="/" className="text-base text-gray-500 hover:text-gray-900">
              Home
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link to="/detect" className="text-base text-gray-500 hover:text-gray-900">
              Detect Spam
            </Link>
          </div>
          <div className="px-5 py-2">
            <a href="#about" className="text-base text-gray-500 hover:text-gray-900">
              About
            </a>
          </div>
          <div className="px-5 py-2">
            <a href="#privacy" className="text-base text-gray-500 hover:text-gray-900">
              Privacy
            </a>
          </div>
          <div className="px-5 py-2">
            <a href="#terms" className="text-base text-gray-500 hover:text-gray-900">
              Terms
            </a>
          </div>
        </nav>
        <p className="mt-8 text-center text-base text-gray-400">
          &copy; {new Date().getFullYear()} Nasir and Razi. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer