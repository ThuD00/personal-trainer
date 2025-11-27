import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import type { Customer } from "../types";
import { deleteCustomer, getCustomers } from "../customerapi";

function Customerlist() {
  const [customers, setCustomers] = useState<Customer[]>([]);

	const fetchCustomers = () => {
		getCustomers()
		.then(data => setCustomers(data._embedded.customers))
		.catch(err => console.error(err))
	}

	const handleDelete = (url: string) => {
		if (window.confirm("Are you sure?")) {
    deleteCustomer(url)
    .then(() => fetchCustomers())
    .catch(err => console.error(err))
    }
	}

  useEffect(() => {
		fetchCustomers();
	}, []);

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
			<div style= {{ height: 500, margin: 'auto'}}>
				<DataGrid
				rows={customers}
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

