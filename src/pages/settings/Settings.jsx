import "./settings.css";
import Sidebar from "../../components/sidebar/Sidebar";
import { useContext, useState } from "react";
import axios from "axios";
import { Context } from "../../context/Context";
import { Image } from 'cloudinary-react';

export default function Settings() {
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const { user, dispatch } = useContext(Context);
  /*const PF = "http://localhost:5000/images/"*/

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "UPDATE_START" });
    const updatedUser = {
      userId: user._id,
      username,
      email,
      password,
    };
    if (file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append("name", filename);
      data.append("file", file);
      /*updatedUser.profilePic = filename;*/
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {UploadImage(reader.result);};
      reader.onerror = () => {console.error('AHHHHHHHH!!');};

      const UploadImage = async (base64EncodedImage) => {
        try {
            console.log(1)
            const res = await axios.post('/upload', JSON.stringify({ data: base64EncodedImage }), {headers: {'Content-Type': 'application/json'}});
            updatedUser.profilePic = res.data.public_id;
            console.log(1)
            console.log(updatedUser)
            const res3 = await axios.put("/users/" + user._id, updatedUser);
            console.log(updatedUser)
            console.log(2)
            setSuccess(true);
            dispatch({ type: "UPDATE_SUCCESS", payload: res3.data });
            /*window.location.replace("/users/" + res3.data._id);*/
        } catch (err) {
            dispatch({ type: "UPDATE_FAILURE" });
        }
      };
    }else{
    try {
      const res2 = await axios.put("/users/" + user._id, updatedUser);
      setSuccess(true);
      dispatch({ type: "UPDATE_SUCCESS", payload: res2.data });
    } catch (err) {
      dispatch({ type: "UPDATE_FAILURE" });
    };
    };
  };
  return (
    <div className="settings">
      <div className="settingsWrapper">
        <div className="settingsTitle">
          <span className="settingsUpdateTitle">Update Your Account</span>
          <span className="settingsDeleteTitle">Delete Account</span>
        </div>
        <form className="settingsForm" onSubmit={handleSubmit}>
          <label>Profile Picture</label>
          <div className="settingsPP">
            {file ? <img src={URL.createObjectURL(file)} alt=""/> : <Image cloudName={"drslzgsaz"} publicId={user.profilePic}/>}
            <label htmlFor="fileInput">
              <i className="settingsPPIcon far fa-user-circle"></i>
            </label>
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <label>Username</label>
          <input
            type="text"
            placeholder={user.username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Email</label>
          <input
            type="email"
            placeholder={user.email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="settingsSubmit" type="submit">
            Update
          </button>
          {success && (
            <span
              style={{ color: "green", textAlign: "center", marginTop: "20px" }}
            >
              Profile has been updated...
            </span>
          )}
        </form>
      </div>
      <Sidebar />
    </div>
  );
}
