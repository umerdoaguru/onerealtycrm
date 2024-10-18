import React from "react";

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  // Calculate the total number of pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Ensure at least one page is displayed
  const safeTotalPages = totalPages === 0 ? 1 : totalPages;

  const createPaginationItems = () => {
    const items = [];
    for (let i = 1; i <= safeTotalPages; i++) {
      items.push(
        <li key={i}>
          <p
            onClick={() => onPageChange(i)}
            className={`flex items-center justify-center px-4 h-10 leading-tight font-medium cursor-pointer ${
              i === currentPage
                ? "text-white bg-blue-500"
                : "text-blue-500 bg-white border-gray-300"
            } border ${i === 1 ? "rounded-s-lg" : ""} ${
              i === safeTotalPages ? "rounded-e-lg" : ""
            } hover:bg-blue-600 `}
          >
            {i}
          </p>
        </li>
      );
    }
    return items;
  };

  return (
    <nav className="mt-6">
      <ul className="inline-flex -space-x-px text-base h-10 flex-wrap">
        {/* Previous Button */}
        <li>
          <p
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            className={`flex items-center justify-center px-4 h-10 ms-0 leading-tight ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100"
            } border border-e-0 rounded-s-lg`}
          >
            Previous
          </p>
        </li>

        {createPaginationItems()}

        {/* Next Button */}
        <li>
          <p
            onClick={() =>
              currentPage < safeTotalPages && onPageChange(currentPage + 1)
            }
            className={`flex items-center justify-center px-4 h-10 leading-tight ${
              currentPage === safeTotalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100"
            } border border-gray-300 rounded-e-lg`}
          >
            Next
          </p>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
