import { FaSearch } from "react-icons/fa";

function SearchBar() {
  return (
    <div className="searchbar">
      <input
        type="text"
        placeholder="Search for books"
      />

      <FaSearch className="searchbar__icon" />
    </div>
  );
}

export default SearchBar;