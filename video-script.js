const container = document.querySelector('.container');
const slider = document.getElementById('slider');
const videoSelect = document.getElementById('videoSelect');
const beforeVideo = document.getElementById('beforeVideo');
const afterVideo = document.getElementById('afterVideo');
const labelLeft = document.querySelector('.overlay-label-left');
const labelRight = document.querySelector('.overlay-label-right');
const playPauseBtn = document.getElementById('playPause');
const restartBtn = document.getElementById('restart');
const toggleMuteBtn = document.getElementById('toggleMute');
const videoStatus = document.getElementById('videoStatus');

// Video controls
playPauseBtn.addEventListener('click', () => {
    console.log('Play/Pause clicked');
    
    if (beforeVideo.paused && afterVideo.paused) {
        // Both paused, play both simultaneously
        console.log('Starting both videos simultaneously...');
        
        // Sync to same time first
        const currentTime = Math.min(beforeVideo.currentTime, afterVideo.currentTime);
        beforeVideo.currentTime = currentTime;
        afterVideo.currentTime = currentTime;
        
        // Play both videos at exactly the same time
        Promise.all([
            beforeVideo.play(),
            afterVideo.play()
        ]).then(() => {
            console.log('Both videos started playing');
            videoStatus.textContent = 'Videos playing in sync (will loop continuously)';
        }).catch(e => {
            console.error('Failed to start videos:', e);
            videoStatus.textContent = 'Error starting videos';
        });
        
    } else {
        // Pause both immediately
        console.log('Pausing both videos...');
        beforeVideo.pause();
        afterVideo.pause();
        videoStatus.textContent = 'Videos paused (click to resume looping)';
    }
});

restartBtn.addEventListener('click', () => {
    console.log('Restarting videos...');
    
    // Reset both to start
    beforeVideo.currentTime = 0;
    afterVideo.currentTime = 0;
    
    // Play both simultaneously from beginning
    Promise.all([
        beforeVideo.play(),
        afterVideo.play()
    ]).then(() => {
        console.log('Both videos restarted');
        videoStatus.textContent = 'Videos restarted and looping continuously';
    }).catch(e => {
        console.error('Failed to restart videos:', e);
        videoStatus.textContent = 'Error restarting videos';
    });
});

toggleMuteBtn.addEventListener('click', () => {
    beforeVideo.muted = !beforeVideo.muted;
    afterVideo.muted = !afterVideo.muted;
});

function updateVideos() {
    const videoIndex = videoSelect.value;
    
    beforeVideo.src = `Ours/${videoIndex}.mp4`;
    afterVideo.src = `3DGS/${videoIndex}.mp4`;
    
    // Handle loading errors with fallback
    beforeVideo.onerror = () => {
        console.warn(`Could not load Ours video: ${videoIndex}.mp4`);
    };
    
    afterVideo.onerror = () => {
        console.warn(`Could not load 3DGS video: ${videoIndex}.mp4`);
    };
    
    // Reset videos to start
    beforeVideo.currentTime = 0;
    afterVideo.currentTime = 0;
    
    // Sync video playback
    syncVideos();
}

function syncVideos() {
    // Remove any existing sync event listeners to avoid performance issues
    beforeVideo.removeEventListener('timeupdate', keepInSync);
    afterVideo.removeEventListener('timeupdate', keepInSync);
    
    // Only use the interval-based sync to avoid constant interruptions
    // Start both videos from the beginning
    beforeVideo.currentTime = 0;
    afterVideo.currentTime = 0;
}

let lastSyncTime = 0;
function keepInSync(event) {
    // Only sync every 2 seconds to avoid interfering with playback
    const now = Date.now();
    if (now - lastSyncTime < 2000) return;
    lastSyncTime = now;
    
    // Only sync if videos drift apart by more than 0.5 seconds (larger threshold)
    const timeDiff = Math.abs(beforeVideo.currentTime - afterVideo.currentTime);
    if (timeDiff > 0.5) {
        console.log('Syncing videos - time difference:', timeDiff);
        // Sync to the faster video to avoid stuttering
        if (event.target === beforeVideo) {
            afterVideo.currentTime = beforeVideo.currentTime;
        } else {
            beforeVideo.currentTime = afterVideo.currentTime;
        }
    }
}

// Handle slider input using pixel-based calculation for precise clipping
slider.addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    container.style.setProperty('--position', `${value}%`);
    
    // Get actual pixel positions
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const sliderPixelPosition = (value / 100) * containerWidth;
    
    // Get label positions and dimensions
    const leftLabelRect = labelLeft.getBoundingClientRect();
    const rightLabelRect = labelRight.getBoundingClientRect();
    const containerLeft = containerRect.left;
    
    // Calculate relative positions within container
    const leftLabelStart = leftLabelRect.left - containerLeft;
    const leftLabelEnd = leftLabelRect.right - containerLeft;
    const rightLabelStart = rightLabelRect.left - containerLeft;
    const rightLabelEnd = rightLabelRect.right - containerLeft;
    
    // Clip left label when slider line intersects it
    if (sliderPixelPosition >= leftLabelStart && sliderPixelPosition <= leftLabelEnd) {
        const clipPixels = sliderPixelPosition - leftLabelStart;
        const clipPercentage = (clipPixels / leftLabelRect.width) * 100;
        labelLeft.style.clipPath = `inset(0 ${100 - clipPercentage}% 0 0)`;
    } else {
        labelLeft.style.clipPath = 'none'; // Fully visible when slider is not over it
    }
    
    // Clip right label when slider line intersects it
    if (sliderPixelPosition >= rightLabelStart && sliderPixelPosition <= rightLabelEnd) {
        const clipPixels = sliderPixelPosition - rightLabelStart;
        const clipPercentage = (clipPixels / rightLabelRect.width) * 100;
        labelRight.style.clipPath = `inset(0 0 0 ${clipPercentage}%)`;
    } else {
        labelRight.style.clipPath = 'none'; // Fully visible when slider is not over it
    }
    labelLeft.style.opacity = '1';
    labelRight.style.opacity = '1';
    
    // Update labels
    labelLeft.textContent = '3DGS';
    labelRight.textContent = 'Ours';
});

// Handle video selection
videoSelect.addEventListener('change', (e) => {
    updateVideos();
});

// Initialize sync when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, initializing videos...');
    
    // Log video sources for debugging
    console.log('Before video src:', beforeVideo.src);
    console.log('After video src:', afterVideo.src);
      // Add event listeners to check video loading status
    let beforeVideoLoaded = false;
    let afterVideoLoaded = false;
    
    function checkAutoplay() {
        if (beforeVideoLoaded && afterVideoLoaded) {
            // Both videos loaded, start autoplay
            setTimeout(() => {
                console.log('Both videos loaded, starting autoplay...');
                
                // Start both videos simultaneously
                Promise.all([
                    beforeVideo.play(),
                    afterVideo.play()
                ]).then(() => {
                    console.log('Autoplay started successfully');
                    videoStatus.textContent = 'Videos playing automatically (will loop continuously)';
                }).catch(e => {
                    console.error('Autoplay failed (browser may block autoplay):', e);
                    videoStatus.textContent = 'Autoplay blocked by browser - click Play/Pause to start';
                });
            }, 500); // Small delay to ensure videos are ready
        }
    }
    
    beforeVideo.addEventListener('loadeddata', () => {
        console.log('Before video loaded successfully');
        beforeVideoLoaded = true;
        checkAutoplay();
    });
    
    afterVideo.addEventListener('loadeddata', () => {
        console.log('After video loaded successfully');
        afterVideoLoaded = true;
        checkAutoplay();
    });
    
    beforeVideo.addEventListener('error', (e) => {
        console.error('Before video error:', e);
        videoStatus.textContent = 'Error loading videos';
    });
    
    afterVideo.addEventListener('error', (e) => {
        console.error('After video error:', e);
    });
    
    // Add loop handling to ensure videos restart together
    beforeVideo.addEventListener('ended', () => {
        console.log('Before video ended, restarting both...');
        beforeVideo.currentTime = 0;
        afterVideo.currentTime = 0;
        
        // Restart both videos simultaneously
        Promise.all([
            beforeVideo.play(),
            afterVideo.play()
        ]).catch(e => {
            console.error('Failed to restart videos on loop:', e);
        });
    });
    
    afterVideo.addEventListener('ended', () => {
        console.log('After video ended, restarting both...');
        beforeVideo.currentTime = 0;
        afterVideo.currentTime = 0;
        
        // Restart both videos simultaneously
        Promise.all([
            beforeVideo.play(),
            afterVideo.play()
        ]).catch(e => {
            console.error('Failed to restart videos on loop:', e);
        });
    });
    
    // Force load the videos
    beforeVideo.load();
    afterVideo.load();
    
    syncVideos();
      // Continuous sync check - reduced frequency and larger threshold
    setInterval(() => {
        if (!beforeVideo.paused && !afterVideo.paused) {
            const timeDiff = Math.abs(beforeVideo.currentTime - afterVideo.currentTime);
            // Only sync if difference is significant (more than 0.5 seconds)
            if (timeDiff > 0.5) {
                console.log('Auto-syncing videos, time difference:', timeDiff);
                // Sync to the video that's ahead to maintain smooth playback
                const targetTime = Math.max(beforeVideo.currentTime, afterVideo.currentTime);
                beforeVideo.currentTime = targetTime;
                afterVideo.currentTime = targetTime;
            }
        }
    }, 3000); // Check every 3 seconds instead of 1 second
    
    videoStatus.textContent = 'Videos loading... Will start automatically when ready';
});
