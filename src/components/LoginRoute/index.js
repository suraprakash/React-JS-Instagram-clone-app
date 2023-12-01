import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', showSubmitError: false, errorMsg: ''}

  onChangeUserName = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onLoginSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  onLoginFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  onSubmitUserCredentials = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const loginUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(loginUrl, options)
    const data = await response.json()
    if (response.ok) {
      this.onLoginSuccess(data.jwt_token)
    } else {
      this.onLoginFailure(data.error_msg)
    }
  }

  loginDetailsForm = () => {
    const {username, password, showSubmitError, errorMsg} = this.state
    return (
      <div className="logo-and-login-form-container">
        <img
          src="https://res.cloudinary.com/kalyankumar/image/upload/v1649413673/instashare/instashareLogo_tykspy.png"
          alt="website logo"
          className="instashare-logo"
        />
        <h1 className="instashare-title">Insta Share</h1>

        <form onSubmit={this.onSubmitUserCredentials}>
          <label htmlFor="username" className="credentials-description">
            USERNAME
          </label>
          <input
            className="input-credentials"
            type="text"
            value={username}
            onChange={this.onChangeUserName}
            placeholder="Username"
            id="username"
          />
          <label htmlFor="password" className="credentials-description">
            PASSWORD
          </label>
          <input
            className="input-credentials"
            value={password}
            onChange={this.onChangePassword}
            type="password"
            placeholder="Password"
            id="password"
          />
          {showSubmitError && <p className="error-msg">{errorMsg}</p>}
          <button className="login-button" type="submit">
            Login
          </button>
        </form>
      </div>
    )
  }

  render() {
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-page-container">
        <img
          src="https://res.cloudinary.com/kalyankumar/image/upload/v1649412170/instashare/loginimage_njgv90.png"
          alt="website login"
          className="login-image"
        />
        {this.loginDetailsForm()}
      </div>
    )
  }
}

export default Login
