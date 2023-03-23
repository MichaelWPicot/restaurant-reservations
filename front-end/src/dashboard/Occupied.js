import React from "react";
import { finishTables } from "../utils/api";
import { useHistory } from "react-router-dom";

function Occupied({ table_id }) {
  const history = useHistory();

  async function handleClick(e) {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      const abortController = new AbortController();
      await finishTables(table_id, abortController.signal);
      history.push("/");
      return () => abortController.abort();
    }
  }

  return (
  
    <button
      onClick={(e) => handleClick(e)}
      data-table-id-finish={`${table_id}`}
      className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
    >
      Finish
    </button>
  );
}

export default Occupied;