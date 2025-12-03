import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import type { Customer, TrainingForm } from "../types";
import { deleteCustomer, getCustomers } from "../customerapi";
import Addcustomer from "./AddCustomer";
import { TextField } from "@mui/material";
import EditCustomer from "./EditCustomer";
import AddTraining from "./AddTraining";
import { saveTraining } from "../trainingapi";
import ExportCustomersCsv from "./ExportCustomersCsv";
import DeleteIcon from '@mui/icons-material/Delete';

function Customerlist() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchCustomer, setSearchCustomer] = useState("");

	const fetchCustomers = () => {
		getCustomers()
		.then(data => setCustomers(data._embedded.customers))
		.catch(err => console.error(err))
	}

  useEffect(() => {
		fetchCustomers();
	}, []);

  const handleSaveTraining = (training: TrainingForm) => {
    return saveTraining(training)
    .then(() => {
      alert("Training added successfully!")
    })
    .catch(err => console.error(err))
  }

	const handleDelete = (url: string) => {
		if (window.confirm("Are you sure?")) {
    deleteCustomer(url)
    .then(() => fetchCustomers())
    .catch(err => console.error(err))
    }
	}

  // Ajetaan aina kun customers-lista tai filterText muuttuu
  const filteredCustomers = customers.filter((customers) => {
    // jos haku on tyhjä
    if (searchCustomer == "") return true;

    // (case-insensitive)
    const search = searchCustomer.toLowerCase();

    //Tarkistus
    return (
      customers.firstname.toLowerCase().includes(search) ||
      customers.lastname.toLowerCase().includes(search) ||
      customers.email.toLowerCase().includes(search)
    );
  });

	const columns: GridColDef[] = [
    {
      headerName: "Delete",
      width: 60,
      //ei haluta suodatusta
      sortable: false,
      filterable: false,
      field: '_links.self.href',
      //halutaan Delete-nappia sarakkeeseen
      //renderCell = voi määrittää, miten yksittäinen solun sisältö piirretään (renderöidään)
      renderCell: (params: GridRenderCellParams) => 
        <Button color='error' size="small" onClick={() => handleDelete(params.id as string)}>
          <DeleteIcon/>
        </Button>
    },
    {
      headerName: "Edit",
      width: 60,
      sortable: false,
      filterable: false,
      field: '_links.customer.href',
      renderCell: (params: GridRenderCellParams) =>
        <EditCustomer fetchCustomer={fetchCustomers} customerRow={params.row} />
    },
    {
      field: 'AddTraining',
      headerName: "Add Training",
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <AddTraining 
          handleSaveTraining={handleSaveTraining} 
          customerUrl={params.row._links.self.href} 
        />
      )
    },
    { field: 'firstname', width: 120, headerName: 'First Name' }, 
    { field: 'lastname', width: 100, headerName: 'Lastname' }, 
    { field: 'streetaddress', width: 150, headerName: 'Streetaddress' }, 
    { field: 'postcode', width: 100, headerName: 'Postcode'}, 
    { field: 'city', width: 100, headerName: 'City'}, 
    { field: 'email', width: 150, headerName: 'Email'},
	  { field: 'phone', width: 130, headerName: 'Phone'}, 
  ]

	return (
	  <>
      {/* Hakukenttä ja napit */}
      <div style={{ marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
        
        {/* Search input */}
        <TextField 
          label="Search customer" 
          variant="outlined" 
          size="small"
          value={searchCustomer}
          onChange={(e) => setSearchCustomer(e.target.value)} // Päivittää tilaa heti kirjoittaessa
        />
        <Addcustomer fetchCustomers={fetchCustomers}/>
        <ExportCustomersCsv customers={filteredCustomers} />
      </div>

			<div style={{ height: 500, margin: 'auto'}}>
				<DataGrid
				rows={filteredCustomers}
				columns={columns}
				//muista ID, kun käytetään DataGrid
				//määritetään uniikkina linkki (listassa jokaisella autolla on oma linkki)
				getRowId={row => row._links.self.href}
				autoPageSize
				//pystyy valita riviä/ruutua
				rowSelection={false}
				/>
        
      </div>
	  </>
	)

}

export default Customerlist;

