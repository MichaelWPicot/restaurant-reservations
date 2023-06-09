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
      
    >
      Finish
    </button>
  );
}

export default Occupied;