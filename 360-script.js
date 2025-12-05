const container = document.querySelector('.container');
const slider = document.getElementById('slider');
const imageSelect = document.getElementById('imageSelect');
const beforeImage = document.getElementById('beforeImage');
const afterImage = document.getElementById('afterImage');
const labelLeft = document.querySelector('.overlay-label-left');
const labelRight = document.querySelector('.overlay-label-right');

function updateImages() {
  const imageIndex = imageSelect.value;
  
  beforeImage.src = `Ours360/${imageIndex}.png`;
  afterImage.src = `3DGS/${imageIndex}.png`;
  
  // Handle loading errors with fallback
  beforeImage.onerror = () => {
    console.warn(`Could not load Ours360 image: ${imageIndex}.png`);
  };
  
  afterImage.onerror = () => {
    console.warn(`Could not load 3DGS image: ${imageIndex}.png`);
  };
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
  labelRight.textContent = 'Our 360';
});

// Handle selection change
imageSelect.addEventListener('change', (e) => {
  updateImages();
});

