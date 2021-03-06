import { useContext, useState } from "react";
import "./write.css";
import { Context } from "../../context/Context";
import { axiosInstance } from "../../config";

export default function Write() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const { user } = useContext(Context);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      username: user.username,
      title,
      desc,
    };

    if (file) {
      const data =new FormData();
      const filename = Date.now() + file.name;
      data.append("name", filename);
      data.append("file", file);
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {UploadImage(reader.result);};
      reader.onerror = () => {console.error('AHHHHHHHH!!');};

      const UploadImage = async (base64EncodedImage) => {
        try {
            const res = await axiosInstance.post('/upload', JSON.stringify({ data: base64EncodedImage }), {headers: {'Content-Type': 'application/json'}});
            newPost.photo = res.data.public_id;
            const res3 = await axiosInstance.post("/posts", newPost);
            window.location.replace("/post/" + res3.data._id);
        } catch (err) {
            console.error(err);
        }
      };

    } else {
    try {
      const res2 = await axiosInstance.post("/posts", newPost);
      window.location.replace("/post/" + res2.data._id);
    } catch (err) {
      console.error(err);
    }
    };
  };
  return (
    <div className="write">
      {file && (
        <img className="writeImg" src={URL.createObjectURL(file)} alt="" />
      )}
      <form className="writeForm" onSubmit={handleSubmit} action="/" method="POST" encType="multipart/form-data">
        <div className="writeFormGroup">
          <label htmlFor="fileInput">
            <i className="writeIcon fas fa-plus"></i>
          </label>
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <input
            type="text"
            placeholder="Title"
            className="writeInput"
            autoFocus={true}
            onChange={e=>setTitle(e.target.value)}
          />
        </div>
        <div className="writeFormGroup">
          <textarea
            placeholder="Tell your story..."
            type="text"
            className="writeInput writeText"
            onChange={e=>setDesc(e.target.value)}
          ></textarea>
        </div>
        <button className="writeSubmit" type="submit">
          Publish
        </button>
      </form>
    </div>
  );
}
