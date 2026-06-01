import axios from "axios";


export const uploadImage = async (
  file
) => {
  const formData =
    new FormData();

  formData.append(
    "file",
    file
  );

  formData.append(
    "upload_preset",
    "nexusstore"
  );

  const { data } =
    await axios.post(
      "https://api.cloudinary.com/v1_1/dkheqjusf/image/upload",
      formData
    );

  return data.secure_url;
};