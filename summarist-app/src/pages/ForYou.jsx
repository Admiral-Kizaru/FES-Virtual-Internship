import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaPlay,
  FaRegClock,
  FaRegStar,
} from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";

const getBookDuration = (book) => {
  if (book.duration) return book.duration;

  if (book.title.includes("Win Friends")) return "03:24";
  if (book.title.includes("Hurt Me")) return "04:52";
  if (book.title === "Mastery") return "04:40";
  if (book.title === "Atomic Habits") return "03:24";
  if (book.title.includes("Talk to Anyone")) return "03:22";
  if (book.title === "Zero to One") return "03:24";
  if (book.title.includes("Rich Dad")) return "06:09";
  if (book.title.includes("10X")) return "03:18";
  if (book.title === "Deep Work") return "02:50";
  if (book.title.includes("5 Second")) return "02:45";

  return "03:24";
};

function BookCard({ book }) {
  return (
    <Link
      key={book.id}
      to={`/book/${book.id}`}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div className="book__card">
        <div className="book__cover">
          {book.subscriptionRequired && (
            <span className="book__pill">
              Premium
            </span>
          )}

          <img
            src={book.imageLink}
            alt={book.title}
          />
        </div>

        <div className="book__title">
          {book.title}
        </div>

        <div className="book__author">
          {book.author}
        </div>

        <div className="book__summary">
          {book.subTitle}
        </div>

        <div className="book__details">
          <span>
            <FaRegClock /> {getBookDuration(book)}
          </span>

          <span>
            <FaRegStar /> {book.averageRating}
          </span>
        </div>
      </div>
    </Link>
  );
}

function ForYou() {
  const [selectedBook, setSelectedBook] =
    useState(null);

  const [
    recommendedBooks,
    setRecommendedBooks,
  ] = useState([]);

  const [
    suggestedBooks,
    setSuggestedBooks,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const [
          selectedRes,
          recommendedRes,
          suggestedRes,
        ] = await Promise.all([
          fetch(
            "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected"
          ),
          fetch(
            "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended"
          ),
          fetch(
            "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested"
          ),
        ]);

        const selectedData =
          await selectedRes.json();
        const recommendedData =
          await recommendedRes.json();
        const suggestedData =
          await suggestedRes.json();

        setSelectedBook(
          Array.isArray(selectedData)
            ? selectedData[0]
            : selectedData
        );
        setRecommendedBooks(recommendedData);
        setSuggestedBooks(suggestedData);
      } catch (error) {
        console.error(
          "Failed to fetch books:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

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

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "24px",
              marginTop: "24px",
            }}
          >
            {[...Array(6)].map((_, index) => (
              <div key={index}>
                <Skeleton height={300} />

                <Skeleton
                  height={24}
                  style={{
                    marginTop: "12px",
                  }}
                />

                <Skeleton height={18} />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Sidebar />

      <div className="page">
        <SearchBar />

        {selectedBook && (
          <section
            style={{
              marginBottom: "64px",
            }}
          >
            <h2 className="section__title">
              Selected just for you
            </h2>

            <Link
              to={`/book/${selectedBook.id || 1}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "block",
              }}
            >
              <div className="selected__card">
                <div className="selected__card--left">
                  <p>
                    {selectedBook.subTitle ||
                      "How Constant Innovation Creates Radically Successful Businesses"}
                  </p>
                </div>

                <div className="selected__card--center">
                  <img
                    src={selectedBook.imageLink}
                    alt={selectedBook.title}
                  />
                </div>

                <div className="selected__card--right">
                  <h3>
                    {selectedBook.title}
                  </h3>

                  <p>
                    {selectedBook.author}
                  </p>

                  <div className="selected__card--audio">
                    <button
                      className="selected__play"
                      onClick={(event) => {
                        event.preventDefault();
                        window.location.href = `/player/${
                          selectedBook.id || 1
                        }`;
                      }}
                    >
                      <FaPlay />
                    </button>

                    <span>
                      3 mins 23 secs
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        <section
          style={{
            marginBottom: "64px",
          }}
        >
          <h2 className="section__title">
            Recommended For You
          </h2>

          <p className="section__subtitle">
            We think you'll like these
          </p>

          <div className="books__grid">
            {recommendedBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="section__title">
            Suggested Books
          </h2>

          <p className="section__subtitle">
            Browse those books
          </p>

          <div className="books__grid">
            {suggestedBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export default ForYou;
