import React from 'react';
import 'typeface-roboto';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import SearchIcon from '@material-ui/icons/Search';
import Snackbar from '@material-ui/core/Snackbar';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import TextField from '@material-ui/core/TextField';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';
import { DateRangePicker } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment';
import Axios from 'axios';

const useStyles = makeStyles((theme) => ({
  rootStep: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  rootForm: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection:'column',
    alignItems:'center',
    padding:'50px'
  },
  radio:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'flex-start',
    textAlign:'left'
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  switchBase:{
    color: theme.palette.yellow,
  },
  textField: {
    width: '25ch',
  },
  rootGrid: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

function getSteps() {
  return ['Départ et retour', 'Client', 'Réservez'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return '';
    case 1:
      return '';
    case 2:
      return '';
    default:
      return 'Oups vous êtes perdu?';
  }
}

export default function Booking({machine,dealer,setContractToState,allBookingDates,Customers_catalog}) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [firstSelectedDate, setFirstSelectedDate] = React.useState(null);
  const [lastSelectedDate, setLastSelectedDate] = React.useState(null);
  const [tempBookingDates,setTempBookingDates] = React.useState([]);
  const [duration,setDuration] = React.useState();
  const [focusedInput, setFocusedInput] = React.useState(null);
  const [searchInput,setSearchInput] = React.useState('')
  const [name, setName] = React.useState('');
  const [customerSuggestionList,setCustomerSuggestionList]=React.useState(null);
  const [customerOnContract,setCustomerOnContract] = React.useState({});
  const [unitChoice,setUnitChoice] = React.useState('day');
  const [bookingType,setBookingType] = React.useState('contract');
  const [alertSnackbarOpen,setAlertSnackbarOpen] = React.useState();
  const [alertSnackbarMessage,setAlertSnackbarMessage] = React.useState('Une erreur vient de se produire');
  const[values,setValues] = React.useState({
    unitPrice:machine.day_price,
    unitNumber:duration,
  })
  const steps = getSteps();
  moment.locale('fr');

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleNext = async() => {

    if(activeStep===0){
      if(firstSelectedDate&&lastSelectedDate){
        const newDatesToAdd = [];
        const duration = lastSelectedDate.diff(firstSelectedDate,'days')+1;
        setDuration(duration);
  
        /**FILL newDatesToAdd WITH THE DATES SELECTED FROM DATEPICKER */
        for (let i = 0; i < duration; i++) {
  
          let day = firstSelectedDate.get('date');
          let month = firstSelectedDate.get('month');
          let year = firstSelectedDate.get('year');
  
          newDatesToAdd.push(year+'-'+month+'-'+day);
          firstSelectedDate.add(1,'d');
        }
        /**RESET firstSelectedDate AFTER ADD FUNCTION */
        firstSelectedDate.subtract(parseInt(duration),'d');

        /**CHEKING IF NO ELEMENT IN NEWDATESTOADD IS ALREADY BOOKED*/
        const dateUnauthorized = []
        newDatesToAdd.map(
          (element)=>{
            if(allBookingDates.includes(element)){
              dateUnauthorized.push(element);
            }
          }
        );

        if(dateUnauthorized.length>0){
          setAlertSnackbarMessage('Certaines dates sélectionnées sont déjà réservées');
          setAlertSnackbarOpen(true);
        }else{
          setTempBookingDates(newDatesToAdd);
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
        
      }else{
        setAlertSnackbarMessage('Sélectionnez les dates de départ et de retour');
        setAlertSnackbarOpen(true);
      }
      

    }else if(activeStep===1){

      if(customerOnContract.id){
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }else{
        setAlertSnackbarMessage('Sélectionnez le client locataire');
        setAlertSnackbarOpen(true);
      }
    }else if(activeStep===2){
      const bookingFormatedToJson = customerOnContract;
      bookingFormatedToJson.bookingDates=tempBookingDates;
      bookingFormatedToJson.status=bookingType;
      bookingFormatedToJson.id=machine.id;
      setContractToState(bookingFormatedToJson);

      try{
        const axiosResponse = await Axios({
          method: "post",
          url: 'http://localhost:4001/post/addBooking',
          data:bookingFormatedToJson, //DATA PARAMETER = req.body IF JSON || form-data IF FORM
        });
        console.log('axios response : ',axiosResponse);
      }
      catch(error){
        console.log('error: ',error);
      }
      

      
    }

    

    };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const searchChange = async(event) => {
    let customerName = event.target.value;
    setSearchInput(customerName);
    
      if(Customers_catalog&&customerName.length>2){
        let customerToSuggest = [];
        Customers_catalog.forEach(element => {
          if(element.name){
            if(element.name.includes(customerName.toUpperCase())){
              customerToSuggest=[...customerToSuggest,element];
            }
          } 
        })
        setCustomerSuggestionList(customerToSuggest);

      }else{
        setCustomerSuggestionList([]);
      }
      
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlertSnackbarOpen(false);
  };
  
  return (
    <div className={classes.rootGrid}>
      
      <Grid container spacing={3}>
        <Grid item xs={12} lg={4}>
          <Paper className={classes.paper}>
            <img src={machine.image_url} style={{width:'100%'}} alt='image_machine'/>
            <p><b>{machine.nature.toUpperCase()+' '+machine.brand.toUpperCase()+' '+machine.type.toUpperCase()}</b></p>
            <p>{machine.options}</p>
            <p style={{textAlign:'left'}}><b>Prix à la journée : </b>{machine.day_price}€</p>
            <p style={{textAlign:'left'}}><b>Prix à l'heure : </b>{machine.hour_price}€</p>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={8}>

        <div className={classes.rootStep}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          <div>
            {
              activeStep === 0
              ?(
                <div className="flexRowSpaceAround">
                  <DateRangePicker
                    //required
                    startDateId="startDate"
                    endDateId="endDate"
                    startDate={firstSelectedDate}
                    endDate={lastSelectedDate}
                    startDatePlaceholderText='Date départ'
                    endDatePlaceholderText='Date retour'
                    displayFormat='DD/MM/YYYY'
                    isDayBlocked={(moment)=>{

                      const day = moment.get('date');
                      const month = moment.get('month');
                      const year = moment.get('year');
                      const dateInIso8601 = year+'-'+month+'-'+day;

                      if (allBookingDates.includes(dateInIso8601)){
                        //care about the date format : no 0 before the month number, month number begin at 0
                          return(true);
                      }

                    }}
                    onDatesChange={({ startDate, endDate }) => {
                      if(startDate){
                        setFirstSelectedDate(startDate);
                      }
                      if(endDate){
                        setLastSelectedDate(endDate);
                      }

                    }}
                    focusedInput={focusedInput}
                    onFocusChange={(focusedInput) => { setFocusedInput(focusedInput)}}
                  />
                </div>
                  
              )
              :(activeStep === 1
                ?(
                  <form className={classes.rootForm} noValidate autoComplete="off">
                    <TextField
                      label="Nom du client"
                      id="outlined-start-adornment"
                      value={searchInput}
                      onChange={searchChange}
                      className={clsx(classes.margin, classes.textField)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchIcon/></InputAdornment>,
                      }}
                      variant="outlined"
                    />
                    
                      <FormControl component="fieldset">
                          <RadioGroup aria-label="customerSelect"
                            name="customerSelect"
                            value={name}
                            onChange={
                              (e)=>{
                                setName(e.target.value);
                                setCustomerOnContract(JSON.parse(e.target.value));
                              }
                            }>
                            {
                              customerSuggestionList&&customerSuggestionList.map(element=>
                                  <FormControlLabel key={element.id} classes={{root:classes.radio}} value={JSON.stringify(element)} control={<Radio />} label={element.name} />
                                )
                            }
                          </RadioGroup>
                        </FormControl>
                    
                  </form>
                )
                :(
                  <div className='flexRowSpaceAround'>
                    {
                      <div style={{alignSelf:'flex-start',textAlign:'left'}}>
                        <h3>Contrat de location</h3>
                        <h5>{customerOnContract.title+' '+customerOnContract.name}</h5>
                        <p>{customerOnContract.address}</p>
                        <p>{customerOnContract.postal+' '+customerOnContract.city}</p>
                        <p>{customerOnContract.cellPhone}</p>
                        <p>{customerOnContract.email}</p>
                      </div> 
                    }
                    <div>
                    <FormLabel component="legend">Vous enregistrez un :</FormLabel>
                      <RadioGroup className={classes.radio} aria-label="bookingType" name="bookingType" value={bookingType} onChange={(e)=>setBookingType(e.target.value)}>
                        <FormControlLabel
                          value="contract"
                          control={<Radio />}
                          label="contrat" 
                          />
                          <FormControlLabel
                          value="estimate"
                          control={<Radio />}
                          label="devis" 
                          />
                      </RadioGroup>
                    {
                      <p>Durée : {duration} jours</p>
                    }
                    {
                      <p styme={{marginTop:'15px'}}>{'Départ le '}
                      {
                      tempBookingDates[0]&& (moment(tempBookingDates[0]).format('DD MMMM YYYY'))
                      }
                      </p>
                    }
                  </div>

                  <div>
                  <FormGroup>
                  <FormLabel component="legend">Location à</FormLabel>
                  <RadioGroup className={classes.radio} aria-label="rentalUnit" name="rentalUnit" value={unitChoice} onChange={(e)=>setUnitChoice(e.target.value)}>
                    <FormControlLabel
                      value="day"
                      control={<Radio />}
                      label="la journée" 
                      />
                      <FormControlLabel
                      value="hour"
                      control={<Radio />}
                      label="l'heure" 
                      />
                  </RadioGroup>
                    <FormControl fullWidth style={{marginTop:'20px'}}>
                      <InputLabel htmlFor="unitPrice">Prix unitaire</InputLabel>
                      <Input
                        id="unitPrice"
                        autoFocus
                        value={values.unitPrice}
                        onChange={handleChange('unitPrice')}
                        startAdornment={<InputAdornment position="start">€</InputAdornment>}
                      />
                    </FormControl>
                    <FormControl fullWidth style={{marginTop:'20px'}}>
                      <InputLabel htmlFor="unitNumber">Quantité</InputLabel>
                        <Input
                          id="unitNumber"
                          defaultValue={duration}
                          //value={values.unitNumber}
                          onChange={handleChange('unitNumber')}
                        />
                    </FormControl>
                  </FormGroup>
                  </div>
                    
                  </div>
                )
              )
            }
          </div>
          <div>
            {activeStep === steps.length ? (
              <div>
                <Typography className={classes.instructions}>
                  Déjà fini!
                </Typography>
                <Button onClick={handleReset} className={classes.button}>
                  On recommence?
                </Button>
              </div>
            ) : (
              <div>
                <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                <div>
                  <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                    Retour
                  </Button>
                  <Button
                    variant="contained"
                    style={{backgroundColor:dealer.backgroundColor,color:dealer.color}}
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? 'Valider' : 'Suivant'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

            </Grid>
            
          </Grid>

          <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            open={alertSnackbarOpen}
            autoHideDuration={6000}
            onClose={handleClose}
            message={alertSnackbarMessage}
            action={
              <React.Fragment>
                <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            }
          />
          
        </div>
  );
}
