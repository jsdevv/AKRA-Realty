import { useEffect, useRef, useState } from "react";
import { MdBusiness } from "react-icons/md";
import { IoChevronDown } from "react-icons/io5";
import {
  useCustomList,
  useMenu,
  useRefinementList,
} from "../context/TypesenseContext";

export function DropdownFilter({ attribute, options }) {
  const { items: types, refine } = useMenu({
    attribute: attribute,
    sortBy: ["name"],
    options: options,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [btnText, setBtnText] = useState("");

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const selectedTypes = types
      .filter((type) => type.isRefined)
      .map((type) => type.value.replace(/_/g, " "));
    setBtnText(selectedTypes.length ? selectedTypes.join(", ") : "");

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [types]); // Add `types` as a dependency

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button className="dropdown-toggle" onClick={toggleDropdown}>
        <MdBusiness className="fa-home" /> {btnText || "Select Status"}
        <IoChevronDown className="icon" />
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          {types.map((option) => (
            <button
              key={option.value}
              className={`dropdown-item ${option.isRefined ? "selected" : ""}`}
              onClick={() => refine(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function MultiselectFilter({ attribute, label, icon, options }) {
  const { items: types, refine } = useRefinementList({
    attribute: attribute,
    sortBy: ["name"],
    options: options,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [btnText, setBtnText] = useState(label);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [types]); // Add `types` as a dependency

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button className="dropdown-toggle" onClick={toggleDropdown}>
        {icon} {btnText}
        <IoChevronDown className="icon" />
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          {types.map((option) => (
            <label key={option.value} className="dropdown-item">
              <input
                type="checkbox"
                value={option.value}
                checked={option.isRefined}
                onChange={() => refine(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export function CustomMultiselectFilter({
  attribute,
  label,
  icon,
  options,
  isNumericRange,
}) {
  const {
    items: types,
    refine,
  } = useCustomList({
    attribute: attribute,
    sortBy: ["name"],
    options: options,
    isNumericRange: isNumericRange,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [btnText, setBtnText] = useState(label);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [types]); // Add `types` as a dependency

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button className="dropdown-toggle" onClick={toggleDropdown}>
        {icon} {btnText}
        <IoChevronDown className="icon" />
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          {types.map((option) => (
            <label key={option.value} className="dropdown-item">
              <input
                type="checkbox"
                value={option.value}
                checked={option.isRefined}
                onChange={() => refine(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

