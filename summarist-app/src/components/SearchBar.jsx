import { FaSearch } from "react-icons/fa";

function SearchBar({
  value,
  onChange,
}) {
  const inputProps =
    value === undefined
      ? {}
      : { value };

  return (
    <div className="searchbar">
      <input
        type="text"
        placeholder="Search for books"
        {...inputProps}
        onChange={(event) =>
          onChange?.(event.target.value)
        }
      />

      <FaSearch className="searchbar__icon" />
    </div>
  );
}

export default SearchBar;
