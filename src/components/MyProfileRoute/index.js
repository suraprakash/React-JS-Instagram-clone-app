/* eslint-disable react/no-unknown-property */
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import ProfileCard from '../ProfileCard'

import './index.css'

const myProfileApiConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class MyProfile extends Component {
  state = {
    myProfileDetails: {},
    myStories: [],
    myPosts: [],
    myProfileApiStatus: myProfileApiConstants.initial,
  }

  componentDidMount() {
    this.getMyProfileData()
  }

  componentWillUnmount() {
    this.getMyProfileData()
  }

  myProfileDataFormatUpdation = user => ({
    followersCount: user.followers_count,
    followingCount: user.following_count,
    postsCount: user.posts_count,
    profilePic: user.profile_pic,
    userBio: user.user_bio,
    userId: user.user_id,
    userName: user.user_name,
  })

  getMyProfileData = async () => {
    const token = Cookies.get('jwt_token')
    const myProfileUrl = 'https://apis.ccbp.in/insta-share/my-profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(myProfileUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedMyProfileDataFormat = this.myProfileDataFormatUpdation(
        data.profile,
      )

      this.setState({
        myProfileApiStatus: myProfileApiConstants.success,
        myProfileDetails: updatedMyProfileDataFormat,
        myStories: data.profile.stories,
        myPosts: data.profile.posts,
      })
    } else {
      this.setState({myProfileApiStatus: myProfileApiConstants.failure})
    }
  }

  myProfileOnSuccess = () => {
    const {myProfileDetails, myStories, myPosts} = this.state
    return (
      <ProfileCard
        profileDetails={myProfileDetails}
        stories={myStories}
        posts={myPosts}
        profileAlt="my profile"
        postAlt="my post"
        storyAlt="my story"
      />
    )
  }

  onClickTryFetchMyProfile = () => {
    this.getMyProfileData()
  }

  myProfileOnFailure = () => (
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
        onClick={this.onClickTryFetchMyProfile}
      >
        Try Again
      </button>
    </div>
  )

  myProfileLoading = () => (
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

  renderMyProfilePage = () => {
    const {myProfileApiStatus} = this.state
    switch (myProfileApiStatus) {
      case myProfileApiConstants.inProgress:
        return this.myProfileLoading()
      case myProfileApiConstants.success:
        return this.myProfileOnSuccess()
      case myProfileApiConstants.failure:
        return this.myProfileOnFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <div testid="myProfileRoute">
        <Header />
        {this.renderMyProfilePage()}
      </div>
    )
  }
}

export default MyProfile
