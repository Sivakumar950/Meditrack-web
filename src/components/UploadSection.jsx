import { useRef } from 'react';

function UploadSection({ onProcessImage, uploadedImage, setUploadedImage }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage({ file, preview: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage({ file, preview: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="card">
      <h2>Upload Prescription Image</h2>
      <div
        className="upload-box"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        <label htmlFor="imageUpload" className="file-label">
          Choose File
        </label>
        <p>or drag & drop an image here</p>
      </div>
      {uploadedImage && (
        <div className="image-preview">
          <img src={uploadedImage.preview} alt="Uploaded Image" />
        </div>
      )}
      <button onClick={onProcessImage} className="btn">
        Process Image
      </button>
    </div>
  );
}

export default UploadSection;