import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";

function ForYou() {
  const [selectedBook, setSelectedBook] = useState(null);

  const [recommendedBooks, setRecommendedBooks] = useState([]);

  const [suggestedBooks, setSuggestedBooks] = useState([]);

  const [loading, setLoading] = useState(true);

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

        setSelectedBook(selectedData);

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

        {/* SELECTED BOOK */}

{selectedBook && (
  <section
    style={{
      marginBottom: "64px",
    }}
  >
    <h2 className="section__title">
      Selected For You
    </h2>

    <p className="section__subtitle">
      Curated based on your interests
    </p>

    <Link
  to="/book/1"
  className="selected__book--link"
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div className="selected__book">
        <img
          className="selected__book--img"
          src={
            selectedBook.imageLink ||
            "https://covers.openlibrary.org/b/id/10523338-L.jpg"
          }
          alt={selectedBook.title}
        />

        <div className="selected__book--content">
          <div className="selected__book--badge">
            Editor's Pick
          </div>

          <h2 className="selected__book--title">
            {selectedBook.title}
          </h2>

          <h3 className="selected__book--author">
            {selectedBook.author}
          </h3>

          <p className="selected__book--subtitle">
            {selectedBook.subTitle}
          </p>

          <div className="book__details">
            <span>
              ⭐{" "}
              {selectedBook.averageRating}
            </span>

            <span>
              {selectedBook.subscriptionRequired
                ? "Premium"
                : "Free"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  </section>
)}

        {/* RECOMMENDED BOOKS */}

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
      <Link
        key={book.id}
        to={`/book/${book.id}`}
        style={{
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <div className="book__card">
          <img
            src={book.imageLink}
            alt={book.title}
          />

          <div className="book__title">
            {book.title}
          </div>

          <div className="book__author">
            {book.author}
          </div>

          <div className="book__details">
            <span>
              ⭐ {book.averageRating}
            </span>

            <span>
              {book.subscriptionRequired
                ? "Premium"
                : "Free"}
            </span>
          </div>
        </div>
      </Link>
    ))}
  </div>
</section>

{/* SUGGESTED BOOKS */}

<section>
  <h2 className="section__title">
    Suggested Books
  </h2>

  <p className="section__subtitle">
    Hand-picked reads for you
  </p>

  <div className="books__grid">
    {suggestedBooks.map((book) => (
      <Link
        key={book.id}
        to={`/book/${book.id}`}
        style={{
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <div className="book__card">
          <img
            src={book.imageLink}
            alt={book.title}
          />

          <div className="book__title">
            {book.title}
          </div>

          <div className="book__author">
            {book.author}
          </div>

          <div className="book__details">
            <span>
              ⭐ {book.averageRating}
            </span>

            <span>
              {book.subscriptionRequired
                ? "Premium"
                : "Free"}
            </span>
          </div>
        </div>
      </Link>
    ))}
  </div>
</section>
      </div>
    </>
  );
}

export default ForYou;