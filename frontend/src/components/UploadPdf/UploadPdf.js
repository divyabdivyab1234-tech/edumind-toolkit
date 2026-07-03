import axios from "axios";

const UploadPdf = () => {

  const handleGenerate = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/pdf/keypoints",
        {
          text: "This is sample text for testing backend connection"
        }
      );

      console.log("Keypoints:", res.data.keypoints);
      alert("Backend connected & keypoints generated");

    } catch (error) {
      console.error(error);
      alert("Backend NOT connected");
    }
  };

  return (
    <button onClick={handleGenerate}>
      Generate Keypoints
    </button>
  );
};

export default UploadPdf;
