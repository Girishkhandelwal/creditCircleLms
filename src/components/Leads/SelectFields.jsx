import React, { useState, useEffect, useRef } from 'react';

const SelectFields = ({ label, options, selectedOptions, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const ref = useRef(null);

  const handleCheckboxChange = (option) => {
    const updatedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((selected) => selected !== option)
      : [...selectedOptions, option];

    onChange(updatedOptions);
  };


  const handleSelectAll = () => {
    if (!selectAll) {
      onChange(options);
    } else {
      onChange([]);
    }
    setSelectAll(!selectAll);
  };

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );


  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        type="button"
        className=" w-[23vh] justify-center  rounded-md border border-gray-300 p-2"
        id="options-menu"
        onClick={() => setIsOpen(!isOpen)}

      >
        {label}
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-y-auto max-h-96 z-[999]">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded-md p-2 mb-2"
            />

            <div className="flex items-center px-4 py-2">
              <input
                type="checkbox"
                id="select-all"
                checked={selectAll}
                onChange={handleSelectAll}
                className="mr-2"
              />
              <label htmlFor="select-all">Select All</label>
            </div>

            {filteredOptions.map((option) => (
              <div key={option} className="flex items-center px-4 py-2">
                <input
                  type="checkbox"
                  id={option}
                  checked={selectedOptions.includes(option)}
                  onChange={() => handleCheckboxChange(option)}
                  className="mr-2"
                />
                <label htmlFor={option}>{option}</label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectFields;
