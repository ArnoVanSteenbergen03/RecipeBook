import React, { useEffect, useState } from "react";
import CrudComponent from "./CRUD";

function Spices() {
  return (
    <div>
      <h1>Spices</h1>
      <CrudComponent
        collectionName="spices"
        fields={[
          { name: "name", type: "text" },
          { name: "description", type: "textarea" },
          { name: "author", type: "text" },
          { name: "tags", type: "text" },
          { name: "public", type: "checkbox" }
        ]}
      />
    </div>
  );
}

export default Spices;
