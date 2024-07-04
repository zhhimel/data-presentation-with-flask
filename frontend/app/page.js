"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'rc-table';
import './TradeTable.css';

const TradeTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [editingRow, setEditingRow] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [searchOption, setSearchOption] = useState('trade_code');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTradeCode, setSelectedTradeCode] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('http://127.0.0.1:5000/trades');
        setData(result.data);
        setFilteredData(result.data);
      } catch (error) {
        console.error('Error fetching trade data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, searchOption]);

  const columns = [
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Trade Code', dataIndex: 'trade_code', key: 'trade_code' },
    { title: 'High', dataIndex: 'high', key: 'high' },
    { title: 'Low', dataIndex: 'low', key: 'low' },
    { title: 'Open', dataIndex: 'open', key: 'open' },
    { title: 'Close', dataIndex: 'close', key: 'close' },
    { title: 'Volume', dataIndex: 'volume', key: 'volume' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <span>
          <button className='crud-buttons' style={{ color: 'grey' }} onClick={() => handleEdit(record)}>
            Edit
          </button>
          <button className='crud-buttons' style={{ color: 'red' }} onClick={() => handleDelete(record)}>
            Delete
          </button>
        </span>
      ),
    },
  ];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(filteredData.length / itemsPerPage)));
  };

  const handlePageChange = (e) => {
    const pageNumber = Number(e.target.value);
    if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= Math.ceil(filteredData.length / itemsPerPage)) {
      setCurrentPage(pageNumber);
    }
  };

  const handleEdit = (record) => {
    setEditingRow(record.id);
    setEditedValues({ ...record });
    setShowModal(true);
  };

  const cancelEdit = () => {
    setEditingRow(null);
    setEditedValues({});
    setShowModal(false);
  };

  const handleDelete = async (record) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/trades/${record.id}`);
      const newData = data.filter((item) => item.id !== record.id);
      setData(newData);
      setFilteredData(newData);
    } catch (error) {
      console.error('Error deleting trade:', error);
    }
  };

  const handleAddRow = () => {
    setEditedValues({});
    setShowAdd(true);
  };

  const handleSearch = () => {
    if (searchQuery === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) =>
        item[searchOption].toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
    setCurrentPage(1);
  };

  const handleTradeCodeChange = (e) => {
    setSelectedTradeCode(e.target.value);
  };

  return (
    <div className='container'>
      <h1>Trade Data Visualization</h1>
      <div className='sub-container'>
        <div>
          <button className='crud-buttons' style={{ color: 'black' }} onClick={handleAddRow}>
            Add Row
          </button>
        </div>
        <div className="search-container">
          <select value={searchOption} onChange={(e) => setSearchOption(e.target.value)}>
            <option value="trade_code">Trade Code</option>
            <option value="date">Date</option>
          </select>
          <input
            type="text"
            placeholder={`Search by ${searchOption.replace('_', ' ')}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <Table columns={columns} data={currentItems} rowKey="id" />
      <div className="pagination">
        <button className="crud-buttons" onClick={handlePrevPage}>Previous</button>
        <input type="text" value={currentPage} onChange={handlePageChange} />
        <button className="crud-buttons" onClick={handleNextPage}>Next</button>
      </div>
      <div className="total-count">
        <p>Total Number of Trades: {filteredData.length}</p>
      </div>
    </div>
  );
};

export default TradeTable;
