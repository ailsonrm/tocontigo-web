import React from 'react';
import { Pagination } from 'react-bootstrap';
import styled from 'styled-components';

const CustomPagination = styled(Pagination)`
  .page-item.active .page-link {
    background-color: #403c3f;
    border-color: #403c3f;
  }
  .page-link {
    color: #6e8a94;
  }
  .page-link:hover {
    background-color: #8a5e5e;
    border-color: #8a5e5e;
  }
  .page-item.disabled .page-link {
    color: #6c757d;
  }
`;

const GridPagination = ({ page, totalPages, onPageChange }) => {
  const createPaginationItems = () => {
    let items = [];
    const maxPageNumbersToShow = 5;
    const leftOffset = Math.max(1, page - Math.floor(maxPageNumbersToShow / 2));
    const rightOffset = Math.min(
      totalPages,
      page + Math.floor(maxPageNumbersToShow / 2)
    );

    if (leftOffset > 1) {
      items.push(
        <Pagination.Item key={1} onClick={() => onPageChange(1)}>
          1
        </Pagination.Item>
      );
      if (leftOffset > 2) {
        items.push(<Pagination.Ellipsis key="start-ellipsis" />);
      }
    }

    for (let number = leftOffset; number <= rightOffset; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === page}
          onClick={() => onPageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    if (rightOffset < totalPages) {
      if (rightOffset < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="end-ellipsis" />);
      }
      items.push(
        <Pagination.Item
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
  };

  return (
    <CustomPagination>
      <Pagination.First onClick={() => onPageChange(1)} disabled={page === 1} />
      <Pagination.Prev
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      />
      {createPaginationItems()}
      <Pagination.Next
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      />
      <Pagination.Last
        onClick={() => onPageChange(totalPages)}
        disabled={page === totalPages}
      />
    </CustomPagination>
  );
};

export default GridPagination;
