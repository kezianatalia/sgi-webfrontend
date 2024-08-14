// CustomSearchToolbar.js
import React, { useState } from 'react';

import MDBox from '../../../../components/MDBox';
import MDInput from '../../../../components/MDInput';
import MDButton from '../../../../components/MDButton';

const SearchToolbarTable = ({ onSearch }) => {
  const [searchText, setSearchText] = useState("");

  const handleSearchClick = () => {
    onSearch(searchText);
  };

  return (
    <MDBox display="flex" alignItems="center" justifyContent="flex-end" mr={2} my={2}>
      <MDInput
        variant="outlined"
        placeholder="Search"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        size="small"
        style={{ marginRight: '8px', width: '300px' }}
      />
      <MDButton
        size="small"
        variant="contained"
        color="dark"
        onClick={handleSearchClick}
      >
        Search
      </MDButton>
    </MDBox>
  );
};

export default SearchToolbarTable;
