/* eslint-disable react/no-unknown-property */
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import UserStories from '../UserStories'
import UserPosts from '../UserPosts'
import SearchPosts from '../SearchPosts'

import './index.css'

const searchPostsApiConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    searchInput: '',
    searchPostsApiStatus: searchPostsApiConstants.initial,
    displaySearchPosts: false,
    searchPostsList: [],
  }

  onChangingSearchInput = event => {
    this.setState({searchInput: event.target.value})
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

  getSearchResults = async () => {
    const {searchInput} = this.state
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
      console.log(data)
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

  onClickingSearchButton = () => {
    this.getSearchResults()
    this.setState({displaySearchPosts: true})
  }

  increaseLikeCount = async postId => {
    const {searchPostsList} = this.state
    const token = Cookies.get('jwt_token')
    const postLikeUrl = `https://apis.ccbp.in/insta-share/posts/${postId}/like`

    const likedPost = searchPostsList.filter(each => each.postId === postId)
    const updatedLikedPost = {...likedPost[0], likeStatus: true}
    const isLiked = {like_status: updatedLikedPost.likeStatus}
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(isLiked),
    }
    const response = await fetch(postLikeUrl, options)
    if (response.ok) {
      const updatedUserPostsList = searchPostsList.map(each => {
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
      this.setState({searchPostsList: updatedUserPostsList})
    }
  }

  decreaseLikeCount = async postId => {
    const {searchPostsList} = this.state
    const token = Cookies.get('jwt_token')
    const postLikeUrl = `https://apis.ccbp.in/insta-share/posts/${postId}/like`

    const disLikedPost = searchPostsList.filter(each => each.postId === postId)
    const updatedLikedPost = {...disLikedPost[0], likeStatus: false}
    const isDisLiked = {like_status: updatedLikedPost.likeStatus}
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(isDisLiked),
    }

    const response = await fetch(postLikeUrl, options)

    if (response.ok) {
      const updatedUserPostsList = searchPostsList.map(each => {
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
      this.setState({searchPostsList: updatedUserPostsList})
    }
  }

  searchNotFound = () => (
    <div className="search-not-found-container">
      <img
        src="https://res.cloudinary.com/kalyankumar/image/upload/v1650463355/instashare/searchNotFound_txpcj0.png"
        className="search-not-found-image"
        alt="search not found"
      />
      <h1 className="search-not-found-heading">Search Not Found</h1>
      <p className="search-not-found-description">
        Try different keyword or search again
      </p>
    </div>
  )

  onSuccessSearchPosts = () => {
    const {searchPostsList} = this.state
    const searchPostsLength = searchPostsList.length
    return (
      <>
        {searchPostsLength > 0 ? (
          <SearchPosts
            searchPostsList={searchPostsList}
            increaseLikeCount={this.increaseLikeCount}
            decreaseLikeCount={this.decreaseLikeCount}
          />
        ) : (
          this.searchNotFound()
        )}
      </>
    )
  }

  onLoadingSearchPosts = () => (
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

  onFailureSearchPosts = () => (
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
    this.getSearchResults()
  }

  renderSearchResults = () => {
    const {searchPostsApiStatus} = this.state
    switch (searchPostsApiStatus) {
      case searchPostsApiConstants.inProgress:
        return this.onLoadingSearchPosts()
      case searchPostsApiConstants.failure:
        return this.onFailureSearchPosts()
      case searchPostsApiConstants.success:
        return this.onSuccessSearchPosts()
      default:
        return null
    }
  }

  render() {
    const {searchInput, displaySearchPosts} = this.state

    return (
      <>
        <Header
          searchInput={searchInput}
          onChangingSearchInput={this.onChangingSearchInput}
          onClickingSearchButton={this.onClickingSearchButton}
        />
        <div className="home-page-container">
          {displaySearchPosts ? (
            this.renderSearchResults()
          ) : (
            <>
              <UserStories />
              <UserPosts />
            </>
          )}
        </div>
      </>
    )
  }
}

export default Home
