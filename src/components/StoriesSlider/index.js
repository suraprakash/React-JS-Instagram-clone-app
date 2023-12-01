import Slider from 'react-slick'

import './index.css'

const StoriesSlider = props => {
  const {userStories} = props
  const settings = {
    dots: false,
    slidesToShow: 7,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
    ],
  }

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {userStories.map(eachUser => (
          <div
            key={eachUser.userId}
            className="user-story-image-and-name-container"
          >
            <img
              src={eachUser.storyUrl}
              alt="user story"
              className="user-story-image"
            />
            <h1 className="user-name">{eachUser.userName}</h1>
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default StoriesSlider
