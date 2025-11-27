import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import type { Customer } from "../types";
import { deleteCustomer, getCustomers } from "../customerapi";
import Addcustomer from "./AddCustomer";
import { TextField } from "@mui/material";

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
    { field: 'firstname', width: 150, headerName: 'First Name' }, 
    { field: 'lastname', width: 150, headerName: 'Lastname' }, 
    { field: 'streetaddress', headerName: 'Streetaddress' }, 
    { field: 'postcode', headerName: 'Postcode'}, 
    { field: 'city', headerName: 'City'}, 
    { field: 'email', headerName: 'Email'},
	  { field: 'phone', headerName: 'Phone'}, 
    {
      headerName: "",
      //ei haluta suodatusta
      sortable: false,
      filterable: false,
      field: '_links.self.href',
      //halutaan Delete-nappia sarakkeeseen
      //renderCell = voi määrittää, miten yksittäinen solun sisältö piirretään (renderöidään)
      renderCell: (params: GridRenderCellParams) => 
        <Button color='error' size="small" onClick={() => handleDelete(params.id as string)}>
          Delete
        </Button>
    },
  ]

	return (
	  <>
      <Addcustomer fetchCustomers={fetchCustomers}/>
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
      </div>
			<div style= {{ height: 500, margin: 'auto'}}>
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

