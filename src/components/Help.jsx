import React from 'react';

const Help = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={cardContainerStyle}>
        <div style={cardStyle} className="card">
          <h2>Welcome to Your Small Business Accounting App</h2>
          <p>
            This app is designed specifically for small business owners who want a simple and intuitive way to manage their finances. You don’t need to be an accountant to use it – the interface is friendly and easy to navigate, making it perfect for those with basic knowledge of accounting.
          </p>
        </div>

        <div style={cardStyle} className="card">
          <h2>Key Modules of the App</h2>
          <h4>1. Accounting Module</h4>
          <p>
            <strong>What It Does:</strong> This module allows you to record all types of financial transactions, such as payroll journals, vendor payments, customer collections, and accruals.
          </p>
          <p>
            <strong>How You Can Use It:</strong> Whenever you make or receive a payment, simply enter the transaction into this module. The app ensures everything is balanced (debits equal credits), so you don’t have to worry about accounting errors.
          </p>

          <h4>2. Sales Module</h4>
          <p>
            <strong>What It Does:</strong> This module helps you manage and record all invoices issued to your customers.
          </p>
          <p>
            <strong>How You Can Use It:</strong> Each time you make a sale or provide a service, create an invoice in this module. It tracks your sales, making it easier to follow up on payments and see what’s due.
          </p>

          <h4>3. Expenses Module</h4>
          <p>
            <strong>What It Does:</strong> This module is where you record bills from vendors, helping you manage what you owe.
          </p>
          <p>
            <strong>How You Can Use It:</strong> Whenever you receive a bill, log it here. This keeps you organized and allows you to track your expenses over time.
          </p>
        </div>

        <div style={cardStyle} className="card">
          <h2>Additional Features</h2>
          <h4>Revenue and Expense Charts</h4>
          <p>
            <strong>What It Does:</strong> The app provides visual charts that display your revenue and expenses throughout the year.
          </p>
          <p>
            <strong>How You Can Use It:</strong> These charts make it easy to see your financial trends at a glance, helping you make informed decisions about your business.
          </p>

          <h4>Pre-built Chart of Accounts</h4>
          <p>
            <strong>What It Does:</strong> The app includes a pre-built chart of accounts, covering typical small business needs.
          </p>
          <p>
            <strong>How You Can Use It:</strong> You can start using this feature right away without the need for complex setup – just focus on running your business.
          </p>
        </div>

        <div style={cardStyle} className="card">
          <h2>Understanding Accounting Basics with the App</h2>
          <h4>Double-Entry Bookkeeping</h4>
          <p>
            <strong>What It Does:</strong> Every transaction is recorded in two places: as a debit in one account and a credit in another.
          </p>
          <p>
            <strong>Why It’s Important:</strong> This system keeps your books balanced, ensuring accurate financial records. The app handles this for you automatically.
          </p>

          <h4>Why Journals Need to Balance</h4>
          <p>
            <strong>What It Does:</strong> The app ensures that the total debits always equal the total credits for each transaction.
          </p>
          <p>
            <strong>Why It’s Important:</strong> Balanced journals are essential for accurate financial reporting, and the app ensures this is always the case, removing the worry from your side.
          </p>
        </div>

        <div style={cardStyle} className="card">
          <h2>How This App Can Help You</h2>
          <p>
            This app simplifies complex accounting tasks, helping you stay organized, make better financial decisions, and run your business more efficiently. Whether you’re tracking daily sales, managing expenses, or monitoring your financial health, this app provides the tools you need in a way that’s easy to understand and use.
          </p>
        </div>
      </div>
    </div>
  );
};

const cardContainerStyle = {
  display: 'grid',
  gap: '20px',
};

const cardStyle = {
  backgroundColor: '#f9f9f9',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s, box-shadow 0.2s',
};

const cardHoverStyle = {
  transform: 'scale(1.05)',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
};

const style = `
  .card:hover {
    transform: ${cardHoverStyle.transform};
    box-shadow: ${cardHoverStyle.boxShadow};
  }
`;

export default Help;
