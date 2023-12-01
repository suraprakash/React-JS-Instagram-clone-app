import {Link} from 'react-router-dom'

import './index.css'

const NotFound = () => (
  <div className="not-found-page-container">
    <img
      src="https://res.cloudinary.com/kalyankumar/image/upload/v1650270480/instashare/pageNotFoundImage_ook6zf.png"
      alt="page not found"
      className="not-found-image"
    />
    <h1 className="not-found-title">Page Not Found</h1>
    <p className="not-found-description">
      we are sorry, the page you requested could not be found. Please go back to
      the homepage.
    </p>
    <Link to="/" className="home-page-link">
      <button className="home-page-button" type="button">
        Home Page
      </button>
    </Link>
  </div>
)

export default NotFound
