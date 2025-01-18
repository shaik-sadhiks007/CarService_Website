import React from "react";

function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    let startPage = Math.max(1, currentPage - 1); 
    let endPage = Math.min(totalPages, currentPage + 1); 

    if (currentPage === 1 && totalPages >= 3) {
      endPage = 3;
    } else if (currentPage === totalPages && totalPages >= 3) {
      startPage = totalPages - 2;
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index).map(
      (page) => (
        <li key={page} className={`page-item ${page === currentPage ? "active" : ""}`}>
          <button className="page-link" onClick={() => handlePageChange(page)}>
            {page}
          </button>
        </li>
      )
    );
  };

  return (
    <nav>
      <ul className="pagination justify-content-center">
        {/* First and Previous buttons */}
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => handlePageChange(1)}>
            &laquo;
          </button>
        </li>
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
            &lt;
          </button>
        </li>

        {/* Page numbers */}
        {renderPageNumbers()}

        {/* Next and Last buttons */}
        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
            &gt;
          </button>
        </li>
        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => handlePageChange(totalPages)}>
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
