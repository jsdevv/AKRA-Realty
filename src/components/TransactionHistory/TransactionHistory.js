import React from 'react';
import { useTable } from 'react-table';
import './TransactionHistory.css';

const transactions = [
  {TransactionType:"Purchase", id: 1, date: '01-12-2022', amount: '₹ 2 Cr', status: 'Completed' },
  {TransactionType:"Rental", id: 2, date: '02-01-2023', amount: '₹ 60K', status: 'Completed' },
  {TransactionType:"Sale", id: 3, date: '03-07-2024', amount: '₹ 2.4 Cr', status: 'Listed' }
  

  // Add more transactions as needed
];

const TransactionHistory = () => {
  const data = React.useMemo(() => transactions, []);
  const columns = React.useMemo(
    () => [
      {
        Header: 'Transaction Type',
        accessor: 'TransactionType',
      },
      {
        Header: 'Transaction Date',
        accessor: 'date',
      },
      { 
        Header: 'Transaction Amount',
        accessor: 'amount',
      },
      {
        Header: 'Transaction Status',
        accessor: 'status',
        Cell: ({ value }) => (
          <span className={value.toLowerCase()}>{value}</span>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <div className="transaction-history">
      <h3>Transaction History</h3>
      <table {...getTableProps()} className="transaction-table">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;
