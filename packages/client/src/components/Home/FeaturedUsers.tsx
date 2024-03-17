import Table from "@mui/joy/Table";
import React from "react";
import Section from "../Layout/Container";

const FeaturedUsers: React.FC = () => {
  function createData(name: string, date: string, distance: number) {
    return { name, date, distance };
  }

  const rows = [
    createData("N.V.A", "Oct 16, 2023", 21.0),
    createData("L.V.B", "Oct 16, 2023", 19.0),
    createData("D.V.T", "Oct 16, 2023", 16.0),
    createData("P.V.V", "Oct 16, 2023", 13.7),
    createData("A.V.T", "Oct 16, 2023", 11.0),
  ];

  return (
    <div className="featuredUsers">
      <Section>
        <Table sx={{ backgroundColor: "white" }}>
          <thead>
            <tr>
              <th style={{ width: "40%" }}>Name</th>
              <th>Joined Date</th>
              <th>Distance&nbsp;(km)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td>{row.date}</td>
                <td>{row.distance}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>
    </div>
  );
};

export default FeaturedUsers;
