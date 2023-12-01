import {Component} from 'react'
import Cookies from 'js-cookie'
import LoaderView from '../Loader'

import StoriesSlider from '../StoriesSlider'

const userStoryApiConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class UserStories extends Component {
  state = {
    userStoriesList: [],
    isLoading: false,
  }

  componentDidMount() {
    this.getUserStories()
  }

  getUserStories = async () => {
    this.setState({isLoading: true})
    const token = Cookies.get('jwt_token')
    const userStoriesUrl = 'https://apis.ccbp.in/insta-share/stories'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    const response = await fetch(userStoriesUrl, options)
    if (response.ok) {
      const data = await response.json()

      const updatedDataFormat = data.users_stories.map(eachStory => ({
        userId: eachStory.user_id,
        userName: eachStory.user_name,
        storyUrl: eachStory.story_url,
      }))
      this.setState({
        userStoriesList: updatedDataFormat,
        isLoading: false,
      })
    } else {
      this.setState({isLoading: true})
    }
  }

  renderUserStories = () => {
    const {userStoriesApiStatus} = this.state
    switch (userStoriesApiStatus) {
      case userStoryApiConstants.inProgress:
        return <loaderView />
      case userStoryApiConstants.success:
        return this.onSuccessUserStories()

      default:
        return null
    }
  }

  onSuccessUserStories = () => {
    const {userStoriesList} = this.state
    return <StoriesSlider userStories={userStoriesList} />
  }

  render() {
    const {isLoading, userStoriesList} = this.state

    return (
      <>
        {isLoading ? (
          <LoaderView />
        ) : (
          <StoriesSlider userStories={userStoriesList} />
        )}
      </>
    )
  }
}

export default UserStories
