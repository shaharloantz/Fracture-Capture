# FractureCapture



## Description

FractureCapture is a comprehensive web application designed to improve fracture detection by analyzing X-ray images. Utilizing advanced image processing and deep learning algorithms, our application is capable of detecting, classifying, and localizing fractures across various bone types and anatomical regions, particularly in the upper and lower limbs.

This project aims to address the shortage of skilled radiologists and the limitations of existing computer-aided diagnosis (CAD) systems by providing a versatile tool for medical professionals to diagnose fractures effectively.

## Features

- **Fracture Detection**: Accurately detect the presence of fractures in X-ray images.
- **Fracture Classification**: Classify whether there is a fracture or not in the X-ray images.
- **Fracture Localization**: Accurately localize and visually represent detected fractures.
- **Web Application Integration**: Upload and analyze X-ray images through a user-friendly interface.
- **Real-Time Processing**: Near real-time processing of uploaded images.
- **Versatility**: Handles fractures in both upper and lower limbs.
- **Scalability and Accessibility**: Designed to accommodate varying workload demands and accessible from any internet-enabled device.
- **High Accuracy**: Ensures reliable results for users.
- **Security**: Implements user authentication to protect data and ensure privacy.
- **User Feedback**: Provides clear analysis results to users.

## Technologies Used

### Deep Learning Module
- Keras
- TensorFlow
- PyTorch
- CNN, Mask R-CNN, YOLO, Faster R-CNN
- OpenCV
- PIL
- NumPy
- Pandas
- Scikit-learn
- Jupyter Notebook

### Frontend Module
- HTML
- CSS
- Tailwind CSS
- React

### Backend Module
- Node.js
- Express.js

### Database
- MongoDB


## Installation

1. Clone the repository:
   ```
   git clone https://github.com/shaharloantz/Fracture-Capture.git
   ```
2. Navigate to the project directory:
   ```
   cd FractureCapture
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```
5. Create a `.env` file in the `server` directory with the following content:
   ```
   MONGO_URI=<your_mongo_uri>
   JWT_SECRET=<your_jwt_secret>
   EMAIL=<your_email>
   EMAIL_PASSWORD=<your_email_password>
   SMTP_SECURE=<smtp_secure>
   SMTP_PORT=<smtp_port>
   SMTP_HOST=<smtp_host>
6. Ensure you have the file `weights.pt` in the `server` directory.

## Usage

To start the application, run:

```
npm start
```

Then, open your web browser and navigate to `http://localhost:5173`


## Disclaimer

FractureCapture is designed as a supportive tool for medical professionals and should not be used as a sole means of diagnosis. Always consult with a qualified healthcare provider for medical advice and treatment.


## Support

If you encounter any issues or have questions about using Fractures Captures, please open an issue in this repository or refer to our documentation.

Remember to stay updated with the latest version for optimal performance and security.
