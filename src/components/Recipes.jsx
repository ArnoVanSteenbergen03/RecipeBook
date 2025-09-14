import React from "react";
import CrudComponent from "./CRUD";

function Recipes() {
  return (
    <div>
      <h1>Recipes</h1>
      <CrudComponent
        collectionName="recipes"
        fields={[
          { name: "name", type: "text" },
          { name: "ingredients", type: "text" },
          { name: "preptime", type: "number" },
          { name: "instructions", type: "textarea" },
          { name: "tags", type: "text" },
          { name: "public", type: "checkbox" }
        ]}
      />
    </div>
  );
}

export default Recipes;