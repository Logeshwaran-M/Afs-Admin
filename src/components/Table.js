import React from 'react';

const Table = ({ columns, data, onRowClick }) => {
  if (!data || data.length === 0) {
    return (
      <div className="table-empty">
        <p>No data found</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              onClick={() => onRowClick && onRowClick(row)}
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {col.accessor ? 
                    (typeof col.accessor === 'function' ? 
                      col.accessor(row) : 
                      row[col.accessor]
                    ) : 
                    row[col.field]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;