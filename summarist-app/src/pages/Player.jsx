import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function Player() {
  const { id } = useParams();

  const [book, setBook] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
        );

        if (!res.ok) {
          throw new Error(
            "Failed to fetch player data"
          );
        }

        const data = await res.json();

        setBook(data);
      } catch (error) {
        console.error(
          "Failed to fetch player data:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <>
        <Sidebar />

        <div className="page">
          <SearchBar />

          <Skeleton
            width="300px"
            height="40px"
          />

          <Skeleton
            width="200px"
            height="24px"
            style={{
              marginTop: "12px",
            }}
          />

          <Skeleton
            width="250px"
            height="350px"
            style={{
              marginTop: "20px",
              marginBottom: "20px",
            }}
          />

          <Skeleton
            width="100%"
            height="120px"
          />

          <Skeleton
            width="100%"
            height="54px"
            style={{
              marginTop: "24px",
            }}
          />
        </div>
      </>
    );
  }

  if (!book) {
    return (
      <>
        <Sidebar />

        <div className="page">
          <SearchBar />

          <h1>Book not found</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <Sidebar />

      <div className="page">
        <SearchBar />

        <h1>{book.title}</h1>

        <h3>{book.author}</h3>

        <img
          src={book.imageLink}
          alt={book.title}
          style={{
            width: "250px",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        />

        <p
          style={{
            whiteSpace: "pre-line",
          }}
        >
          {book.summary}
        </p>

        <audio
          controls
          style={{
            width: "100%",
            marginTop: "24px",
          }}
        >
          <source
            src={book.audioLink}
            type="audio/mpeg"
          />

          Your browser does not support the
          audio element.
        </audio>
      </div>
    </>
  );
}

export default Player;
