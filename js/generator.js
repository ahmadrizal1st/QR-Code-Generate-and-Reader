const wrapper = document.querySelector(".wrapper"),
  qrInput = wrapper.querySelector(".form input"),
  generateBtn = wrapper.querySelector(".form button"),
  qrImg = wrapper.querySelector(".qr-code img"),
  downloadBtn = document.querySelector(".download-btn");

let preValue;

// Generate QR Code
generateBtn.addEventListener("click", () => {
  let qrValue = qrInput.value.trim();
  if (!qrValue || preValue === qrValue) {
    modal.style.display = "block";
    modalText.innerHTML = `Please Enter a Text or URL in the QR Input`;
  } else {
    preValue = qrValue;
    generateBtn.innerText = "Generating QR Code...";
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      qrValue
    )}`;
    qrImg.src = qrCodeUrl;

    qrImg.onload = () => {
      wrapper.classList.add("active");
      generateBtn.innerText = "Generate QR Code";
      downloadBtn.style.display = "block";
      downloadBtn.setAttribute("data-url", qrCodeUrl);
    };
  }
});

qrInput.addEventListener("keyup", () => {
  if (!qrInput.value.trim()) {
    wrapper.classList.remove("active");
    preValue = "";
  }
});

// Download QR Code
downloadBtn.addEventListener("click", async () => {
  const imageUrl = downloadBtn.getAttribute("data-url");
  if (!imageUrl) return;

  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "qr-code.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    modal.style.display = "block";
    modalText.innerHTML = "Error downloading";
  }
});
