# Video Player Component

This project includes a customizable video player component called VideoPlayer. This component offers a range of features that enhance the video-watching experience. Below is a detailed description of how to use and configure the VideoPlayer component in your React application.

# Overview
The VideoPlayer component is designed to provide an interactive video player with several built-in controls such as play/pause, speed adjustment, full screen, theater mode, picture-in-picture, and caption support. It is flexible and allows you to enable or disable specific controls based on your requirements.

**Installation**
You can install the Video Player Component using npm:

`npm install video-player-react-lib`

**Usage**
Import the Component and Video File
First, import the VideoPlayer component and the video file you want to play.

```
import VideoPlayer from 'react-youtube-player';
import videoFile from './assets/video/Learn useRef in 11 Minutes.mp4';
Configure and Render the Component
Next, configure the component by passing the desired props and render it within your App component.

function App() {
  return (
    <div className="App">
      <VideoPlayer 
        speedbtnProp={true} 
        fullscreenProp={true}  
        theaterProp={true}
        pipProp={true}
        captionbtnProp={true}
        backwardBtn={false}
        forwardBtn={false}
        videoFile={videoFile}
        allowFrame={true}
        subtitleFile={'./assets/srt/Learn useRef in 11 Minutes.srt'}
      />
    </div>
  );
}

export default App;
```

**Props**
The VideoPlayer component accepts several props that allow you to customize its behavior:

**speedbtnProp**: Enables or disables the speed control button. Set to true to enable.

**fullscreenProp**: Enables or disables the full screen button. Set to true to enable.

**theaterProp**: Enables or disables the theater mode button. Set to true to enable.

**pipProp**: Enables or disables the picture-in-picture mode button. Set to true to enable.

**captionbtnProp**: Enables or disables the caption/subtitle button. This button allows users to upload subtitle files supporting .srt and .vtt.
**backwardBtn**: Enables or disables the backward seek button. Set to true to enable.

**forwardBtn**: Enables or disables the forward seek button. Set to true to enable.

**videoFile**: Specifies the video file to be played. This should be the path to the video file imported in your project.

**allowFrame**: Specifies whether the video can be framed within an iframe, providing a preview video image on mouse moving the timeline, just like YouTube. Set to false to disable.

**subtitleFile**: Specifies the default subtitle file, if any. This should be the path to the subtitle file imported in your project.

**LeftBackwardSvgIcon**: when an svg element is put here,it overrides the skipping backward default video icon allowing you to use your own customized icon.

**RightForwardSvgIcon**: when an svg element is put here,it overrides the skipping forward default video icon allowing you to use your own customized icon.

**Example**
In this example, the VideoPlayer component is configured with various control buttons enabled, including speed control, full screen, theater mode, picture-in-picture, and subtitle upload. The backward and forward seek buttons are disabled.

```
function App() {
  return (
    <div className="App">
      <VideoPlayer 
        speedbtnProp={true} 
        fullscreenProp={true}  
        theaterProp={true}
        pipProp={true}
        captionbtnProp={true}
        backwardBtn={false}
        forwardBtn={false}
        videoFile={videoFile}
        allowFrame={true}
        LeftBackwardSvgIcon={()=> //put svg icon here to skip video backwards, to replace the default}
        RightForwardSvgIcon={()=> //put svg icon here to skip video forward, to replace the default}
        subtitleFile={'./assets/srt/Learn useRef in 11 Minutes.srt'}
      />
    </div>
  );
}

export default App;
```
**Conclusion**
The VideoPlayer component is a versatile and customizable video player for React applications. By adjusting its props, you can tailor the video player to fit the specific needs of your project. Whether you need basic play/pause functionality or advanced features like picture-in-picture and theater mode, VideoPlayer provides a comprehensive solution for video playback in your React app.

**Contributing**
We welcome contributions from the community! If you would like to contribute to the development of this project, please follow these 

**steps**:

**Fork the repository**:
`git clone https://github.com/VictorAjadi/video-player-react-lib.git`

**Navigate to the workspace folder**:
`cd workspace`

**Install the dependencies**:
`npm install`

**Run the development server**:
`npm run dev`

Please make sure to update tests as appropriate and follow the contributing guidelines when submitting pull requests.

License
This project is licensed under the MIT License. See the LICENSE file for details.