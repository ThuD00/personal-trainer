import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import type { CustomerForm, Customer } from '../types';
import EditIcon from '@mui/icons-material/Edit'

type EditCustomerProps = {
  refreshCustomer: () => void;
  customerRow: Customer;
}

function EditCustomer({ refreshCustomer, customerRow }: EditCustomerProps) {
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
    setCustomer({
      firstname: customerRow.firstname,
      lastname: customerRow.lastname,
      email: customerRow.email,
      phone: customerRow.phone,
      streetaddress: customerRow.streetaddress,
      postcode: customerRow.postcode,
      city: customerRow.city,
    })
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

    fetch(customerRow._links.customer.href, {
      method: "PUT",
      headers: { "content-type":"application/json" },
      body: JSON.stringify(customer)
    })
    .then(response => {
      if (!response.ok)
        throw new Error("Error when editing car");

      return response.json();
    })
    .then(() => { 
      refreshCustomer();
      handleClose(); 
    })
    .catch(err => console.error(err))
  }

  return (
    <>
      <Button size="small" onClick={handleClickOpen}>
        <EditIcon/>
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit customer</DialogTitle>
        <DialogContent>
					<TextField
            margin="dense"
            label="First name"
            value={customer.firstname}
            onChange={event => setCustomer({...customer, firstname: event.target.value})}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            label="Last name"
            value={customer.lastname}
            onChange={event => setCustomer({...customer, lastname: event.target.value})}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            label="Email"
            value={customer.email}
            onChange={event => setCustomer({...customer, email: event.target.value})}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            label="Phone"
            value={customer.phone}
            onChange={event => setCustomer({...customer, phone: event.target.value})}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            label="Street Address"
            value={customer.streetaddress}
            onChange={event => setCustomer({...customer, streetaddress: event.target.value})}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            label="Postcode"
            type="number"
            value={customer.postcode}
            onChange={event => setCustomer({...customer, postcode: event.target.value})}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
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

export default EditCustomer;