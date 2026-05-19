import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { useAuth } from "../context/AuthContext";

import Sidebar from "../components/Sidebar";

function Book() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { user, openAuthModal } =
    useAuth();

  const [book, setBook] = useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
        );

        if (!res.ok) {
          throw new Error(
            "Failed to fetch book"
          );
        }

        const data = await res.json();

        setBook(data);
      } catch (error) {
        console.error(
          "Failed to fetch book:",
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
          <>
            <Skeleton
              width="300px"
              height="400px"
            />

            <Skeleton
              width="60%"
              height="40px"
            />

            <Skeleton
              width="40%"
              height="24px"
            />

            <Skeleton
              width="100%"
              height="120px"
            />
          </>
        </div>
      </>
    );
  }

  if (!book) {
    return (
      <>
        <Sidebar />

        <div className="page">
          <h1>Book not found</h1>
        </div>
      </>
    );
  }

  const handleReadListen = () => {
    if (!user) {
      openAuthModal("login");
      return;
    }

    const isSubscribed =
      user?.subscription ===
        "premium" ||
      user?.subscription ===
        "premium-plus";

    if (
      book.subscriptionRequired &&
      !isSubscribed
    ) {
      navigate("/choose-plan");
      return;
    }

    navigate(`/player/${book.id}`);
  };

  const handleSaveBook = () => {
    const savedBooks =
      JSON.parse(
        localStorage.getItem(
          "savedBooks"
        )
      ) || [];

    const alreadySaved =
      savedBooks.find(
        (item) => item.id === book.id
      );

    if (alreadySaved) return;

    savedBooks.push(book);

    localStorage.setItem(
      "savedBooks",
      JSON.stringify(savedBooks)
    );
  };

  return (
    <>
      <Sidebar />

      <div className="page">
        <div className="book-page">
          <img
            src={book.imageLink}
            alt={book.title}
            style={{
              width: "300px",
              marginBottom: "20px",
            }}
          />

          <h1>{book.title}</h1>

          <h2>{book.author}</h2>

          <p>{book.subTitle}</p>

          {book.subscriptionRequired && (
            <div className="book-pill">
              Premium
            </div>
          )}

          <p>
            <strong>
              Average Rating:
            </strong>{" "}
            {book.averageRating}
          </p>

          <p>
            <strong>
              Total Ratings:
            </strong>{" "}
            {book.totalRating}
          </p>

          <p>
            <strong>Key Ideas:</strong>{" "}
            {book.keyIdeas}
          </p>

          <p>
            {book.bookDescription}
          </p>

          <h3>About the Author</h3>

          <p>
            {book.authorDescription}
          </p>

          <button
            onClick={handleReadListen}
          >
            Read
          </button>

          <button
            onClick={handleReadListen}
          >
            Listen
          </button>

          <button
            onClick={handleSaveBook}
          >
            Add to Library
          </button>
        </div>
      </div>
    </>
  );
}

export default Book;