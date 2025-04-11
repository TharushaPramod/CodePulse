import React from 'react';

const PostViweComponent = ({ rows }) => {
  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }} border="1">
        <thead style={{ backgroundColor: '#f2f2f2' }}>
          <tr>
            <th style={{ padding: '8px' }}>#</th>
            <th style={{ padding: '8px' }}>ID</th>
            <th style={{ padding: '8px' }}>Description</th>
            <th style={{ padding: '8px' }}>Phone</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id}>
              <td style={{ padding: '8px' }}>{index + 1}</td>
              <td style={{ padding: '8px' }}>{row.id}</td>
              <td style={{ padding: '8px' }}>{row.description}</td>
              <td style={{ padding: '8px' }}>123-456-7890</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PostViweComponent;
