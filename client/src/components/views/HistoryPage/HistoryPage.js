import React from 'react';

function HistoryPage(props) {
  const transDate = (date) => {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDay();
    return `${year}-${month < 10 ? 0 : ''}${month}-${day < 10 ? 0 : ''}${day}`;
  };

  return (
    <div style={{ width: '80%', margin: '3rem auto' }}>
      <div style={{ textAlign: 'center' }}>
        <h1>주문내역</h1>
      </div>
      <br />
      <table>
        <thead>
          <tr>
            <th>상품명</th>
            <th>가격</th>
            <th>수량</th>
            <th>주문날짜</th>
          </tr>
        </thead>
        <tbody>
          {props.user.userData &&
            props.user.userData.history.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>{item.quantity}</td>
                <td>{transDate(item.dateOfPurchase)}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default HistoryPage;
