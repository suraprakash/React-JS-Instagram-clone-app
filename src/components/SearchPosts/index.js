import UserPostItem from '../UserPostItem'
import './index.css'

const SearchPosts = props => {
  const {searchPostsList, increaseLikeCount, decreaseLikeCount} = props
  const onSuccessUserPosts = () => (
    <div className="search-posts-page-container">
      <h1 className="search-result-title">Search Results</h1>
      <ul className="post-list-container">
        {searchPostsList.map(each => (
          <UserPostItem
            key={each.postId}
            postItem={each}
            increaseLikeCount={increaseLikeCount}
            decreaseLikeCount={decreaseLikeCount}
          />
        ))}
      </ul>
    </div>
  )

  return <>{onSuccessUserPosts()}</>
}

export default SearchPosts
