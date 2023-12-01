import './index.css'

const FailureView = props => {
  const {children} = props
  return (
    <div className="failure-view-container">
      <img
        src="https://res.cloudinary.com/kalyankumar/image/upload/v1650256709/instashare/failureImage_kbieza.png"
        alt="failure view"
        className="failure-image"
      />
      <p className="failure-view-description">
        Something went wrong. Please try again
      </p>
      {children}
    </div>
  )
}

export default FailureView
