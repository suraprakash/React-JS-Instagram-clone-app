/* eslint-disable react/no-unknown-property */
import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'
import './index.css'

const ProfileCard = props => {
  const {profileDetails, posts, stories, profileAlt, storyAlt, postAlt} = props

  const {
    followersCount,
    followingCount,
    postsCount,
    profilePic,
    userBio,
    userId,
    userName,
  } = profileDetails

  const noPostsView = () => (
    <div className="no-posts-container" testid="noPosts">
      <div className="camera-icon-container">
        <BiCamera className="camera-icon-style" />
      </div>
      <h1 className="no-posts-description">No Posts</h1>
    </div>
  )

  return (
    <div className="profile-card-container" testid="profile">
      <div className="profile-container">
        <h1 className="user-name-styling-small-screens" testid="username">
          {userName}
        </h1>
        <div className="profile-details-and-profile-pic-container">
          <img src={profilePic} alt={profileAlt} className="profile-image" />
          <div className="profile-name-id-and-follow-details-container">
            <h1 className="user-name-styling-medium-screens" testid="username">
              {userName}
            </h1>
            <div className="user-following-details-counter">
              <div className="counts-container">
                <p className="counts">{postsCount}</p>
                <p className="count-type">posts</p>
              </div>
              <div className="counts-container">
                <p className="counts">{followersCount}</p>
                <p className="count-type">followers</p>
              </div>
              <div className="counts-container">
                <p className="counts">{followingCount}</p>
                <p className="count-type">following</p>
              </div>
            </div>

            <p
              className="user-id-styling user-id-display-medium-screens"
              testid="userid"
            >
              {userId}
            </p>
            <p className="user-bio-medium-screens">{userBio}</p>
          </div>
        </div>
        <div className="user-id-and-bio-small-screens-container">
          <p
            className="user-id-styling user-id-display-small-screens"
            testid="userid"
          >
            {userId}
          </p>
          <p className="user-bio-small-screens">{userBio}</p>
        </div>
        <ul className="story-list-container" testid="myStoriesList">
          {stories.map(each => (
            <li key={each.id}>
              <div className="story-image-container">
                <img
                  src={each.image}
                  alt={storyAlt}
                  className="story-image-styling"
                />
              </div>
            </li>
          ))}
        </ul>
        <hr className="horizontal-line" />
        <div className="posts-icon-and-title-container">
          <BsGrid3X3 className="post-icon" />
          <h1 className="posts-title">Posts</h1>
        </div>
        {stories.length === 0 ? (
          noPostsView()
        ) : (
          <ul className="posts-list-container" testid="myPostsList">
            {posts.map(each => (
              <li key={each.id}>
                <img
                  src={each.image}
                  alt={postAlt}
                  className="post-image-styling"
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default ProfileCard
