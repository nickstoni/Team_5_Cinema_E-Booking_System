// Add parameters to connect to database to display movie

function DetailsPage() {
    const movie_title = "MOVIE TITLE";
    const video_link = "https://www.youtube.com/embed/8ugaeA-nMTc?si=305uIz7XSSTctIBe";
    const length = "1 HR 30 MIN";
    const age_rating = "G";
    const release_date = "January 1, 20XX";
    const genre = "GENRE";
    const summary = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    const poster = "https://i.ebayimg.com/00/s/MTYwMFgxMDM1/z/Sv8AAOSwb7Rc0l0P/$_57.JPG?set_id=8800005007";
    const rating = "100"
    return(
        <div className="details_page">
            <div className="video">
                <iframe src={video_link} height="400px" width="100%" title="YouTube video player"  />
            </div>
            <h1>{movie_title}</h1>
            <h1>⭐ - {rating}/100</h1>
            <div className="desc">
                <div className="info">
                    {length} | {age_rating}
                    <br />
                    {release_date} | {genre}
                </div>
                <div className="summary">
                    {summary}
                </div>
            </div>
            <br />
            <img src={poster} height="500px" alt="Movie Poster" />
            
            <h1>Available Showtimes</h1>
            <ul className="showtimes">
                <li>2:00 PM</li>
                <li>5:00 PM</li>
                <li>8:00 PM</li>
            </ul>
        </div>
    )  
}

export default DetailsPage;