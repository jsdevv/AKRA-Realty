import React, {useMemo, useCallback } from 'react';
import { useTable } from 'react-table';
import './AgentTable.css';


const AgentTable = ({ agents, onAgentClick }) => {






  const columns = useMemo(() => [
    {
      Header: 'Agent',
      accessor: 'image',
      Cell: ({ value, row }) => (
        <img
          src={value}
          alt={`Agent ${row.original.agentname}`}
          className="agent-table__image"
        />
      ),
    },
    {
      Header: 'Name',
      accessor: 'agentname',
      Cell: ({ value }) => (
        <span
          className="agent-table__name"
        >
          {value}
        </span>
      ),
    },
    {
      Header: 'PriceRange',
      accessor: 'PriceRange',
    },
    {
      Header: 'Transactions',
      accessor: 'transactions',
    },
    {
      Header: 'Avg Closing',
      accessor: 'avgClosing',
    },
    {
      Header: 'Rating',
      accessor: 'rating',
      Cell: ({ value }) => (
        <div className="agent-table__rating">
          {[...Array(Math.floor(value))].map((_, i) => (
            <span key={i} className="agent-table__star">&#9733;</span>
          ))}
          {value % 1 !== 0 && <span className="agent-table__star">&#9734;</span>}
        </div>
      ),
    },
    {
      Header: 'Active Listings',
      accessor: 'activeListings',
      Cell: ({ value, row }) => (
        <span
          className="agent-table__listings"
  
        >
          {value}
        </span>
      ),
    },
  ], []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: agents,
  });



  return (
    <div className="agent-table-container">
  
        <table className="agent-table" {...getTableProps()}>
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
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} data-label={cell.column.Header}>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
    
    </div>
  );
};

export default AgentTable;
