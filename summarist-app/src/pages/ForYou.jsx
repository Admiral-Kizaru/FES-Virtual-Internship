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
              marginBottom: "48px",
            }}
          >
            <h1>Selected For You</h1>

            <Link
              to={`/book/${selectedBook.id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "24px",
                  marginTop: "24px",
                  alignItems: "center",
                }}
              >
                <img
                  src={selectedBook.imageLink}
                  alt={selectedBook.title}
                  style={{
                    width: "220px",
                    borderRadius: "8px",
                  }}
                />

                <div>
                  <h2>
                    {selectedBook.title}
                  </h2>

                  <h3>
                    {selectedBook.author}
                  </h3>

                  <p>
                    {selectedBook.subTitle}
                  </p>

                  {selectedBook.subscriptionRequired && (
                    <div
                      style={{
                        background: "gold",
                        color: "black",
                        display: "inline-block",
                        padding:
                          "4px 12px",
                        borderRadius:
                          "999px",
                        marginTop: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      Premium
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* RECOMMENDED BOOKS */}

        <section
          style={{
            marginBottom: "48px",
          }}
        >
          <h1>Recommended</h1>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "24px",
              marginTop: "24px",
            }}
          >
            {recommendedBooks.map((book) => (
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

                  {book.subscriptionRequired && (
                    <div
                      style={{
                        background:
                          "gold",
                        color: "black",
                        display:
                          "inline-block",
                        padding:
                          "4px 12px",
                        borderRadius:
                          "999px",
                        marginTop: "8px",
                        fontWeight:
                          "bold",
                      }}
                    >
                      Premium
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SUGGESTED BOOKS */}

        <section>
          <h1>Suggested</h1>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "24px",
              marginTop: "24px",
            }}
          >
            {suggestedBooks.map((book) => (
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

                  {book.subscriptionRequired && (
                    <div
                      style={{
                        background:
                          "gold",
                        color: "black",
                        display:
                          "inline-block",
                        padding:
                          "4px 12px",
                        borderRadius:
                          "999px",
                        marginTop: "8px",
                        fontWeight:
                          "bold",
                      }}
                    >
                      Premium
                    </div>
                  )}
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