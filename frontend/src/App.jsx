import { useState } from "react";
import axios from "axios";

function App() {
  const [groupId, setGroupId] = useState(1);
  const [balance, setBalance] = useState(null);

  const getBalance = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/api/groups/${groupId}/balance`
      );

      setBalance(res.data.balances);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch balance");
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Splitwise Clone</h1>

      <h3>Group Balance</h3>

      <input
        type="number"
        value={groupId}
        onChange={(e) => setGroupId(e.target.value)}
        placeholder="Group ID"
      />

      <button onClick={getBalance}>
        Get Balance
      </button>

      {balance && (
        <div style={{ marginTop: "20px" }}>
          <h3>Balances</h3>

          {Object.entries(balance).map(([userId, amount]) => (
            <p key={userId}>
              User {userId}: ₹{amount}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
