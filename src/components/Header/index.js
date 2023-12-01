/* eslint-disable react/no-unknown-property */
import {Component} from 'react'
import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {BiMenu} from 'react-icons/bi'
import {FaSearch} from 'react-icons/fa'
import {AiFillCloseCircle} from 'react-icons/ai'

import './index.css'

const searchPostsApiConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Header extends Component {
  state = {
    displayMenu: false,
    searchPostsList: [],
    searchPostsApiStatus: searchPostsApiConstants.initial,
  }

  getSearchResults = async () => {
    const {searchInput} = this.props
    this.setState({searchPostsApiStatus: searchPostsApiConstants.inProgress})
    const userPostsUrl = `https://apis.ccbp.in/insta-share/posts?search=${searchInput}`
    const token = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(userPostsUrl, options)
    if (response.ok) {
      const data = await response.json()

      const updatedPostsDataFormat = data.posts.map(each =>
        this.updatePostsDataFormat(each),
      )

      this.setState({
        searchPostsApiStatus: searchPostsApiConstants.success,
        searchPostsList: updatedPostsDataFormat,
      })
    } else {
      this.setState({searchPostsApiStatus: searchPostsApiConstants.failure})
    }
  }

  onClickSearchButton = () => {
    const {onClickingSearchButton} = this.props
    onClickingSearchButton()
  }

  // To logout from the account
  onClickLogoutButton = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  optionsListAndSearchInputContainer = () => (
    <>
      {this.renderSearchInput()}
      <ul className="header-options-container">
        <Link to="/" className="link-style">
          {' '}
          <li className="options-style">Home</li>
        </Link>
        <Link to="/my-profile" className="link-style">
          {' '}
          <li className="options-style">Profile</li>
        </Link>

        <li className="button-list-item">
          <button
            type="button"
            className="logout-button"
            onClick={this.onClickLogoutButton}
          >
            Logout
          </button>
        </li>
      </ul>
    </>
  )

  onClickMenuIcon = () => {
    this.setState({displayMenu: true})
  }

  onClickCloseIcon = () => {
    this.setState({displayMenu: false})
  }

  smallerDevicesMenuIcon = () => (
    <button
      testid="menuIcon"
      type="button"
      className="menu-button"
      onClick={this.onClickMenuIcon}
      alt="menuButton"
    >
      <BiMenu className="menu-icon" />
    </button>
  )

  smallerDevicesMenu = () => (
    <ul className="smaller-devices-header-options-container">
      <Link to="/" className="link-style">
        {' '}
        <li className="options-style">Home</li>
      </Link>
      <Link to="/my-profile" className="link-style">
        {' '}
        <li className="options-style">Profile</li>
      </Link>

      <li className="button-list-item">
        <button
          type="button"
          className="logout-button"
          onClick={this.onClickLogoutButton}
        >
          Logout
        </button>
      </li>
      <li>
        <button
          testid="closeIcon"
          type="button"
          className="close-button"
          onClick={this.onClickCloseIcon}
          alt="closeButton"
        >
          <AiFillCloseCircle className="close-icon" />
        </button>
      </li>
    </ul>
  )

  onChangeSearchInput = event => {
    const {onChangingSearchInput} = this.props
    onChangingSearchInput(event)
  }

  renderSearchInput = () => {
    const {searchInput} = this.props
    return (
      <div className="search-input-and-icon-container">
        <input
          type="search"
          value={searchInput}
          placeholder="Search Caption"
          onChange={this.onChangeSearchInput}
        />

        <button
          className="search-button"
          type="button"
          onClick={this.onClickSearchButton}
          testid="searchIcon"
          alt="searchButton"
        >
          <FaSearch />
        </button>
      </div>
    )
  }

  render() {
    const {displayMenu} = this.state
    return (
      <>
        <nav className="navbar-container">
          <Link to="/" className="link-style">
            <div className="logo-and-title-container">
              <img
                src="https://res.cloudinary.com/kalyankumar/image/upload/v1649413673/instashare/instashareLogo_tykspy.png"
                alt="website logo"
                className="header-instashare-logo"
              />
              <h1 className="header-instashare-title">Insta Share</h1>
            </div>
          </Link>
          {this.optionsListAndSearchInputContainer()}
          {this.smallerDevicesMenuIcon()}
        </nav>
        {displayMenu && this.smallerDevicesMenu()}
      </>
    )
  }
}

export default withRouter(Header)
