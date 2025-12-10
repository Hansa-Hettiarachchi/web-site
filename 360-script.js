// Scene configuration - easy to add more scenes
const sceneConfig = [
  {
    id: 1,
    name: 'Garden',
    images: ['G1']
  },
  {
    id: 2,
    name: 'Bicycle',
    images: ['B1', 'B2', 'B3', 'B4']
  },
  {
    id: 3,
    name: 'C-series',
    images: ['C1', 'C2', 'C3', 'C4', 'C5']
  },
  {
    id: 4,
    name: 'N-series',
    images: ['N1', 'N2', 'N3']
  },
  {
    id: 5,
    name: 'Kitchen',
    images: ['K1', 'K2', 'K3', 'K4']
  },
  {
    id: 6,
    name: 'Stump',
    images: ['S1', 'S2', 'S3', 'S4', 'S5']
  }
];

// Current comparison mode
let currentMode = '3DGS'; // '3DGS', 'GT', or 'Ours'

// Mode buttons
const mode360_3DGSBtn = document.getElementById('mode360_3DGS');
const mode360_GTBtn = document.getElementById('mode360_GT');
const mode360_OursBtn = document.getElementById('mode360_Ours');
const pageTitle = document.querySelector('h1');

// Handle mode switching
mode360_3DGSBtn.addEventListener('click', () => {
  switchMode('3DGS');
});

mode360_GTBtn.addEventListener('click', () => {
  switchMode('GT');
});

mode360_OursBtn.addEventListener('click', () => {
  switchMode('Ours');
});

function switchMode(mode) {
  currentMode = mode;
  
  // Update button states
  mode360_3DGSBtn.classList.toggle('active', mode === '3DGS');
  mode360_GTBtn.classList.toggle('active', mode === 'GT');
  mode360_OursBtn.classList.toggle('active', mode === 'Ours');
  
  // Update page title
  if (mode === '3DGS') {
    pageTitle.textContent = 'Ours 360 vs 3DGS Comparison';
  } else if (mode === 'GT') {
    pageTitle.textContent = 'Ours 360 vs GT Comparison';
  } else if (mode === 'Ours') {
    pageTitle.textContent = 'Ours 360 vs Ours (E1 + E2 + E3) Comparison';
  }
  
  // Update all viewers
  sceneConfig.forEach(scene => {
    updateViewerImages(scene.id);
    updateViewerLabels(scene.id);
  });
}

// Initialize all viewers
sceneConfig.forEach(scene => {
  initializeViewer(scene.id);
});

function initializeViewer(viewerId) {
  const slider = document.getElementById(`slider${viewerId}`);
  const imageSelect = document.getElementById(`imageSelect${viewerId}`);
  const container = document.querySelector(`[data-viewer="${viewerId}"]`);
  const labelLeft = document.getElementById(`labelLeft${viewerId}`);
  const labelRight = document.getElementById(`labelRight${viewerId}`);
  
  // Handle slider input
  slider.addEventListener('input', (e) => {
    handleSliderInput(e, viewerId, container, labelLeft, labelRight);
  });
  
  // Handle image selection change
  imageSelect.addEventListener('change', () => {
    updateViewerImages(viewerId);
  });
  
  // Initialize images
  updateViewerImages(viewerId);
  updateViewerLabels(viewerId);
}

function updateViewerImages(viewerId) {
  const imageSelect = document.getElementById(`imageSelect${viewerId}`);
  const beforeImage = document.getElementById(`beforeImage${viewerId}`);
  const afterImage = document.getElementById(`afterImage${viewerId}`);
  const slider = document.getElementById(`slider${viewerId}`);
  const container = document.querySelector(`[data-viewer="${viewerId}"]`);
  const labelLeft = document.getElementById(`labelLeft${viewerId}`);
  const labelRight = document.getElementById(`labelRight${viewerId}`);
  
  const imageIndex = imageSelect.value;
  
  if (currentMode === '3DGS') {
    beforeImage.src = `Ours360/${imageIndex}.png`;
    afterImage.src = `3DGS/${imageIndex}.png`;
  } else if (currentMode === 'GT') {
    beforeImage.src = `Ours360/${imageIndex}.png`;
    afterImage.src = `gt/${imageIndex}.png`;
  } else if (currentMode === 'Ours') {
    beforeImage.src = `Ours360/${imageIndex}.png`;
    afterImage.src = `Ours/${imageIndex}.png`;
  }
  
  // Reset slider to center (50%)
  slider.value = 50;
  container.style.setProperty('--position', '50%');
  
  // Reset label clip paths
  labelLeft.style.clipPath = 'none';
  labelRight.style.clipPath = 'none';
  labelLeft.style.opacity = '1';
  labelRight.style.opacity = '1';
  
  // Handle loading errors with fallback
  beforeImage.onerror = () => {
    console.warn(`Could not load Ours360 image: ${imageIndex}.png`);
  };
  
  afterImage.onerror = () => {
    console.warn(`Could not load ${currentMode} image: ${imageIndex}.png`);
  };
}

function updateViewerLabels(viewerId) {
  const labelLeft = document.getElementById(`labelLeft${viewerId}`);
  const labelRight = document.getElementById(`labelRight${viewerId}`);
  
  if (currentMode === '3DGS') {
    labelLeft.textContent = '3DGS';
    labelRight.textContent = 'Ours 360';
  } else if (currentMode === 'GT') {
    labelLeft.textContent = 'GT';
    labelRight.textContent = 'Ours 360';
  } else if (currentMode === 'Ours') {
    labelLeft.textContent = 'Ours (E1 + E2 + E3)';
    labelRight.textContent = 'Ours 360';
  }
}

function handleSliderInput(e, viewerId, container, labelLeft, labelRight) {
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
    labelLeft.style.clipPath = 'none';
  }
  
  // Clip right label when slider line intersects it
  if (sliderPixelPosition >= rightLabelStart && sliderPixelPosition <= rightLabelEnd) {
    const clipPixels = sliderPixelPosition - rightLabelStart;
    const clipPercentage = (clipPixels / rightLabelRect.width) * 100;
    labelRight.style.clipPath = `inset(0 0 0 ${clipPercentage}%)`;
  } else {
    labelRight.style.clipPath = 'none';
  }
  
  labelLeft.style.opacity = '1';
  labelRight.style.opacity = '1';
}

