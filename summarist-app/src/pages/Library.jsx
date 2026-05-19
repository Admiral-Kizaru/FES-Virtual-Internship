import { Link } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";

function Library() {

 const books =
  JSON.parse(
    localStorage.getItem("savedBooks")
  ) || [];

  return (
    <>
      <Sidebar />

      <div className="page">
        <SearchBar />

        <h1>My Library</h1>

        {books.length === 0 ? (
          <p
            style={{
              marginTop: "24px",
            }}
          >
            No saved books yet.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "24px",
              marginTop: "24px",
            }}
          >
            {books.map((book) => (
              <Link
                key={book.id}
                to={`/book/${book.id}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div>
                  <img
                    src={book.imageLink}
                    alt={book.title}
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                    }}
                  />

                  <h3
                    style={{
                      marginTop: "12px",
                    }}
                  >
                    {book.title}
                  </h3>

                  <p>{book.author}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Library;