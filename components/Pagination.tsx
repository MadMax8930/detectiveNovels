import React from 'react'
import { FiArrowLeftCircle, FiArrowRightCircle } from 'react-icons/fi'
import { PaginationProps } from '@/types'

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
   const handlePageChange = (page: number) => { onPageChange(page) };

   const renderPaginationItem = (page: number) => (
      <div
         key={page}
         className={`pagination-item ${currentPage === page ? 'active' : ''}`}
         onClick={() => handlePageChange(page)}
      >
         {page}
      </div>
   );

   const renderPaginationItems = () => {
      const items = [];
      const maxVisiblePages = 5;
      const startIdx = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
      const endIdx = Math.min(startIdx + maxVisiblePages - 1, totalPages);
    
      if (startIdx > 1) { items.push(<div key="start-ellipsis" className="text-brown-dots">...</div>); }
    
      for (let i = startIdx; i <= endIdx; i++) { items.push(renderPaginationItem(i)); }
    
      if (endIdx < totalPages) { items.push(<div key="end-ellipsis" className="text-brown-dots">...</div>); }
    
      return items;
   };

   return (
      <div className="pagination-container">
         <FiArrowLeftCircle
            className={`pagination-arrow ${currentPage === 1 ? 'disabled' : ''}`}
            onClick={() => handlePageChange(currentPage - 1)}
         />
         {renderPaginationItems()}
         <FiArrowRightCircle
            className={`pagination-arrow ${currentPage === totalPages ? 'disabled' : ''}`}
            onClick={() => { 
               if (currentPage < totalPages) { 
                  handlePageChange(currentPage + 1)
               }
            }}
         />
      </div>
   );
};

export default Pagination