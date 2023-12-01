/* eslint-disable react/no-unknown-property */
import {Link} from 'react-router-dom'

import {BsHeart} from 'react-icons/bs'
import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'
import {FcLike} from 'react-icons/fc'
import './index.css'

const UserPostItem = props => {
  const {postItem, increaseLikeCount, decreaseLikeCount} = props

  const {
    comments,
    createdAt,
    likesCount,
    postDetails,
    postId,
    profilePic,
    userId,
    userName,
    likeStatus,
  } = postItem
  const {caption, imageUrl} = postDetails

  const onClickLikeIcon = () => {
    decreaseLikeCount(postId)
  }

  const onClickHeartIcon = () => {
    increaseLikeCount(postId)
  }

  return (
    <li testid="postItem" className="post-item-container">
      <div className="profile-pic-and-name-container">
        <div className="profile-image-container">
          <img
            src={profilePic}
            alt="post author profile"
            className="profile-logo-image"
          />
        </div>
        <Link to={`/users/${userId}`} className="profile-link">
          {' '}
          <h1 className="post-username-styling">{userName}</h1>
        </Link>
      </div>
      <img src={imageUrl} alt="post" className="post-image-style" />
      <div className="likes-icons-caption-and-comments-container">
        <div className="like-comment-and-share-icon-container">
          {likeStatus ? (
            <button
              className="like-buttons"
              type="button"
              onClick={onClickLikeIcon}
              testid="unLikeIcon"
              alt="unLikeButton"
            >
              <FcLike className="like-icon" />
            </button>
          ) : (
            <button
              className="like-buttons"
              type="button"
              onClick={onClickHeartIcon}
              testid="likeIcon"
              alt="likeButton"
            >
              <BsHeart className="heart-icon" />
            </button>
          )}
          <FaRegComment className="comment-icon" />
          <BiShareAlt className="share-icon" />
        </div>
        <p className="likes-count">{likesCount} likes</p>
        <p className="caption-style">{caption}</p>
        <ul className="comments-containers">
          {comments.map(each => (
            <li className="comment-item" key={each.userId}>
              <p className="username-in-comment">
                {each.userName}
                <span className="comment-styling">{each.comment}</span>
              </p>
            </li>
          ))}
        </ul>
        <p className="created-at-styling">{createdAt}</p>
      </div>
    </li>
  )
}

export default UserPostItem
