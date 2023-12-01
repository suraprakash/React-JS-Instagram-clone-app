/* eslint-disable react/no-unknown-property */
import {Component} from 'react'
import Cookies from 'js-cookie'
import LoaderView from '../Loader'

import './index.css'

import UserPostItem from '../UserPostItem'

const userPostsApiConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

class UserPosts extends Component {
  state = {
    userPostsList: [],
    userPostsApiStatus: userPostsApiConstants.initial,
  }

  componentDidMount() {
    this.fetchUserPosts()
  }

  updatePostsDataFormat = post => ({
    comments: post.comments.map(each => ({
      comment: each.comment,
      userId: each.user_id,
      userName: each.user_name,
    })),
    createdAt: post.created_at,
    likesCount: post.likes_count,
    postDetails: {
      caption: post.post_details.caption,
      imageUrl: post.post_details.image_url,
    },
    postId: post.post_id,
    profilePic: post.profile_pic,
    userId: post.user_id,
    userName: post.user_name,
    likeStatus: false,
  })

  fetchUserPosts = async () => {
    this.setState({userPostsApiStatus: userPostsApiConstants.inProgress})
    const userPostsUrl = 'https://apis.ccbp.in/insta-share/posts'
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
        userPostsApiStatus: userPostsApiConstants.success,
        userPostsList: updatedPostsDataFormat,
      })
    } else {
      this.setState({userPostsApiStatus: userPostsApiConstants.failure})
    }
  }

  decreaseLikeCount = async postId => {
    const {userPostsList} = this.state
    const token = Cookies.get('jwt_token')
    const postlikeUrl = `https://apis.ccbp.in/insta-share/posts/${postId}/like`

    const disLikedPost = userPostsList.filter(each => each.postId === postId)
    const updatedLikedPost = {...disLikedPost[0], likeStatus: false}
    const isDisLiked = {like_status: updatedLikedPost.likeStatus}
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(isDisLiked),
    }

    const response = await fetch(postlikeUrl, options)

    if (response.ok) {
      const updatedUserPostsList = userPostsList.map(each => {
        if (each.postId === postId) {
          const postDisLiked = {
            ...each,
            likeStatus: false,
            likesCount: each.likesCount - 1,
          }
          return postDisLiked
        }
        return each
      })
      this.setState({userPostsList: updatedUserPostsList})
    }
  }

  increaseLikeCount = async postId => {
    const {userPostsList} = this.state
    const token = Cookies.get('jwt_token')
    const postlikeUrl = `https://apis.ccbp.in/insta-share/posts/${postId}/like`

    const likedPost = userPostsList.filter(each => each.postId === postId)
    const updatedLikedPost = {...likedPost[0], likeStatus: true}
    const isLiked = {like_status: updatedLikedPost.likeStatus}
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(isLiked),
    }

    const response = await fetch(postlikeUrl, options)
    if (response.ok) {
      const updatedUserPostsList = userPostsList.map(each => {
        if (each.postId === postId) {
          const postLiked = {
            ...each,
            likeStatus: true,
            likesCount: each.likesCount + 1,
          }
          return postLiked
        }
        return each
      })
      this.setState({userPostsList: updatedUserPostsList})
    }
  }

  onSuccessUserPosts = () => {
    const {userPostsList} = this.state

    return (
      <ul className="post-list-container">
        {userPostsList.map(each => (
          <UserPostItem
            key={each.postId}
            postItem={each}
            increaseLikeCount={this.increaseLikeCount}
            decreaseLikeCount={this.decreaseLikeCount}
          />
        ))}
      </ul>
    )
  }

  onFailureUserPosts = () => (
    <div className="home-failure-view-container" testid="failureView">
      <img
        src="https://res.cloudinary.com/kalyankumar/image/upload/v1650354873/instashare/somethingWentWrong_hcvwkz.png"
        alt="failure view"
        className="home-failure-image"
      />
      <p className="home-failure-title">
        Something went wrong. Please try again
      </p>
      <button
        className="home-try-again-button"
        type="button"
        onClick={this.onClickTryAgainButton}
      >
        Try Again
      </button>
    </div>
  )

  onClickTryAgainButton = () => {
    const {userPostsList} = this.state
    this.fetchUserPosts()
    console.log(userPostsList)
  }

  renderUserPosts = () => {
    const {userPostsApiStatus} = this.state
    switch (userPostsApiStatus) {
      case userPostsApiConstants.inProgress:
        return <LoaderView />
      case userPostsApiConstants.failure:
        return this.onFailureUserPosts()
      case userPostsApiConstants.success:
        return this.onSuccessUserPosts()
      default:
        return null
    }
  }

  render() {
    return <div>{this.renderUserPosts()}</div>
  }
}

export default UserPosts
