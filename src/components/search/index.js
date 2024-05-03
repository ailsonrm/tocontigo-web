import React, { useContext, useState, useEffect } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import styled from 'styled-components';
import unorm from 'unorm';
import { IoSearchOutline } from 'react-icons/io5';
import {
  SearchContainer,
  SearchTypeContainer,
  SearchStateContainer,
  CustomSelect
} from './styles';

const SearchBox = styled.div`
  width: 100%;
`;

const StyledForm = styled(Form)`
  gap: 10px;
  width: 100%;

  .form-control {
    padding-left: 32px;
    border-radius: 50px !important;
    ::placeholder {
      color: #a7a7a7;
      font-style: italic;
    }
  }
`;

const SearchIconBox = styled.div`
  position: absolute;
  left: 10px;
  top: 6px;
  z-index: 5;
  color: #a7a7a7;
  font-size: 20px;
`;

const Search = ({
  data,
  fields,
  placeholder,
  setSearchResult
}) => {
  const [searchText, setSearchText] = useState(null);

  const handleSearch = () => {
    let filteredData = data;
    
    if (searchText) {
      const normalizedSearchText = unorm
        .nfd(searchText)
        .replace(/[\u0300-\u036f]/g, '')
        .trim();


      filteredData = data.filter(item =>
        fields.some(field =>
          field
            .split('.')
            .reduce((obj, prop) => obj?.[prop], item)
            ?.toString()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .includes(normalizedSearchText.toLowerCase())
        )
      );
    }

    setSearchResult(filteredData);
  };

  useEffect(() => {
    handleSearch();
  }, [data, searchText]);

  return (
    <SearchContainer>
      <StyledForm className="d-flex">
        <InputGroup>
          <SearchIconBox>
            <IoSearchOutline />
          </SearchIconBox>
          <Form.Control
            type="search"
            autoFocus
            placeholder={placeholder}
            value={searchText}
            onChange={event => {
              setSearchText(event.target.value);
            }}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                event.preventDefault();
              }
            }}
          />
        </InputGroup>
      </StyledForm>
    </SearchContainer>
  );
};

export default Search;
