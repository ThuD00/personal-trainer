import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams, GridValueFormatter } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { deleteTraining, getTrainings } from "../trainingapi";
import type { Training } from "../types";
import dayjs from "dayjs";
import { retrieveCustomer } from "../customerapi";

function Trainingsessions() {
	const [trainings, setTrainings] = useState<Training[]>([]);

  //hakee harjoitukset ja asiakkaat
  const fetchData = async () => {
    try {
      console.log("fetchData")
      const data = await getTrainings();
      const rawTrainings = data._embedded.trainings;

      // Haetaan asiakastiedot jokaiseen harjoitukseen
      const fullTrainings = await Promise.all(rawTrainings.map(async (training: Training) => {
        const customerData = await retrieveCustomer(training._links.customer.href);
        return {
            ...training,
            customer: customerData
        };
      }));
      setTrainings(fullTrainings);
    } catch (err) {
      console.log(err);
    }
  };

  // Kutsutaan tätä funktiota sivun latauksessa
  useEffect(() => {
    fetchData();
  }, []);

  const handleDetele = (url: string) => {
    if (window.confirm("Are you sure?")) {
    deleteTraining(url)
    .then(() => fetchData())
    .catch(err => console.error(err))
    }
  }

	const columns: GridColDef[] = [
    { field: 'date', 
      width: 200, 
      headerName: 'Date',
      type: 'dateTime',
      valueFormatter: ((value) => {
        //hh = 12-tuntinen kello, HH = 24-tuntinen, mm = minuutit, a = AM/PM
        return value ? dayjs(value as string).format('DD.MM.YYYY HH:mm a') : '';
      }) as GridValueFormatter
    }, 
    { field: 'duration', width: 150, headerName: 'Duration (min)' }, 
    { field: 'activity', width: 150, headerName: 'Activity' }, 
    { 
      field: 'customer', 
      width: 150, 
      headerName: 'Customer',
      valueGetter: (_, row) => {
        return row.customer ? row.customer.firstname + ' ' + row.customer.lastname : 'Unknown'; 
      }
    }, 
    {
      headerName: "",
      //ei haluta suodatusta
      sortable: false,
      filterable: false,
      field: '_links.self.href',
      //halutaan Delete-nappia sarakkeeseen
      //renderCell = voi määrittää, miten yksittäinen solun sisältö piirretään (renderöidään)
      renderCell: (params: GridRenderCellParams) => 
        <Button color='error' size="small" onClick={() => handleDetele(params.id as string)}>
          Delete
        </Button>
    	}
  	]

    return (
			<>
				<div style= {{ height: 500, margin: 'auto'}}>
					<DataGrid
					rows={trainings}
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

export default Trainingsessions;