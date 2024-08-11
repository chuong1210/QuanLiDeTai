import React, { useContext, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { ProgressBar } from "primereact/progressbar";
import { AvatarGroup } from "primereact/avatargroup";
import { Avatar } from "primereact/avatar";
import { useQuery } from "@tanstack/react-query";
import { GroupPageContext } from "../[id]/page";
const fetchStudents = async () => {
  const res = await fetch("/api/students");
  return res.json();
};

const GroupTable = () => {
  const { topic, active } = useContext(GroupPageContext);

  const {
    data: students,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });

  const [filter, setFilter] = useState(null); // State to store the active filter

  const companies = [
    {
      name: "Catalog",
      url: "catalogapp.io",
      status: "Customer",
      about: "Content curating app",
      users: 4,
      usage: 80,
    },
    {
      name: "Circooles",
      url: "getcircooles.com",
      status: "Churned",
      about: "Design software",
      users: 4,
      usage: 50,
    },
    {
      name: "Sisyphus",
      url: "sisyphus.com",
      status: "Customer",
      about: "Automation and workflow",
      users: 4,
      usage: 70,
    },
    {
      name: "Hourglass",
      url: "hourglass.app",
      status: "Churned",
      about: "Productivity app",
      users: 4,
      usage: 30,
    },
  ];

  const statusBodyTemplate = (rowData: any) => {
    return (
      <Tag
        value={rowData.status}
        severity={rowData.status === "Customer" ? "success" : "danger"}
      />
    );
  };

  const usersBodyTemplate = (rowData: any) => {
    return (
      <AvatarGroup>
        {Array.from({ length: rowData.users }).map((_, index) => (
          <Avatar key={index} icon="pi pi-user" className="mr-2" />
        ))}
        <Avatar label={`+${rowData.users}`} />
      </AvatarGroup>
    );
  };

  const usageBodyTemplate = (rowData: any) => {
    return (
      <ProgressBar
        value={rowData.usage}
        showValue={false}
        style={{ height: "6px" }}
      />
    );
  };

  // Function to handle filter button clicks
  const handleFilter = (filterType: any) => {
    setFilter(filterType);
  };

  return (
    <div className="p-4">
      {/* Filter buttons */}
      <div className="flex gap-2 mb-4">
        <button
          className={`p-button ${filter === null ? "p-button-primary" : ""}`}
          onClick={() => handleFilter(null)}
        >
          View all
        </button>
        <button
          className={`p-button ${
            filter === "monitored" ? "p-button-primary" : ""
          }`}
          onClick={() => handleFilter("monitored")}
        >
          Monitored
        </button>
        <button
          className={`p-button ${
            filter === "unmonitored" ? "p-button-primary" : ""
          }`}
          onClick={() => handleFilter("unmonitored")}
        >
          Unmonitored
        </button>
      </div>

      <DataTable
        value={companies.filter((company) => {
          if (filter === null) {
            return true; // Show all companies when no filter is active
          } else if (filter === "monitored") {
            // Replace this with your actual logic to determine if a company is monitored
            return company.status === "Customer";
          } else if (filter === "unmonitored") {
            // Replace this with your actual logic to determine if a company is unmonitored
            return company.status === "Churned";
          }
        })}
        className="p-datatable-sm"
      >
        <Column
          field="name"
          header="Company"
          body={(rowData) => (
            <a href={`http://${rowData.url}`}>{rowData.name}</a>
          )}
        />
        <Column field="status" header="Status" body={statusBodyTemplate} />
        <Column field="about" header="About" />
        <Column field="users" header="Users" body={usersBodyTemplate} />
        <Column field="usage" header="License use" body={usageBodyTemplate} />
      </DataTable>
    </div>
  );
};

export default GroupTable;
