import React, { useState, useEffect, useMemo } from 'react';
import { useTable } from 'react-table';
import useGithubUsers from '../../Hooks/useGithubUsers';

function GithubUserSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const { loading, error, users } = useGithubUsers(searchQuery);

  // Debounce user input
  const delayedSearch = useMemo(() => {
    return debounce((value) => setSearchQuery(value), 500);
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    delayedSearch(value);
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Username',
        accessor: 'login',
      },
      {
        Header: 'Profile URL',
        accessor: 'html_url',
        Cell: ({ value }) => (
          <a href={value} target="_blank" rel="noopener noreferrer">
            {value}
          </a>
        ),
      },
      {
        Header: 'Followers',
        accessor: 'followers',
      },
    ],
    []
  );

  const data = users;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  return (
    <div>
      <h1>Github User Search</h1>
      <input
        type="text"
        placeholder="Search Github Users"
        value={searchQuery}
        onChange={handleSearch}
      />
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <table {...getTableProps()} style={{ width: '100%' }}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default GithubUserSearch;

// Debounce function to delay search query updates
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}
