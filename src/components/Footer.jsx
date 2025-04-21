const Footer = () => {
    return (
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">CampusMarket</h3>
              <p className="text-gray-300">The trusted marketplace for students to buy and sell items on campus.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="text-gray-300 hover:text-white">Home</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">Browse Categories</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">Sell an Item</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">My Account</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <p className="text-gray-300">Have questions or feedback? Reach out to our team.</p>
              <a href="mailto:support@campusmarket.com" className="text-blue-400 hover:text-blue-300 mt-2 inline-block">
                support@campusmarket.com
              </a>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} CampusMarket. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
  }
  
  export default Footer
  