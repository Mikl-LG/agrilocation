import React from 'react';
import 'typeface-roboto';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import DateRangeIcon from '@material-ui/icons/DateRange';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import EditIcon from '@material-ui/icons/Edit';
import EuroIcon from '@material-ui/icons/Euro';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import InputLabel from '@material-ui/core/InputLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Moment from 'moment';
import Paper from '@material-ui/core/Paper';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Select from '@material-ui/core/Select';
import StopIcon from '@material-ui/icons/Stop';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';

import Axios from 'axios';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    //flexWrap: 'wrap',
    flexDirection:'column',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.secondary,
  },
  gridList: {
    width: '100%',
    height: '100%',
  },
  icon: {
    color: 'white',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
  },
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 120,
  },
  formControlLabel: {
    marginTop: theme.spacing(1),
  },
}));

export default function Bookinglist({titleColor,dealerColor,dealerBackgroundColor,machine,updateCatalogMachine,returnHomeInformUser}) {
  const classes = useStyles();
  const [checked, setChecked] = React.useState([0]);
  const [open, setOpen] = React.useState(false);
  const [currentBooking,setCurrentBooking] = React.useState({});
  Moment.locale('fr');

  const addBookingToSelectedList = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    console.log('checked : ',checked);
  };

  const dialogInfoOpen = (value) => {
    setOpen(value);
  };

  const deleteBooking = async(booking)=>{
    
    const axiosResponse = await Axios({
      method: "post",
      url: 'http://localhost:4001/post/deleteBooking',
      data:booking,
      //config: { headers: { "Content-Type": "multipart/form-data" } }
    });

    const{status,data} = axiosResponse;
    if(status === 201){
      returnHomeInformUser('Votre réservation vient d\'être supprimée','success');
      updateCatalogMachine();
    }

  }

  const longformatDate = ()=>{
    
    if(currentBooking.bookingDates){
        const bookingDates = currentBooking.bookingDates;
        let startDate = Moment(bookingDates[0]).add(1, 'M');
        let duration = bookingDates.length;
        let endDate = Moment(currentBooking.bookingDates[duration-1]).add(1, 'M');
        let delay = Moment(bookingDates[0]).endOf('day').fromNow();
        console.log('startDate : ',startDate.format('DD MMMM YYYY'));
        console.log('duration : ',duration);
        console.log('endDate : ',endDate.format('DD MMMM YYYY'));
        console.log('delay : ',delay);
        return(
          'du '+startDate.format('DD MMMM YYYY')+' au '+endDate.format('DD MMMM YYYY')+' - '+duration+' jour(s)'
        )
        
    }
                
  }

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={4}>
          <Paper className={classes.paper}>
            <img src={machine.image_url} style={{width:'100%'}} alt='image_machine'/>
            <p><b>{machine.nature.toUpperCase()+' '+machine.brand.toUpperCase()+' '+machine.type.toUpperCase()}</b></p>
            <p>{machine.options}</p>
            <p style={{textAlign:'left'}}><b>Prix à la journée : </b>{machine.day_price}€</p>
            <p style={{textAlign:'left'}}><b>Prix à {machine.unit_label} : </b>{machine.unit_price}€</p>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={8}>
          <Typography variant='h6'>Liste des réservations</Typography>
          <FormControl>
            <RadioGroup row aria-label="booking-status" name="booking-status" defaultValue="top">
              <FormControlLabel
                value="contract"
                control={<Radio color="primary" />}
                label="Contrats"
                labelPlacement="top"
              />
              <FormControlLabel
                value="estimate"
                control={<Radio color="primary" />}
                label="Devis" 
                labelPlacement="top"
              />
            </RadioGroup>
          </FormControl>
          <List className={classes.root}>
            {machine.booking
            ?machine.booking.sort(function(a,b){
              return a.firstBookingDate - b.firstBookingDate;
            }).map(
              (value,index) => {
                const labelId = `checkbox-list-label-${value.id}`;

                return (
                  <ListItem
                    key={value.bookingDates}
                    role={undefined} dense divider button
                    onClick={addBookingToSelectedList(value)}>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={checked.indexOf(value) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={`${value.title} ${value.name}`} secondary={`${value.postal} ${value.city}`}/>
                    <ListItemText style={{textAlign:'right',fontStyle:'italic'}} id={labelId} secondary={`${value.firstBookingDate.endOf('day').fromNow()}`}/>
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="comments" onClick={()=>{
                        //SET THE COMPLETE BOOKING IN THE HOOK
                        setCurrentBooking(machine.booking[index]);
                        dialogInfoOpen(true);}}>
                        <InfoIcon color='primary'/>
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
              );
            })
          :<p>Il n'y a aucun contrat pour ce matériel.</p>}
          </List>
        </Grid>
      </Grid>
      <React.Fragment>
        <Dialog
          fullWidth={true}
          maxWidth='lg'
          open={open}
          onClose={()=>dialogInfoOpen(false)}
          aria-labelledby="max-width-dialog-title"
        >
          <DialogTitle id="max-width-dialog-title" style={{textAlign:'center'}}>Information réservation</DialogTitle>
          <Divider/>
          <DialogContent>
            <List>
              <ListItemText
                primary={currentBooking.title+' '+currentBooking.name}
                secondary={currentBooking.firstAddress+' '+currentBooking.secondAddress+' '+currentBooking.thirdAddress+' - '+currentBooking.postal+' '+currentBooking.city}
              />
              <ListItem>
                <ListItemIcon><PhoneIphoneIcon/></ListItemIcon>
                <ListItemText primary={currentBooking.cellPhone}/>
              </ListItem>
            </List>
            <Divider/>
            <Typography variant='subtitle1'>
              Contrat:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon><DateRangeIcon/></ListItemIcon>
                <ListItemText
                  secondary={longformatDate()}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><EuroIcon/></ListItemIcon>
                <ListItemText
                  secondary={currentBooking.unitChoice ==='day'
                  ?currentBooking.unitNumber+' jour(s) x '+currentBooking.unitPrice+'€':currentBooking.unitNumber+' '+machine.unit_label+' x '+currentBooking.unitPrice+'€'
                  }
                />
              </ListItem>
            </List>
            <DialogContentText>
            </DialogContentText>
              
            
          </DialogContent>
          <DialogActions>
            <IconButton edge="end" aria-label="delete" onClick={()=>deleteBooking(currentBooking)}>
              <DeleteIcon />
            </IconButton>
            <IconButton edge="end" aria-label="edit" onClick={()=>alert('Vers édition')}>
              <EditIcon />
            </IconButton>
            <IconButton edge="start" aria-label="print" onClick={()=>alert('vers PDF')}>
              <PictureAsPdfIcon />
            </IconButton>
            <IconButton edge="end" color="primary" onClick={()=>dialogInfoOpen(false)} >
              <HighlightOffIcon />
            </IconButton>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </div>
  );
}
