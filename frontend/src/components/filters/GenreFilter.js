import { useState } from "react";

export default function GenreFilter({ onGenreChange }) {
  const [genre, setGenre] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setGenre(value);
    onGenreChange(value);
  };

  return (
   /* <div style={{ display: "flex", justifyContent: "center", padding: "10px" }}>*/
    <div style={{ display: "flex", justifyContent: "center", padding: "12px", marginTop: "80px" }}>
      <select value={genre} onChange={handleChange}>
        <option value="">All Genres</option>
        <option value="Drama">Drama</option>
        <option value="Action">Action</option>
        <option value="Comedy">Comedy</option>
        <option value="Thriller">Thriller</option>
        <option value="Sci-Fi">Sci-Fi</option>
        <option value="Animation">Animation</option>
        <option value="Family">Family</option>
        <option value="Fantasy">Fantasy</option>
        <option value="History">History</option>
        <option value="Horror">Horror</option>
        <option value="Adventure">Adventure</option>
      </select>
    </div>
  );
  /*return (
    <div style={{ padding: 20, background: "yellow" }}>
      GENRE FILTER IS RENDERING
      <select value={genre} onChange={handleChange}>
        <option value="">All Genres</option>
        <option value="Drama">Drama</option>
      </select>
    </div>
  );*/
}