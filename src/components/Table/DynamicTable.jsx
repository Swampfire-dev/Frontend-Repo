import React, { useState, useMemo } from 'react';
import { FaEye } from 'react-icons/fa';

const DynamicTable = ({
  data = [],
  columns = [],
  filterableKeys = [],
  recordsPerPage = 10,
  title = '',
  modal = true,
  className = '',
  onSearch = () => { },
  searchColumn = '',
  showSearch = true,
  dateKey = null,
}) => {
  // Temporary selections
  const [filters, setFilters] = useState({});
  const [searchText, setSearchText] = useState('');

  // Applied filters/search after clicking "Search"
  const [activeFilters, setActiveFilters] = useState({});
  const [activeSearch, setActiveSearch] = useState('');

  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);

  // Extract filter options
  const filterOptions = useMemo(() => {
    const options = {};

    filterableKeys.forEach(key => {
      if ((key === 'year' || key === 'month') && dateKey) {
        options[key] = [
          ...new Set(
            data
              .map(d => d[dateKey]?.split('-')[key === 'year' ? 0 : 1])
              .filter(Boolean)
          )
        ];
        return;
      }

      options[key] = [...new Set(data.map(d => d[key]).filter(Boolean))];
    });

    return options;
  }, [data, filterableKeys, dateKey]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    setActiveFilters(filters);
    setActiveSearch(searchText);
    setHasSearched(true);
    setCurrentPage(1);
    onSearch({ filters, searchText });
  };

  // Filtered & paginated data
  const filteredData = useMemo(() => {
    if (!hasSearched) return [];

    return data.filter(row => {
      const matchesSearch = activeSearch
        ? (searchColumn
          ? row[searchColumn]?.toString().toLowerCase().includes(activeSearch.toLowerCase())
          : Object.values(row).some(val => val?.toString().toLowerCase().includes(activeSearch.toLowerCase()))
        )
        : true;

      const matchesFilters = filterableKeys.every(key => {
        const val = activeFilters[key];
        if (!val) return true;
        if (key === 'year' && dateKey) return row[dateKey]?.split('-')[0] === val;
        if (key === 'month' && dateKey) return row[dateKey]?.split('-')[1] === val;
        return row[key]?.toString().toLowerCase().includes(val.toLowerCase());
      });

      return matchesSearch && matchesFilters;
    });
  }, [data, activeFilters, activeSearch, filterableKeys, hasSearched, searchColumn]);

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleModalOpen = (row) => {
    setModalData(row);
    setModalVisible(true);
  };

  const handleCloseModal = () => setModalVisible(false);

  return (
    <div className={`dynamic-table ${className}`} style={{ position: 'relative' }}>
      {title && <h3>{title}</h3>}

      {/* Filters and optional Search */}
      <div className="filter-bar" style={{ marginBottom: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {showSearch && searchColumn && (
          <input
            type="text"
            placeholder={`Search by ${searchColumn}`}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ padding: '5px 10px', width: '150px' }}
          />
        )}

        {filterableKeys.map(key => {
          const options = filterOptions[key] || [];
          if (key === 'month') {
            return (
              <select key={key} name={key} onChange={handleFilterChange} style={{ padding: '5px' }}>
                <option value="">All Months</option>
                {options.map(m => (
                  <option key={m} value={m}>
                    {new Date(0, parseInt(m) - 1).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            );
          }
          if (key === 'year') {
            return (
              <select key={key} name={key} onChange={handleFilterChange} style={{ padding: '5px' }}>
                <option value="">All Years</option>
                {options.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            );
          }
          return (
            <select key={key} name={key} onChange={handleFilterChange} style={{ padding: '5px' }}>
              <option value="">All {key}</option>
              {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          );
        })}

        <button onClick={handleSearch} style={{ padding: '5px 10px' }}>Search</button>
      </div>

      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#f1f1f1' }}>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>
                {col.label}
              </th>
            ))}
            {modal && <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {!hasSearched ? (
            <tr>
              <td colSpan={columns.length + (modal ? 1 : 0)} style={{ padding: '10px' }}>
                Please enter search or select filters and click Search
              </td>
            </tr>
          ) : paginatedData.length ? (
            paginatedData.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #ddd' }}>
                {columns.map(col => (
                  <td key={col.key} style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {modal && (
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleModalOpen(row)}
                      style={{
                        backgroundColor: '#007bff',
                        border: 'none',
                        borderRadius: 4,
                        color: 'white',
                        padding: '6px 10px',
                        cursor: 'pointer'
                      }}
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + (modal ? 1 : 0)} style={{ padding: '10px' }}>
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {hasSearched && filteredData.length > recordsPerPage && (
        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center', gap: 5 }}>
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>◀</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              style={{
                backgroundColor: currentPage === i + 1 ? '#007bff' : 'white',
                color: currentPage === i + 1 ? 'white' : 'black',
                border: '1px solid #ddd',
                borderRadius: 4,
              }}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>▶</button>
        </div>
      )}

      {/* Modal */}
      {modalVisible && modalData && (
        <div
          onClick={handleCloseModal}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#fff',
              padding: 20,
              borderRadius: 8,
              minWidth: 300,
              maxWidth: '90%',
              maxHeight: '80%',
              overflowY: 'auto',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            }}
          >
            <h3>Partner Certificate Details</h3>
            <button
              onClick={handleCloseModal}
              style={{
                marginBottom: 20,
                padding: '5px 10px',
                backgroundColor: '#007bff',
                border: 'none',
                borderRadius: 40,
                color: 'white',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
              {Object.entries(modalData).map(([key, value]) => (
                <div key={key} style={{
                  backgroundColor: '#f9f9f9',
                  padding: '10px 15px',
                  borderRadius: 8,
                  flex: '1 1 calc(20% - 16px)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  minWidth: 0,
                  minHeight: 80,
                }}>
                  <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 4, textTransform: 'capitalize' }}>{key}</label>
                  <span>{value?.toString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicTable;
