import { Search, ShoppingBag, Users, Star, ArrowRight } from "lucide-react"
import Navbar from "./Navbar";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-transparent sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Buy and sell items</span>
                  <span className="block text-blue-500">on your campus</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  The easiest way for students to buy, sell, and discover items on campus. Join thousands of students
                  already using CampusMarket!
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 md:py-4 md:text-lg md:px-10 transition-colors duration-300">
                      Get Started
                    </button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10 transition-colors duration-300">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80"
            alt="Students on campus"
          />
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-500 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to buy and sell
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our platform makes it easy to find what you need and sell what you don't.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <Search className="h-6 w-6" />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Easy Search</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Find exactly what you're looking for with our powerful search and filtering options.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <Users className="h-6 w-6" />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Student Verified</h3>
                  <p className="mt-2 text-base text-gray-500">
                    All users are verified students, creating a safe and trusted community.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <Star className="h-6 w-6" />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Personalized Recommendations</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Discover items you'll love with our smart recommendation system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="py-12 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-500 font-semibold tracking-wide uppercase">How It Works</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Simple, fast, and student-friendly
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Get started in minutes and start buying or selling right away.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-500 text-2xl font-bold">
                  1
                </div>
                <div className="mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Create an account</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Sign up with your student email to verify your campus affiliation.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-500 text-2xl font-bold">
                  2
                </div>
                <div className="mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">List or browse items</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Post items you want to sell or browse what others are offering.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-500 text-2xl font-bold">
                  3
                </div>
                <div className="mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Connect and exchange</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Message other students and arrange to meet on campus for the exchange.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-500 font-semibold tracking-wide uppercase">Testimonials</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Students love CampusMarket
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Hear what other students have to say about their experience.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-500 font-bold">
                    J
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Jamie S.</h3>
                    <p className="text-sm text-gray-500">Sophomore, Engineering</p>
                  </div>
                </div>
                <p className="text-base text-gray-600">
                  "I found my textbooks for half the price of the campus bookstore. This site is a game-changer for
                  budget-conscious students!"
                </p>
                <div className="mt-2 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-500 font-bold">
                    M
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Michael T.</h3>
                    <p className="text-sm text-gray-500">Senior, Business</p>
                  </div>
                </div>
                <p className="text-base text-gray-600">
                  "Sold my old laptop in less than a day. The process was super easy and I met the buyer right on
                  campus. Highly recommend!"
                </p>
                <div className="mt-2 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-500 font-bold">
                    A
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Aisha K.</h3>
                    <p className="text-sm text-gray-500">Freshman, Arts</p>
                  </div>
                </div>
                <p className="text-base text-gray-600">
                  "As a new student, I was able to furnish my dorm room affordably thanks to CampusMarket. The
                  recommendations were spot on!"
                </p>
                <div className="mt-2 flex">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                  <Star className="h-5 w-5 text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-500">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-blue-100">Join your campus marketplace today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <button className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors duration-300">
                Sign up now
                <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
              </button>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <button className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300">
                Learn more
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 hover:text-blue-500 transition-colors duration-300">
                About
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 hover:text-blue-500 transition-colors duration-300">
                Features
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 hover:text-blue-500 transition-colors duration-300">
                Privacy
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 hover:text-blue-500 transition-colors duration-300">
                Terms
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 hover:text-blue-500 transition-colors duration-300">
                Contact
              </a>
            </div>
          </nav>
          <div className="mt-8 flex justify-center space-x-6">
            {/* Social Media Icons */}
            <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
              <span className="sr-only">Instagram</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; {new Date().getFullYear()} CampusMarket. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
