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
            videoStatus.textContent = 'Videos playing simultaneously';
        }).catch(e => {
            console.error('Failed to start videos:', e);
            videoStatus.textContent = 'Error starting videos';
        });
        
    } else {
        // Pause both immediately
        console.log('Pausing both videos...');
        beforeVideo.pause();
        afterVideo.pause();
        videoStatus.textContent = 'Videos paused';
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
        videoStatus.textContent = 'Videos restarted and playing';
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
    // Only add basic time sync - no play/pause sync to avoid conflicts
    beforeVideo.removeEventListener('timeupdate', keepInSync);
    afterVideo.removeEventListener('timeupdate', keepInSync);
    
    // Add gentle time synchronization
    beforeVideo.addEventListener('timeupdate', keepInSync);
    afterVideo.addEventListener('timeupdate', keepInSync);
    
    // Start both videos from the beginning
    beforeVideo.currentTime = 0;
    afterVideo.currentTime = 0;
}

let lastSyncTime = 0;
function keepInSync(event) {
    // Only sync every 500ms to avoid constant corrections
    const now = Date.now();
    if (now - lastSyncTime < 500) return;
    lastSyncTime = now;
    
    // Gentle sync - only if videos drift apart by more than 0.3 seconds
    const timeDiff = Math.abs(beforeVideo.currentTime - afterVideo.currentTime);
    if (timeDiff > 0.3) {
        console.log('Syncing videos - time difference:', timeDiff);
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
    beforeVideo.addEventListener('loadeddata', () => {
        console.log('Before video loaded successfully');
        videoStatus.textContent = 'Videos loaded - ready to play';
    });
    
    afterVideo.addEventListener('loadeddata', () => {
        console.log('After video loaded successfully');
    });
    
    beforeVideo.addEventListener('error', (e) => {
        console.error('Before video error:', e);
        videoStatus.textContent = 'Error loading videos';
    });
    
    afterVideo.addEventListener('error', (e) => {
        console.error('After video error:', e);
    });
    
    // Force load the videos
    beforeVideo.load();
    afterVideo.load();
    
    syncVideos();
    
    // Continuous sync check every second during playback
    setInterval(() => {
        if (!beforeVideo.paused && !afterVideo.paused) {
            const timeDiff = Math.abs(beforeVideo.currentTime - afterVideo.currentTime);
            if (timeDiff > 0.1) {
                console.log('Auto-syncing videos, time difference:', timeDiff);
                // Sync to the video that's behind
                const targetTime = Math.max(beforeVideo.currentTime, afterVideo.currentTime);
                beforeVideo.currentTime = targetTime;
                afterVideo.currentTime = targetTime;
            }
        }
    }, 1000);
    
    videoStatus.textContent = 'Videos loading... Click Play/Pause when ready';
});
