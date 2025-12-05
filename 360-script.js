const container = document.querySelector('.container');
const slider = document.getElementById('slider');
const imageSelect = document.getElementById('imageSelect');
const beforeImage = document.getElementById('beforeImage');
const afterImage = document.getElementById('afterImage');
const labelLeft = document.querySelector('.overlay-label-left');
const labelRight = document.querySelector('.overlay-label-right');
const mode360_3DGSBtn = document.getElementById('mode360_3DGS');
const mode360_GTBtn = document.getElementById('mode360_GT');
const pageTitle = document.querySelector('h1');

// Current comparison mode
let currentMode = '3DGS'; // '3DGS' or 'GT'

// Handle mode switching
mode360_3DGSBtn.addEventListener('click', () => {
  switchMode('3DGS');
});

mode360_GTBtn.addEventListener('click', () => {
  switchMode('GT');
});

function switchMode(mode) {
  currentMode = mode;
  
  // Update button states
  mode360_3DGSBtn.classList.toggle('active', mode === '3DGS');
  mode360_GTBtn.classList.toggle('active', mode === 'GT');
  
  // Update page title and labels
  if (mode === '3DGS') {
    pageTitle.textContent = 'Ours 360 vs 3DGS Comparison';
    labelLeft.textContent = '3DGS';
    labelRight.textContent = 'Ours 360';
  } else {
    pageTitle.textContent = 'Ours 360 vs GT Comparison';
    labelLeft.textContent = 'GT';
    labelRight.textContent = 'Ours 360';
  }
  updateImages();
}

function updateImages() {
  const imageIndex = imageSelect.value;
  
  if (currentMode === '3DGS') {
    beforeImage.src = `Ours360/${imageIndex}.png`;
    afterImage.src = `3DGS/${imageIndex}.png`;
  } else {
    beforeImage.src = `Ours360/${imageIndex}.png`;
    afterImage.src = `gt/${imageIndex}.png`;
  }
  
  // Handle loading errors with fallback
  beforeImage.onerror = () => {
    console.warn(`Could not load Ours360 image: ${imageIndex}.png`);
  };
  
  afterImage.onerror = () => {
    console.warn(`Could not load ${currentMode} image: ${imageIndex}.png`);
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
  
  // Update labels based on current mode
  if (currentMode === '3DGS') {
    labelLeft.textContent = '3DGS';
    labelRight.textContent = 'Ours 360';
  } else {
    labelLeft.textContent = 'GT';
    labelRight.textContent = 'Ours 360';
  }
});

// Handle selection change
imageSelect.addEventListener('change', (e) => {
  updateImages();
});

