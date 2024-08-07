import 'bootstrap'; // Import Bootstrap's JavaScript if needed
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap's CSS
import React, { useState, useEffect, useRef } from 'react';
import './styles/video_container.css';

function VideoPlayer({videoFile, fullscreenProp, theaterProp, pipProp, speedbtnProp,captionbtnProp ,forwardBtn, backwardBtn, allowFrame , subtitleFile , LeftBackwardSvgIcon,RightForwardSvgIcon}) {
  const [playState, setPlayState] = useState(true);
  const [fullScreen, setFullScreen] = useState(false);
  const [theater, setTheater] = useState(false);
  const [pictureInPicture, setPictureInPicture] = useState(false);
  const [volume, setVolume] = useState(1);
  const [speedState, setSpeedState] = useState(1);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [initialScrubTime, setInitialScrubTime] = useState(null);
  const [previewScrubTime, setPreviewScrubTime] = useState(null);
  const [percentState, setPercentState] = useState(null);
  const [mouseMoveState, setMouseMoveState] = useState(()=>false);
  const [selectedSubtitle, setSelectedSubtitle] = useState(null); // Stores uploaded subtitle file


  const videoRef = useRef(null);
  const volumeSliderRef = useRef(null);
  const videoContainerRef = useRef(null);
  const currentTimeElemRef = useRef(null);
  const totalTimeElemRef = useRef(null);
  const previewImgRef = useRef(null);
  const timelineContainerRef = useRef(null);
  const thumbnailImgRef = useRef(null);
  const captionRef=useRef(null)
  const playPauseFunc = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play().catch((error) => {
        return;
      });
    } else {
      video.pause();
    }
    setPlayState((prev) => !prev);
    setPercentState(video.currentTime);
  };

  const toggleFullScreenMode = () => {
    const videoContainer = videoContainerRef.current;
    if (!document.fullscreenElement) {
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setFullScreen(!document.fullscreenElement);
  };

  const handlePictureInPicture = async () => {
    const video = videoRef.current;
    if (document.pictureInPictureElement === video) {
      await document.exitPictureInPicture();
    } else {
      try {
        await video.requestPictureInPicture();
      } catch (error) {
        console.error('Error entering Picture-in-Picture mode:', error);
      }
    }
    setPictureInPicture(!document.pictureInPictureElement);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key.toLowerCase()) {
        case "k":
        case " ":
          playPauseFunc();
          break;
        case "f":
          toggleFullScreenMode();
          break;
        case "t":
          setTheater(!theater);
          break;
        case "m":
          handleToggleMute();
          break;
        case "arrowleft":
        case "j":
          skip(-5);
          break;
        case "arrowright":
        case "l":
          skip(5);
          break;
        default:
          break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);


//skip video
  const skip = (duration) => {
    const video = videoRef.current;
    video.currentTime = video.currentTime + duration;
    setInitialScrubTime(video.currentTime + duration);
  };
//toggle mute
  const handleToggleMute = () => {
    const video = videoRef.current;
    video.muted = !video.muted;
    setVolume(video.muted ? 0 : 1);
    video.volume=video.muted ? 0 : 1;
  };

  useEffect(() => {
    const video = videoRef.current;
    const volumeSlider = volumeSliderRef.current;

    const volumeChange = () => {
      volumeSlider.value=video.volume;
      setVolume(video.volume);
      if (video.volume === 0) {
        volumeSlider.value=0;
        setVolume(0);
      } else if (video.volume >= 0.5) {
        setVolume(0.5);
      }else {
        setVolume(0.2);
      }
    };

    const inputSlider = (e) => {
      video.volume = e.target.value;
      video.muted = e.target.value === 0;
    };

    videoRef.current.addEventListener("volumechange", volumeChange);
    volumeSliderRef.current.addEventListener("input", inputSlider);

    return () => {
      videoRef.current.removeEventListener("volumechange", volumeChange);
      volumeSliderRef.current.removeEventListener("input", inputSlider);
    };
  }, []);

//update video duration
useEffect(() => {
    const video = videoRef.current;
    const currentTimeElem = currentTimeElemRef.current;
    const totalTimeElem = totalTimeElemRef.current;

    // Function to update total duration
    const totalDurationEffect = () => {
        totalTimeElem.textContent = formatDuration(video.duration);
    };

    // Function to update current duration and progress position
    const currentDurationEffect = () => {
        currentTimeElem.textContent = formatDuration(video.currentTime);
        const percent = video.currentTime / video.duration;
        timelineContainerRef.current.style.setProperty("--progress-position", percent);
        setPercentState(percent);
        if(!mouseMoveState) setInitialScrubTime(video.currentTime);
    };

    // Add event listeners
    video.addEventListener("loadeddata", totalDurationEffect);
    video.addEventListener("timeupdate", currentDurationEffect);

    // Clean up: remove event listeners
    return () => {
        video.removeEventListener("loadeddata", totalDurationEffect);
       video.removeEventListener("timeupdate", currentDurationEffect);
    };
}, [percentState,mouseMoveState]); // Run effect whenever the video reference changes



  const formatDuration = (time) => {
    const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
      minimumIntegerDigits: 2,
    });
    const secs = Math.floor(time % 60);
    const mins = Math.floor(time / 60) % 60;
    const hours = Math.floor(time / 3600);
    if (hours === 0) {
      return `${mins}:${leadingZeroFormatter.format(secs)}`;
    } else {
      return `${hours}:${leadingZeroFormatter.format(mins)}:${leadingZeroFormatter.format(secs)}`;
    }
  };
//handle video speed
  const handleSpeedRate = () => {
    const video = videoRef.current;
    setInitialScrubTime(video.currentTime)
    let newPlayBackRate = video.playbackRate + 0.25;
    if (newPlayBackRate > 2) newPlayBackRate = 0.25;
    setSpeedState(newPlayBackRate);
    video.playbackRate = newPlayBackRate;
  };

  // this function is use to preview a video by mouseovering it
  const handleTimeLineUpdate = async (e) => {
    setMouseMoveState(()=>true)
    const rect = timelineContainerRef.current.getBoundingClientRect();
    const percent = Math.min(Math.max(0, e.clientX - rect.x), rect.width) / rect.width;

    // Calculate desired preview time based on video duration and timeline position
    const previewTime = percent * videoRef.current.duration;
    setPreviewScrubTime(previewTime);
    const dataURL = await captureFrameAtTime(previewTime);
    allowFrame && (previewImgRef.current.src = mouseMoveState ? dataURL : '...');

  };

  // Capture video frame on video duration change
  const captureFrameAtTime = async (time) => {
    const videoElement = videoRef.current;

    return new Promise((resolve, reject) => {
      let percent=time/videoRef.current.duration;
      timelineContainerRef.current.style.setProperty("--preview-position", percent);

      videoElement.currentTime = previewScrubTime;

      // Wait for the seeked event to ensure the frame is captured
      videoElement.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
/*           canvas.width = videoElement.videoWidth;
          canvas.height = videoElement.videoHeight; */

          // Maintain original video aspect ratio for frame
          const videoAspectRatio = videoElement.videoWidth / videoElement.videoHeight;
          const previewImgWidth = timelineContainerRef.current.clientWidth; // Get timeline width
          const previewImgHeight = previewImgWidth / videoAspectRatio; // Calculate height based on width and aspect ratio

          canvas.width = previewImgWidth;
          canvas.height = previewImgHeight;
        
          context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL());
        } catch (error) {
          reject(error);
        }
      };
    });
  };
  //function change the duration of a video corresponding to the timeline scroll
  const handleToggleScrubbing = (e) => {
    const video = videoRef.current;
    const rect = timelineContainerRef.current.getBoundingClientRect();
    const percent = Math.min(Math.max(0, e.clientX - rect.x), rect.width) / rect.width;
    setPercentState(video.currentTime);
    const scrub = (e.buttons & 1) === 1;
    setIsScrubbing(scrub);
    videoContainerRef.current.classList.toggle("scrubbing", scrub);

    if (scrub) {
      setInitialScrubTime(video.currentTime);
      allowFrame && setPlayState(video.paused);
    } else {
       setIsScrubbing(false);
      allowFrame && setPlayState(!video.paused);
      video.currentTime = percent * video.duration;
    }
  };

  //return video to before mouseovering it
  const handleMouseLeave = () => {
    setMouseMoveState(false);
    const video = videoRef.current;
    video.currentTime = initialScrubTime; // Reset to initial time

    if (!isScrubbing) {
      setIsScrubbing(false);
      setPlayState(video.paused);
    }
  };
//handle mouse up
  const handleMouseUp = (e) => {
    if (isScrubbing) {
      handleToggleScrubbing(e);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.srt')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const srtContent = e.target.result;
        const vttContent = convertSRTtoVTT(srtContent);
        const blob = new Blob([vttContent], { type: 'text/vtt' });
        const url = URL.createObjectURL(blob);
        setSelectedSubtitle(url);
      }; 
      reader.readAsText(file);
    }
    if (file && file.name.endsWith('.vtt')) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const base64 = fileReader.result.split(',')[1]; // Get the base64 part
        const base64Url = `data:${file.type};base64,${base64}`;
        setSelectedSubtitle(base64Url);
      };
      fileReader.readAsDataURL(file); // Read file as base64
    }
  };

  const convertSRTtoVTT = (srt) => {
    // Replace SRT format with VTT format
    let vtt = 'WEBVTT\n\n';
    vtt += srt
      .replace(/\r/g, '') // Remove carriage returns
      .replace(/(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/g, '$1\n$2 --> $3') // Replace SRT time format with VTT time format
      .replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2'); // Replace comma with dot in timecodes
    return vtt;
  };


  const handleCaption=()=>{
    setSelectedSubtitle(null);
     captionRef.current?.click();
    }

return (
  <div>
    <div ref={videoContainerRef} className={theater ? `video-container position-relative my-3 theater bg-dark` : `video-container position-relative my-3 fullscreen bg-dark`}>
      {/* image thumbnail */}
      {allowFrame && mouseMoveState && <img src="" className='thumbnail-img' ref={thumbnailImgRef} alt='true'/>}
      <div className={playState ? 'paused video-controls-container w-100 position-absolute bottom-0 start-0' : 'video-controls-container w-100 position-absolute bottom-0 start-0'}>
         {/*  timeline-container */}
           <div className='timeline-container my-2' onDoubleClick={(e)=>handleMouseLeave(e)} onMouseMove={(e)=> allowFrame && handleTimeLineUpdate(e)} onMouseLeave={(e)=> allowFrame && handleMouseLeave(e)} onMouseUp={(e)=>  handleMouseUp(e)}   onMouseDown={(e)=>handleToggleScrubbing(e)} ref={timelineContainerRef}>
             <div className='timeline'>
                {allowFrame && <img src="" ref={previewImgRef} className='preview-img' alt='true' />}
                <div className='thumb-indicator'></div>
             </div>
           </div>
           <div className='controls pb-2 d-flex flex-row flex-nowrap align-items-center justify-content-between'>
              <div className="d-flex gap-2 flex-row align-items-center justify-content-between">
                  {/* play-pause button */}
                  <button onClick={playPauseFunc} id='play_pause_button' className='play-pause-btn text-light bg-transparent border-0'>
                      {playState ?
                          <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                              <path fillRule="evenodd" d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z" clipRule="evenodd" />
                          </svg>
                          :
                          <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                              <path fillRule="evenodd" d="M8 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H8Zm7 0a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1Z" clipRule="evenodd" />
                          </svg>
                      }
                  </button>
                  {/* mute button */}
                  <div className="volume-container d-flex flex-row align-items-center justify-content-between">
                      <button onClick={handleToggleMute} className='mute-btn text-light bg-transparent border-0'>
                          {volume <= 0
                              ? <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M5.707 4.293a1 1 0 0 0-1.414 1.414l14 14a1 1 0 0 0 1.414-1.414l-.004-.005C21.57 16.498 22 13.938 22 12a9.972 9.972 0 0 0-2.929-7.071 1 1 0 1 0-1.414 1.414A7.972 7.972 0 0 1 20 12c0 1.752-.403 3.636-1.712 4.873l-1.433-1.433C17.616 14.37 18 13.107 18 12c0-1.678-.69-3.197-1.8-4.285a1 1 0 1 0-1.4 1.428A3.985 3.985 0 0 1 16 12c0 .606-.195 1.335-.59 1.996L13 11.586V6.135c0-1.696-1.978-2.622-3.28-1.536L7.698 6.284l-1.99-1.991ZM4 8h.586L13 16.414v1.451c0 1.696-1.978 2.622-3.28 1.536L5.638 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2Z"/>
                              </svg>
                              : volume >= 0.5 
                                  ? <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M13 6.037c0-1.724-1.978-2.665-3.28-1.562L5.638 7.933H4c-1.105 0-2 .91-2 2.034v4.066c0 1.123.895 2.034 2 2.034h1.638l4.082 3.458c1.302 1.104 3.28.162 3.28-1.562V6.037Z"/>
                                      <path fillRule="evenodd" d="M14.786 7.658a.988.988 0 0 1 1.414-.014A6.135 6.135 0 0 1 18 12c0 1.662-.655 3.17-1.715 4.27a.989.989 0 0 1-1.414.014 1.029 1.029 0 0 1-.014-1.437A4.085 4.085 0 0 0 16 12a4.085 4.085 0 0 0-1.2-2.904 1.029 1.029 0 0 1-.014-1.438Z" clipRule="evenodd"/>
                                      <path fillRule="evenodd" d="M17.657 4.811a.988.988 0 0 1 1.414 0A10.224 10.224 0 0 1 22 12c0 2.807-1.12 5.35-2.929 7.189a.988.988 0 0 1-1.414 0 1.029 1.029 0 0 1 0-1.438A8.173 8.173 0 0 0 20 12a8.173 8.173 0 0 0-2.343-5.751 1.029 1.029 0 0 1 0-1.438Z" clipRule="evenodd"/>
                                  </svg>
                                  : <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M15 6.037c0-1.724-1.978-2.665-3.28-1.562L7.638 7.933H6c-1.105 0-2 .91-2 2.034v4.066c0 1.123.895 2.034 2 2.034h1.638l4.082 3.458c1.302 1.104 3.28.162 3.28-1.562V6.037Z"/>
                                      <path fillRule="evenodd" d="M16.786 7.658a.988.988 0 0 1 1.414-.014A6.135 6.135 0 0 1 20 12c0 1.662-.655 3.17-1.715 4.27a.989.989 0 0 1-1.414.014 1.029 1.029 0 0 1-.014-1.437A4.085 4.085 0 0 0 18 12a4.085 4.085 0 0 0-1.2-2.904 1.029 1.029 0 0 1-.014-1.438Z" clipRule="evenodd"/>
                                  </svg>
                          }
                      </button>
                      <input type="range" className='volume-slider' style={{"cursor":"pointer"}} ref={volumeSliderRef} defaultValue={volume} min={"0"} max={"1"} step={"any"} />
                  </div>
                  {/* duration */}
                  <div className='duration-container d-flex flex-row flex-nowrap'>
                      <div className='current-time' ref={currentTimeElemRef}>0:00</div>
                      / <div className="total-time" ref={totalTimeElemRef}>10:00</div>
                  </div>
              </div>
              <div className="d-flex gap-2 flex-row align-items-center justify-content-between">
             {/* caption-button */}
                 {captionbtnProp && 
                <button id='captionProp' onClick={handleCaption} className='text-light bg-transparent border-0'>
                      <svg width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg"  fill="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> 
                      <title>ic_fluent_closed_caption_24_regular</title> <desc>Created with Sketch.</desc> <g id="🔍-Product-Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="ic_fluent_closed_caption_24_regular" fill="#ffffff" fillRule="nonzero">
                      <path d="M18.75,4 C20.5449254,4 22,5.45507456 22,7.25 L22,16.754591 C22,18.5495164 20.5449254,20.004591 18.75,20.004591 L5.25,20.004591 C3.45507456,20.004591 2,18.5495164 2,16.754591 L2,7.25 C2,5.51696854 3.35645477,4.10075407 5.06557609,4.00514479 L5.25,4 L18.75,4 Z M18.75,5.5 L5.25,5.5 L5.10647279,5.5058012 C4.20711027,5.57880766 3.5,6.3318266 3.5,7.25 L3.5,16.754591 C3.5,17.7210893 4.28350169,18.504591 5.25,18.504591 L18.75,18.504591 C19.7164983,18.504591 20.5,17.7210893 20.5,16.754591 L20.5,7.25 C20.5,6.28350169 19.7164983,5.5 18.75,5.5 Z M5.5,12 C5.5,8.85441664 8.21322176,7.22468635 10.6216203,8.59854135 C10.981411,8.80378156 11.1066989,9.2618296 10.9014586,9.62162028 C10.6962184,9.98141095 10.2381704,10.1066989 9.87837972,9.90145865 C8.48070939,9.10416685 7,9.9935733 7,12 C7,14.0045685 8.48410774,14.8962094 9.8791978,14.102709 C10.2392458,13.8979206 10.6971362,14.0237834 10.9019246,14.3838314 C11.106713,14.7438795 10.9808502,15.2017699 10.6208022,15.4065583 C8.21538655,16.7747125 5.5,15.1433285 5.5,12 Z M13,12 C13,8.85441664 15.7132218,7.22468635 18.1216203,8.59854135 C18.481411,8.80378156 18.6066989,9.2618296 18.4014586,9.62162028 C18.1962184,9.98141095 17.7381704,10.1066989 17.3783797,9.90145865 C15.9807094,9.10416685 14.5,9.9935733 14.5,12 C14.5,14.0045685 15.9841077,14.8962094 17.3791978,14.102709 C17.7392458,13.8979206 18.1971362,14.0237834 18.4019246,14.3838314 C18.606713,14.7438795 18.4808502,15.2017699 18.1208022,15.4065583 C15.7153866,16.7747125 13,15.1433285 13,12 Z" id="🎨-Color">
                      </path> </g> </g> </g></svg> 
                       <input ref={captionRef} className='d-none' name='file' type="file" accept=".srt,.vtt" onChange={handleFileChange} />
                 </button>
                  }                 
                   {/* speed-button */}
                  {speedbtnProp && 
                      <button id='speedProp' className='speed-btn text-light bg-transparent border-0 fw-bold' onClick={handleSpeedRate}>
                          {speedState}x
                      </button>
                  }
                  {/* mini-player/theater button */}
                  {theaterProp && 
                      <button id='theaterProp' onClick={() => setTheater(prev => !prev)} className='text-light bg-transparent border-0'>
                          <svg className="w-6 h-6 text-gray-800 dark:text-white fw-bold" width="26" height={theater ? "20" : "24"} fill="currentColor" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M503.467,72.533h-51.2c-4.71,0-8.533,3.823-8.533,8.533v17.067h-409.6c-4.71,0-8.533,3.823-8.533,8.533V371.2H8.533 c-4.71,0-8.533,3.823-8.533,8.533v51.2c0,4.71,3.823,8.533,8.533,8.533h51.2c4.71,0,8.533-3.823,8.533-8.533v-17.067h409.6 c4.71,0,8.533-3.823,8.533-8.533V396.8v-256h17.067c4.71,0,8.533-3.823,8.533-8.533v-51.2 C512,76.356,508.177,72.533,503.467,72.533z M469.333,396.8H68.267v-17.067c0-4.71-3.823-8.533-8.533-8.533H42.667v-256h401.067 v17.067c0,4.71,3.823,8.533,8.533,8.533h17.067V396.8z"></path> </g> </g> </g></svg>
                      </button>
                  }
                  {/* picture in picture btn */}
                  {pipProp &&                   
                      <button id='pipProp' onClick={handlePictureInPicture} className='text-light bg-transparent border-0'>
                          <svg className="text-light" width="24" height={pictureInPicture ? "24" : "20"} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path fill="none" d="M0 0h24v24H0z"></path> <path fillRule="nonzero" d="M21 3a1 1 0 0 1 1 1v7h-2V5H4v14h6v2H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zm0 10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h8z"></path> </g> </g></svg>
                      </button>
                  }
                  {/* video full screen */}
                  {fullscreenProp &&
                      <button onClick={toggleFullScreenMode} id='fullscreenProp' className='text-light bg-transparent border-0'>
                          <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height={fullScreen ? "20" : "24"} fill="none" viewBox="0 0 24 24">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 9h4m0 0V5m0 4m0 0L4 4m15 5h-4m0 0V5m0 4 5-5M5 15h4m0 0v4m0-4-5 5m15-5h-4m0 0v4m0-4 5 5" />
                          </svg>
                      </button>
                  }
              </div>
        </div>
      </div>

  <video ref={videoRef}  className='w-100' src={videoFile}>
      {subtitleFile || selectedSubtitle && <track kind="captions" srcLang="en" src={`${subtitleFile || selectedSubtitle}`} default />}
      </video> 
        {/* big play-pause button */}
        <button onClick={playPauseFunc} id='big-pause-play' className='play_pause_button position-absolute top-50 start-50 translate-middle text-light bg-transparent border-0'>
          {playState ?
              <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="78" height="78" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z" clipRule="evenodd" />
              </svg>
              :
              <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="78" height="78" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M8 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H8Zm7 0a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1Z" clipRule="evenodd" />
              </svg>
          }
      </button>
      {
        forwardBtn && 
        <button onClick={()=>skip(5)} id='fastforward' className='position-absolute top-50 end-0 translate-middle-y text-light bg-transparent border-0'>
          {
            RightForwardSvgIcon ? <RightForwardSvgIcon /> :
          <svg className="text-light" width="36" height="36" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 454.833 454.833"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g>
          <path d="M220.917,112.86h111.666l-76.91-76.905c-8.252-8.254-8.252-21.698,0-29.953c7.991-8.003,21.958-8.003,29.955,0 l113.067,113.07c4.001,3.999,6.206,9.321,6.206,14.978c0,5.66-2.205,10.982-6.206,14.981L285.634,262.095 c-7.997,8.003-21.946,8.015-29.961,0c-8.252-8.257-8.252-21.698,0-29.956l76.91-76.911H220.917 c-70.917,0-128.618,57.701-128.618,128.618c0,70.923,57.701,128.618,128.618,128.618h60.526c10.03,0,18.158,8.133,18.158,18.158 v6.053c0,10.03-8.128,18.157-18.158,18.157h-60.526c-94.279,0-170.986-76.704-170.986-170.986 C49.931,189.567,126.638,112.86,220.917,112.86z"></path> </g> </g>
         </svg>
         }
        </button>
      }
      {
        backwardBtn && 
        <button onClick={()=>skip(-5)} id='backforward' className='position-absolute top-50 start-0 translate-middle-y text-light bg-transparent border-0'>
          {
            LeftBackwardSvgIcon ? <LeftBackwardSvgIcon/> :
            <svg className="text-light" xmlns="http://www.w3.org/2000/svg" fill="currentColor" version="1.1" id="Capa_1" width="36" height="36" viewBox="0 0 454.839 454.839">
            <g>
            <path d="M404.908,283.853c0,94.282-76.71,170.986-170.986,170.986h-60.526c-10.03,0-18.158-8.127-18.158-18.157v-6.053   c0-10.031,8.127-18.158,18.158-18.158h60.526c70.917,0,128.618-57.701,128.618-128.618c0-70.917-57.701-128.618-128.618-128.618   H122.255l76.905,76.905c8.26,8.257,8.26,21.699,0,29.956c-8.015,8.009-21.964,7.997-29.961,0L56.137,149.031   c-4.001-4.001-6.206-9.321-6.206-14.981c0-5.656,2.205-10.979,6.206-14.978L169.205,6.002c7.997-8.003,21.958-8.003,29.956,0   c8.26,8.255,8.26,21.699,0,29.953l-76.905,76.911h111.666C328.198,112.866,404.908,189.573,404.908,283.853z"/>
          </g>
        </svg> 
          }

        </button>
      }
    </div>
  </div>
);
}

export default VideoPlayer;