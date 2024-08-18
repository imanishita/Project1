const generateForm = document.querySelector(".generator-form");
const imageGallery = document.querySelector(".imagegallery");
const DEEP_AI_API_KEY = "";

const updateImageCard = (imgDataArray) => {
  imgDataArray.forEach((imgObject, index) => {
    const imgCard = imageGallery.querySelectorAll(".imgcard")[index];
    const imgElement = imgCard.querySelector("img");
    const downloadBtn = imgCard.querySelector(".downloadbtn");

    const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;

    imgElement.src = aiGeneratedImg;
    imgElement.onload = () => {
      imgCard.classList.remove("loading");
      downloadBtn.setAttribute("href", aiGeneratedImg);
      downloadBtn.setAttribute("download",   
 `${new Date().getTime()}.jpg`);   

    };
    imgElement.onerror = () => {
      imgCard.classList.add("error"); 
      console.error("Failed to load image:", imgObject);
    };
  });
};

const generateAiImages = async (userPrompt, userImgQuantity) => {
  try {
    const response = await fetch("https://api.deepai.org/api/text2img", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": DEEP_AI_API_KEY,
      },
      body: JSON.stringify({
        text: userPrompt,
        grid_size: userImgQuantity,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate images! Please try again.");
    }

    const data = await response.json();
    console.log('API Response:', data);

    if (!data.output_url) {
      throw new Error("Failed to generate images! Please try again.");
    }

    updateImageCard(data.output_url);
  } catch (error) {
    alert(error.message);
  }
};

const handleFormSubmission = (e) => {
  e.preventDefault();

  const userPrompt = e.target[0].value;
  const userImgQuantity = parseInt(e.target[1].value); 

  imageGallery.innerHTML = Array.from({ length: userImgQuantity }, () => `
    <div class="imgcard loading">
      <img src="loading.svg" alt="Loading AI-generated image">
      <a href="#" class="downloadbtn">
        <img src="downloadicon.jpg" alt="Download image">
      </a>
    </div>
  `).join("");

  generateAiImages(userPrompt, userImgQuantity);
};

generateForm.addEventListener("submit", handleFormSubmission);