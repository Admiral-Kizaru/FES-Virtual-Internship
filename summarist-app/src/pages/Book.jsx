import { useEffect, useState } from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import Skeleton from "react-loading-skeleton";

import "react-loading-skeleton/dist/skeleton.css";

import {
  FaBookOpen,
  FaMicrophone,
  FaRegBookmark,
  FaRegClock,
  FaRegLightbulb,
  FaRegStar,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";

const fallbackBook = {
  id: "18tro3gle2p",
  title: "How to Talk to Anyone",
  author: "Leil Lowndes",
  subTitle: "92 Little Tricks for Big Success in Relationships",
  imageLink:
    "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Fimages%2Fhow-to-talk-to-anyone.png?alt=media&token=48f77463-a093-42b4-8f1f-82fa4edd044c",
  averageRating: 4.6,
  totalRating: 624,
  keyIdeas: 4,
  duration: "03:22",
  type: "Audio & Text",
  tags: ["Communication Skills"],
  subscriptionRequired: false,
  bookDescription:
    "\"How to Talk to Anyone\" is a self-help book written by communication expert and author, Leil Lowndes. The book provides practical tips, techniques, and strategies for improving your social skills and communication abilities in various settings. Lowndes offers advice on topics such as making a great first impression, building rapport, maintaining conversation flow, and overcoming shyness or social anxiety. The book is designed to help readers become more confident and charismatic communicators, and to enhance their personal and professional relationships.",
  authorDescription:
    "Leil Lowndes is a renowned author, motivational speaker, and communication expert. She has written several self-help books on communication, relationships, and personal development, including the international bestseller \"How to Talk to Anyone.\" Lowndes has over 25 years of experience coaching individuals, executives, and teams from various industries and backgrounds. She has been featured in major media outlets such as The New York Times, The Wall Street Journal, and CNN, and has appeared on numerous TV and radio programs. Lowndes' work focuses on helping individuals improve their social skills, build confidence, and enhance their relationships both personally and professionally.",
};

function Book() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { user, openAuthModal } =
    useAuth();

  const [book, setBook] =
    useState(fallbackBook);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
        );

        if (res.ok) {
          const data =
            await res.json();

          if (data) {
            setBook({
              ...fallbackBook,
              ...data,
              duration:
                data.duration ||
                fallbackBook.duration,
              tags:
                data.tags ||
                fallbackBook.tags,
            });
          }
        }
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

    navigate(
      `/player/${book.id || fallbackBook.id}`
    );
  };

  const handleSaveBook = () => {
    if (!user) {
      openAuthModal("login");

      return;
    }

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

  if (loading) {
    return (
      <>
        <Sidebar />

        <div className="page">
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
        </div>
      </>
    );
  }

  return (
    <>
      <Sidebar />

      <div className="page">
        <SearchBar />

        <div className="book__layout">
          <div className="book__info">
            <h1 className="book__main--title">
              {book.title}
            </h1>

            <h2 className="book__main--author">
              {book.author}
            </h2>

            <p className="book__main--subtitle">
              {book.subTitle}
            </p>

            <div className="book__stats">
              <span>
                <FaRegStar /> {book.averageRating} (
                {book.totalRating} ratings)
              </span>

              <span>
                <FaRegClock /> {book.duration}
              </span>

              <span>
                <FaMicrophone /> {book.type}
              </span>

              <span>
                <FaRegLightbulb /> {book.keyIdeas} Key
                ideas
              </span>
            </div>

            <div className="book__buttons">
              <button
                onClick={
                  handleReadListen
                }
              >
                <FaBookOpen /> Read
              </button>

              <button
                onClick={
                  handleReadListen
                }
              >
                <FaMicrophone /> Listen
              </button>
            </div>

            <button
              className="library__btn"
              onClick={
                handleSaveBook
              }
            >
              <FaRegBookmark /> Add title to My Library
            </button>

            <h3 className="book__section--title">
              What's it about?
            </h3>

            <div className="book__tags">
              {(book.tags || fallbackBook.tags).map(
                (tag) => (
                  <span key={tag}>
                    {tag}
                  </span>
                )
              )}
            </div>

            <p className="book__description">
              {book.bookDescription}
            </p>

            <h3 className="book__section--title">
              About the author
            </h3>

            <p className="book__description">
              {
                book.authorDescription
              }
            </p>
          </div>

          <div className="book__image">
            <img
              src={book.imageLink}
              alt={book.title}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Book;
