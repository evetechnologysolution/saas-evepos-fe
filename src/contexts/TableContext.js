import React, { createContext, useState, useEffect } from "react";
import PropTypes from 'prop-types';
import axios from '../utils/axios';

export const tableContext = createContext({
    tableData: [],
    setTableData: () => { },
    getTableData: () => { },
    updateTableData: () => { },
    tableView: [],
    setTableView: () => { },
    resetTableView: () => { },
    handleMarkTable: () => { },
    tableSetting: [],
    setTableSetting: () => { },
    getTableSetting: () => { },
    createTableSetting: () => { },
    updateTableSetting: () => { },
    chooseTable: () => { },
    deleteTableSetting: () => { },
});


const TableContextProvider = ({ children }) => {
    const DATA = [
        // First Row
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5, type: 'wall' },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 },
        { id: 10 },
        { id: 11 },
        { id: 12, type: 'wall' },
        // Second Row
        { id: 13, type: 'open', number: '031' },
        { id: 14 },
        { id: 15 },
        { id: 16 },
        { id: 17 },
        { id: 18 },
        { id: 19 },
        { id: 20 },
        { id: 21 },
        { id: 22 },
        { id: 23 },
        { id: 24, type: 'wall' },
        // Third Row
        { id: 25 },
        { id: 26 },
        { id: 27 },
        { id: 28 },
        { id: 29 },
        { id: 30 },
        { id: 31 },
        { id: 32 },
        { id: 33 },
        { id: 34 },
        { id: 35 },
        { id: 36, type: 'wall' },
        // Forth Row
        { id: 37, type: 'open', number: '032' },
        { id: 38 },
        { id: 39 },
        { id: 40, type: 'open', number: '026' },
        { id: 41, type: 'wall' },
        { id: 42, type: 'open', number: '025' },
        { id: 43 },
        { id: 44 },
        { id: 45 },
        { id: 46, type: 'wall' },
        { id: 47, type: 'wall' },
        { id: 48, type: 'wall' },
        // Forth Row{ id: 49 },
        { id: 49 },
        { id: 50 },
        { id: 51 },
        { id: 52 },
        { id: 53, type: 'wall' },
        { id: 54 },
        { id: 55 },
        { id: 56, type: 'open', number: '017' },
        { id: 57 },
        { id: 58 },
        { id: 59, type: 'open' },
        { id: 60, type: 'wall' },
        { id: 61, type: 'open', number: '033' },
        { id: 62 },
        // Forth Row{ id: 63 },
        { id: 63 },
        { id: 64, type: 'open', number: '027' },
        { id: 65, type: 'wall' },
        { id: 66, type: 'open', number: '024' },
        { id: 67 },
        { id: 68 },
        { id: 69 },
        { id: 70 },
        { id: 71, type: 'open', number: '016' },
        { id: 72, type: 'wall' },
        { id: 73 },
        { id: 74 },
        { id: 75 },
        { id: 76 },
        { id: 77, type: 'wall' },
        { id: 78 },
        { id: 79 },
        { id: 80, type: 'open', number: '018' },
        { id: 81 },
        { id: 82 },
        { id: 83, type: 'open' },
        { id: 84, type: 'wall' },
        { id: 85, type: 'open', number: '034' },
        { id: 86 },
        { id: 87 },
        { id: 88, type: 'open', number: '028' },
        { id: 89, type: 'wall' },
        { id: 90, type: 'open', number: '023' },
        { id: 91 },
        { id: 92 },
        { id: 93 },
        { id: 94, type: 'wall' },
        { id: 95, type: 'wall' },
        { id: 96, type: 'wall' },
        { id: 97 },
        { id: 98 },
        { id: 99 },
        { id: 100 },
        { id: 101, type: 'wall' },
        { id: 102 },
        { id: 103 },
        { id: 104, type: 'open', number: '019' },
        { id: 105 },
        { id: 106 },
        { id: 107, type: 'open' },
        { id: 108, type: 'wall' },
        { id: 109, type: 'open', number: '035' },
        { id: 110 },
        { id: 111 },
        { id: 112, type: 'open', number: '029' },
        { id: 113, type: 'wall' },
        { id: 114, type: 'open', number: '022' },
        { id: 115 },
        { id: 116 },
        { id: 117 },
        { id: 118 },
        { id: 119, type: 'open', number: '015' },
        { id: 120, type: 'wall' },
        { id: 121 },
        { id: 122 },
        { id: 123 },
        { id: 124 },
        { id: 125, type: 'wall' },
        { id: 126 },
        { id: 127 },
        { id: 128, type: 'open', number: '020' },
        { id: 129 },
        { id: 130 },
        { id: 131, type: 'open' },
        { id: 132, type: 'wall' },
        { id: 133, type: 'open', number: '036' },
        { id: 134 },
        { id: 135 },
        { id: 136, type: 'open', number: '030' },
        { id: 137, type: 'wall' },
        { id: 138, type: 'open', number: '021' },
        { id: 139 },
        { id: 140 },
        { id: 141 },
        { id: 142, type: 'wall' },
        { id: 143, type: 'wall' },
        { id: 144, type: 'wall' },
    ];

    const [tableData, setTableData] = useState([]);

    const [tableView, setTableView] = useState([]);
    const [tableSetting, setTableSetting] = useState([]);

    const resetTableView = () => {
        setTableView([]);
    }

    const handleMarkTable = (roomId, tableId, status) => {
        // 1. Find room
        const roomIndex = tableSetting.findIndex((todo) => todo._id === roomId);

        // 2. Find table
        const tableIndex = tableSetting[roomIndex].table.findIndex((row) => row._id === tableId);

        // 3. Mark the table as close
        const updated = { ...tableSetting[roomIndex].table[tableIndex], status };

        // 3. Update the todo list with the updated todo
        const newData = [...tableSetting];

        newData[roomIndex].table[tableIndex] = updated;

        setTableSetting(newData);
    };

    // for table view
    const getTableData = async () => {
        try {
            await axios.get(`/table-view`).then((response) => {
                setTableData(response.data);
            });
        } catch (error) {
            console.error(error);
        }
    };

    const updateTableData = async (id, data) => {
        try {
            await axios.patch(`/table-view/update/${id}`, data);
        } catch (error) {
            console.error(error);
        }
    };

    const getTableSetting = async () => {
        try {
            await axios.get(`/table-setting`).then((response) => {
                setTableSetting(response.data);
            });
        } catch (error) {
            console.error(error);
        }
    };

    const createTableSetting = async (data) => {
        try {
            await axios.post(`/table-setting/create`, data);
        } catch (error) {
            console.error(error);
        }
    };

    const updateTableSetting = async (id, data) => {
        try {
            await axios.patch(`/table-setting/${id}`, data);
        } catch (error) {
            console.error(error);
        }
    };

    const chooseTable = async (roomId, tableId, data) => {
        try {
            await axios.patch(`/table-setting/update-table/${roomId}/${tableId}`, data);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteTableSetting = async (id) => {
        try {
            await axios.delete(`/table-setting/${id}`);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getTableSetting();
    }, []);

    return (
        <tableContext.Provider
            value={{
                tableData,
                setTableData,
                getTableData,
                updateTableData,
                tableView,
                setTableView,
                resetTableView,
                handleMarkTable,
                tableSetting,
                setTableSetting,
                getTableSetting,
                createTableSetting,
                updateTableSetting,
                chooseTable,
                deleteTableSetting,
            }}
        >
            {children}
        </tableContext.Provider>
    );
};

export default TableContextProvider;

// ----------------------------------------------------------------------

TableContextProvider.propTypes = {
    children: PropTypes.node,
};
