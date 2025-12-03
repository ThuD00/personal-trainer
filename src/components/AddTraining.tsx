import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import type { TrainingForm } from '../types';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';

type AddTrainingProps = {
  handleSaveTraining: (t: TrainingForm) => Promise<void>;
  customerUrl: string;
}

export default function AddTraining({ handleSaveTraining, customerUrl }: AddTrainingProps) {
  const [open, setOpen] = useState(false);
  const [training, setTraining] = useState<TrainingForm>({
    date: "",
    activity: "",
    duration: 0,
    customer: customerUrl,
  })

  const handleClickOpen = () => {
    setOpen(true);
    setTraining({...training, customer: customerUrl})
  };

  const handleClose = () => {
    setOpen(false);
    setTraining({
      date: "",
      activity: "",
      duration: 0,
      customer: customerUrl,
    })
  };

  const handleSave = () => {
    if (!training.date || !training.activity) {
      alert("Enter values first");
      return;
    }

    handleSaveTraining(training)
    .then(() => { 
      handleClose(); 
    })
    .catch(err => console.error(err))
  }

  return (
    <>
      <Button variant="text" onClick={handleClickOpen}>
        <AddIcon />
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Training</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Date"
              value={training.date ? dayjs(training.date) : null}
              onChange={(newValue) => {
                setTraining({
                  ...training, 
                  date: newValue ? newValue.format('') : ''
                });
              }}
            />
          </LocalizationProvider>
          <TextField
            margin="dense"
            label="Activity"
            value={training.activity}
            onChange={event => setTraining({...training, activity: event.target.value})}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            label="Duration"
            type='number'
            value={training.duration}
            onChange={event => setTraining({...training, duration: Number(event.target.value)})}
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