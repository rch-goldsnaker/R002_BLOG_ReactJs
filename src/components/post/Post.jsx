import "./post.css";
import { Link } from "react-router-dom";
import { Image } from 'cloudinary-react';

export default function Post({ post }) {
  return (
    <div className="post">
      {post.photo && <Image cloudName={"drslzgsaz"} publicId={post.photo} className="postImg"/>}
      
      <div className="postInfo">
        <div className="postCats">
          {post.categories.map((c) => (
            <span className="postCat">{c.name}</span>
          ))}
        </div>
        <Link to={`/post/${post._id}`} className="link">
          <span className="postTitle">{post.title}</span>
        </Link>
        <hr />
        <span className="postDate">
          {new Date(post.createdAt).toDateString()}
        </span>
      </div>
      <p className="postDesc">{post.desc}</p>
    </div>
  );
}
