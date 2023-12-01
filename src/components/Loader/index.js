/* eslint-disable react/no-unknown-property */
import Loader from 'react-loader-spinner'

const LoaderView = () => (
  <div className="loader-container" testid="loader">
    <Loader
      type="TailSpin"
      className="load-spinner"
      color="#4094EF"
      height={50}
      width={50}
    />
  </div>
)

export default LoaderView
