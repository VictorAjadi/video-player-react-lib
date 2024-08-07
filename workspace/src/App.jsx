import VideoPlayer from "./components/VideoPlayer"
import videoFile from "./video/Learn useRef in 11 Minutes.mp4"
function App() {

  return (
    <div>
    <VideoPlayer 

          speedbtnProp={true} 

          fullscreenProp={true}  

          theaterProp={true}

          pipProp={true}

          captionbtnProp={false}

          backwardBtn={false}

          forwardBtn={false}

          videoFile={videoFile}

          allowFrame={true}

/*           LeftBackwardSvgIcon={()=> //put svg icon here to skip video backwards}

          RightForwardSvgIcon={()=> //put svg icon here to skip video forward} */

/*           subtitleFile={'./assets/srt/Learn useRef in 11 Minutes.srt'}
 */
          />
    </div>
  )
}

export default App
