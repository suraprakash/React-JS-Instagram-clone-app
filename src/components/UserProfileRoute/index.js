/* eslint-disable react/no-unknown-property */
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import ProfileCard from '../ProfileCard'

const userProfileApiConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class UserProfile extends Component {
  state = {
    userProfileDetails: {},
    userStories: [],
    userPosts: [],
    userProfileApiStatus: userProfileApiConstants.initial,
  }

  componentDidMount() {
    this.getUserProfileDetails()
  }

  componentWillUnmount() {
    this.getUserProfileDetails()
  }

  userProfileDataFormatUpdation = user => ({
    followersCount: user.followers_count,
    followingCount: user.following_count,
    postsCount: user.posts_count,
    profilePic: user.profile_pic,
    userBio: user.user_bio,
    userId: user.user_id,
    userName: user.user_name,
  })

  getUserProfileDetails = async () => {
    this.setState({userProfileApiStatus: userProfileApiConstants.inProgress})
    const {match} = this.props

    const {params} = match
    const {userId} = params
    const token = Cookies.get('jwt_token')
    const userProfileDetailsUrl = `https://apis.ccbp.in/insta-share/users/${userId}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(userProfileDetailsUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedUserProfileDataFormat = this.userProfileDataFormatUpdation(
        data.user_details,
      )

      this.setState({
        userProfileApiStatus: userProfileApiConstants.success,
        userProfileDetails: updatedUserProfileDataFormat,
        userStories: data.user_details.stories,
        userPosts: data.user_details.posts,
      })
    } else {
      this.setState({userProfileApiStatus: userProfileApiConstants.failure})
    }
  }

  userProfileOnSuccess = () => {
    const {userProfileDetails, userStories, userPosts} = this.state
    return (
      <ProfileCard
        profileDetails={userProfileDetails}
        stories={userStories}
        posts={userPosts}
        profileAlt="user profile"
        postAlt="user post"
        storyAlt="user story"
      />
    )
  }

  onClickTryFetchUserProfile = () => {
    this.getUserProfileDetails()
  }

  userProfileOnFailure = () => (
    <div className="failure-view-container">
      <img
        src="https://res.cloudinary.com/kalyankumar/image/upload/v1650256709/instashare/failureImage_kbieza.png"
        alt="failure view"
        className="failure-image"
      />
      <p className="failure-view-description">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        className="try-again-button"
        onClick={this.onClickTryFetchUserProfile}
      >
        Try Again
      </button>
    </div>
  )

  userProfileOnLoading = () => (
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

  renderUserProfilePage = () => {
    const {userProfileApiStatus} = this.state
    switch (userProfileApiStatus) {
      case userProfileApiConstants.inProgress:
        return this.userProfileOnLoading()
      case userProfileApiConstants.success:
        return this.userProfileOnSuccess()
      case userProfileApiConstants.failure:
        return this.userProfileOnFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderUserProfilePage()}
      </>
    )
  }
}

export default UserProfile
