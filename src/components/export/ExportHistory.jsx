// src/components/export/ExportHistory.jsx
import { useState } from 'react';
import Icon from '../Icon';
import { Icons } from '../Icons';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function ExportHistory({ purchases, darkMode }) {
  const [showMenu, setShowMenu] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const prepareData = () => {
    return purchases.map(p => ({
      'Signal ID': p.id,
      'Pair': p.pair,
      'Market': p.market,
      'Provider': p.provider,
      'Amount': `$${p.amount}`,
      'Date': formatDate(p.date),
      'Status': p.status,
      'P&L': p.pnl || 'N/A',
      'Entry': p.entry,
      'Take Profit': p.tp,
      'Stop Loss': p.sl
    }));
  };

  const exportToCSV = () => {
    setExportLoading(true);
    const data = prepareData();
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `signalhub_purchases_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setExportLoading(false);
    setShowMenu(false);
  };

  const exportToPDF = () => {
    setExportLoading(true);
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.setTextColor(249, 115, 22);
    doc.text('Signal Hub - Purchase History', 14, 20);
    
    // Add date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    
    // Prepare table data
    const tableData = purchases.map(p => [
      p.pair,
      p.market,
      p.provider,
      `$${p.amount}`,
      formatDate(p.date),
      p.status,
      p.pnl || 'N/A'
    ]);
    
    // Create table
    doc.autoTable({
      startY: 40,
      head: [['Pair', 'Market', 'Provider', 'Amount', 'Date', 'Status', 'P&L']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [249, 115, 22], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });
    
    // Add summary
    const totalSpent = purchases.reduce((sum, p) => sum + p.amount, 0);
    const finalY = doc.lastAutoTable.finalY + 10;
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Spent: $${totalSpent.toFixed(2)}`, 14, finalY);
    doc.text(`Total Purchases: ${purchases.length}`, 14, finalY + 8);
    
    doc.save(`signalhub_purchases_${new Date().toISOString().split('T')[0]}.pdf`);
    setExportLoading(false);
    setShowMenu(false);
  };

  const exportToJSON = () => {
    setExportLoading(true);
    const data = prepareData();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `signalhub_purchases_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setExportLoading(false);
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${
          darkMode 
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }`}
      >
        <Icon icon={Icons.Download} size={14} />
        Export History
        <Icon icon={Icons.ChevronDown} size={12} />
      </button>

      {showMenu && (
        <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-10 ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={exportToCSV}
            disabled={exportLoading}
            className={`flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-orange-500/10 transition ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            <Icon icon={Icons.File} size={14} />
            Export as CSV
          </button>
          <button
            onClick={exportToPDF}
            disabled={exportLoading}
            className={`flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-orange-500/10 transition ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            <Icon icon={Icons.FilePdf} size={14} />
            Export as PDF
          </button>
          <button
            onClick={exportToJSON}
            disabled={exportLoading}
            className={`flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-orange-500/10 transition ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            <Icon icon={Icons.Code} size={14} />
            Export as JSON
          </button>
        </div>
      )}
    </div>
  );
}