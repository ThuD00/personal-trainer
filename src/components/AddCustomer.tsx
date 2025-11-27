import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import type { CustomerForm } from '../types';
import { saveCustomer } from '../customerapi';

type AddCustomerProps = {
  fetchCustomers: () => void;
}

export default function Addcustomer({ fetchCustomers }: AddCustomerProps) {
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState<CustomerForm>({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    streetaddress: "",
    postcode: "",
    city: "",
  })

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCustomer({
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      streetaddress: "",
      postcode: "",
      city: "",
    })
  };

  const handleSave = () => {
    if (!customer.firstname || !customer.lastname) {
      alert("Enter values first");
      return;
    }

    saveCustomer(customer)
    .then(() => { 
      fetchCustomers();
      handleClose(); 
    })
    .catch(err => console.error(err))
  }

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Customer
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add new car</DialogTitle>
        <DialogContent>
					<TextField
						margin="dense"
						required
						label="First name"
						value={customer.firstname}
						onChange={event => setCustomer({...customer, firstname: event.target.value})}
						fullWidth
						variant="standard"
					/>
					<TextField
						margin="dense"
            required
						label="Last name"
						value={customer.lastname}
						onChange={event => setCustomer({...customer, lastname: event.target.value})}
						fullWidth
						variant="standard"
					/>
					<TextField
						margin="dense"
            required
						label="Email"
						value={customer.email}
						onChange={event => setCustomer({...customer, email: event.target.value})}
            fullWidth
						variant="standard"
					/>
					<TextField
						margin="dense"
            required
						label="Phone"
						value={customer.phone}
						onChange={event => setCustomer({...customer, phone: event.target.value})}
            fullWidth
						variant="standard"
					/>
					<TextField
						margin="dense"
            required
						label="Street Address"
						value={customer.streetaddress}
						onChange={event => setCustomer({...customer, streetaddress: event.target.value})}
            fullWidth
						variant="standard"
					/>
					<TextField
						margin="dense"
            required
						label="Postcode"
						value={customer.postcode}
						onChange={event => setCustomer({...customer, postcode: event.target.value})}
            fullWidth
						variant="standard"
					/>
          <TextField
						margin="dense"
            required
						label="City"
						value={customer.city}
						onChange={event => setCustomer({...customer, city: event.target.value})}
            fullWidth
						variant="standard"
					/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}