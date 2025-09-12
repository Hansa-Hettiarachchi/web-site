# Image Comparison Tool

A web-based before/after image comparison tool for comparing different rendering methods.

## Features

- **Interactive Slider**: Drag to compare images side-by-side
- **Dual Comparison Modes**:
  - **Ours vs 3DGS**: Compare your method with 3D Gaussian Splatting
  - **Ours vs GT**: Compare your method with Ground Truth images
- **Image Selection**: Choose from 24 different test images
- **Responsive Design**: Works on desktop and mobile devices

## Demo

Visit the live demo: [Your GitHub Pages URL will go here]

## Usage

1. Select a comparison mode using the navigation buttons
2. Choose an image from the dropdown selector
3. Drag the slider to compare the images
4. Switch between comparison modes as needed

## File Structure

```
├── index.html          # Main HTML file
├── style.css           # Styling
├── script.js           # JavaScript functionality
├── Ours/              # Your method's output images
├── 3DGS/              # 3D Gaussian Splatting images
├── gt/                # Ground truth images
└── Kitchen/           # Additional test images
    ├── 3DGS/
    ├── Graph GS/
    └── gt/
```

## Local Development

1. Clone this repository
2. Open `index.html` in a web browser
3. Or use a local server like Live Server for development

## Technologies Used

- HTML5
- CSS3 (with CSS Grid and Flexbox)
- Vanilla JavaScript
- SVG icons
