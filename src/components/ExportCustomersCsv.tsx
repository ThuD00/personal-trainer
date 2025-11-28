import { CSVLink } from "react-csv";
import Button from "@mui/material/Button";
import type { Customer } from "../types";

type Props = {
  customers: Customer[];
};

function ExportCustomersCsv({ customers }: Props) {

  const csvHeaders = [
    { label: "First Name", key: "firstname" },
    { label: "Last Name", key: "lastname" },
    { label: "Streetaddress", key: "streetaddress" },
    { label: "Postcode", key: "postcode" },
    { label: "City", key: "city" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
  ];

  return (
    <CSVLink
      data={customers}       // Raaka data 
      headers={csvHeaders}      // Hoitaa suodatuksen (vain nämä kentät tulevat)
      filename={"asiakkaat.csv"} // Tiedoston nimi
      separator={";"}        // Excel tykkää usein puolipisteestä enemmän kuin pilkusta
      >
      <Button variant="text">Export CSV</Button>
    </CSVLink>
  );
}

export default ExportCustomersCsv;
