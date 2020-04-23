import React from 'react';
import 'typeface-roboto';
import CloseIcon from '@material-ui/icons/Close';
import {Grid} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import { Typography,Button,TextField } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import Snackbar from '@material-ui/core/Snackbar';
import PhotoCamera from '@material-ui/icons/PhotoCamera';

import Dropzone from 'react-dropzone';

import Axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    padding:'20px'
  },
  button: {
    margin: theme.spacing(1),
  },
  dropzone:{
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    width:'100%',
    height:'20vh',
    border:'solid grey 1px',
    borderRadius:'5px',
    padding:'15px',
    backgroundColor:'#E8E8E8'
  },
  formGroup:{
    height:'40vh',
    width:'30vh',
    display:'flex',
    flexDirection:'column',
    justifyContent:'space-around'
  },
  gridList: {
    width: '100%',
    height: '100%',
  },
  icon: {
    color: 'white',
  },
  textfield:{
    width:'100%',
    margin:'20px'
  },
  title:{
    padding:'30px'
  },
  gridItem:{
    padding:'20px',
  }
}));

export default function Addmachine({titleColor,dealerColor,dealerBackgroundColor,returnHomeInformUser,updateCatalogMachine}) {
  const classes = useStyles();
  const [machine, setMachine] = React.useState({});
  const [loading,setLoading] = React.useState(false);
  const [alertSnackbarIsOpen,setAlertSnackbarIsOpen] = React.useState(false);
  const [alertSnackbarMessage,setAlertSnackbarMessage] = React.useState('Une erreur vient de se produire');

  const handleChange = (event,propertyName) => {
    setMachine({...machine,[propertyName]:event.target.value});
  }

  const createMachine = async() => {

    /** CHECK IF ALL THE FIELDS ARE COMPLETE */
    if(machine.brand === undefined || machine.brand === '' || machine.nature === undefined || machine.nature === '' ||machine.type === undefined || machine.type === '' || machine.day_price === undefined || machine.day_price === '' || machine.unit_price === undefined || machine.unit_price === '' || machine.unit_label === undefined || machine.unit_label === ''){

    setAlertSnackbarMessage('Encore un effort : il semble qu\'au moins un champ ne soit pas complété');
    setAlertSnackbarIsOpen(true);
    
    }
    else
    {
      /**SNACKBAR DURING THE LOADING OF THE PICTURE */
      setLoading(true);
      setAlertSnackbarMessage('Patience, votre machine est presque prête...');
      setAlertSnackbarIsOpen(true);
      
      try {
    
        const machineInformations = await new Promise(async(resolve,reject)=>{
          try{
            const image = machine.image && machine.image[0]
            let machineForm = new FormData();
            
            machineForm.append('filedata',image);
            machineForm.append('brand',machine.brand);
            machineForm.append('type',machine.type);
            machineForm.append('nature',machine.nature);
            machineForm.append('options',machine.options);
            machineForm.append('day_price',machine.day_price);
            machineForm.append('unit_price',machine.unit_price);
            machineForm.append('unit_label',machine.unit_label);
            machineForm.append('booking',[]);
            
            resolve(machineForm);

          }catch(error){

            reject(error);

          }
        })

        const axiosResponse = await Axios({
          method: "post",
          url: 'http://localhost:4001/post/addMachineImage',
          data:machineInformations,
          config: { headers: { "Content-Type": "multipart/form-data" } }
        });

        const {data, status} = axiosResponse;
                
        //console.log('s3 uploaded image url : ', imageurl || 'no url received');
        if(status === 201){
          returnHomeInformUser('Votre machine est prête à être louée','success')
          updateCatalogMachine();
        }
      } catch(e) {

        console.log('addMachine error', e || 'null')

        /**ALLOW THE USER TO CORRECT HIS INFORMATIONS */
        setAlertSnackbarMessage('Mince, quelque-chose s\'est mal passé: vérifiez les informations saisies et votre connexion.');
        setAlertSnackbarIsOpen(true);
        setLoading(false);
      }
    }
  }

  return (
    <div>
      <div className={classes.title}>
        <Typography variant='h6' style={{color:titleColor}}>Ajouter une nouvelle machine à votre catalogue</Typography>
      </div>
    

    <Grid container spacing={5}>
      <form className={classes.root}>
        <Grid item xs={12} lg={4} className={classes.gridItem}>
          <TextField
            className={classes.textfield}
            disabled={loading}
            id="outlined-name"
            label="Nature"
            placeholder='Tracteur, presse...'
            //value={machine&&machine.nature&&machine.nature}
            onChange={(event)=>handleChange(event,'nature')}
            variant="outlined"
          />
          <TextField
            className={classes.textfield}
            disabled={loading}
            id="outlined-name"
            label="Marque"
            placeholder='Marque'
            //value={machine&&machine.brand&&machine.brand}
            onChange={(event)=>handleChange(event,'brand')}
            variant="outlined"
          />
          <TextField
            className={classes.textfield}
            disabled={loading}
            id="outlined-name"
            label="Modèle"
            placeholder='Modèle'
            //value={machine&&machine.type&&machine.type}
            onChange={(event)=>handleChange(event,'type')}
            variant="outlined"
          />
          <TextField
            className={classes.textfield}
            disabled={loading}
            id="outlined-name"
            label="Options"
            placeholder='Relevage avant, chargeur, autoguidage...'
            //value={machine&&machine.options&&machine.options}
            onChange={(event)=>handleChange(event,'options')}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} lg={4} className={classes.gridItem}>
          <TextField
            className={classes.textfield}
            disabled={loading}
            id="outlined-name"
            label="Prix à la journée"
            placeholder='Tarif journalier de votre machine'
            //value={machine&&machine.day_price&&machine.day_price}
            onChange={(event)=>handleChange(event,'day_price')}
            variant="outlined"
          />
          <TextField
            className={classes.textfield}
            disabled={loading}
            id="outlined-name"
            label="Prix à l'unité"
            placeholder='Tarif unitaire de votre machine'
            //value={machine&&machine.unit_price&&machine.unit_price}
            onChange={(event)=>handleChange(event,'unit_price')}
            variant="outlined"
          />
          <TextField
            className={classes.textfield}
            disabled={loading}
            id="outlined-name"
            label="Libellé unitaire"
            placeholder="heure(s), botte(s)..."
            //value={machine&&machine.unit_label&&machine.unit_label}
            onChange={(event)=>handleChange(event,'unit_label')}
              variant="outlined"
            />
        </Grid>
        <Grid item xs={12} lg={4} className={classes.gridItem} style={{alignSelf:'center'}}>
          <Dropzone disabled={loading} onDrop={acceptedFiles => setMachine({...machine,image:acceptedFiles})}>
            {({getRootProps, getInputProps}) => (
              <section>
                <div className={classes.dropzone} {...getRootProps()}>
                  <input {...getInputProps()} />
                  <div>
                    <PhotoCamera />
                    <Typography variant='h6'>Glisser votre image ici</Typography>
                    <Typography variant='subtitle1'>ou cliquez pour la sélectionner</Typography>


                  </div>
                
                
                </div>
              </section>
            )}
          </Dropzone>
        
          <Button
                disabled={loading}
                variant="contained"
                color="primary"
                size="large"
                className={classes.button}
                startIcon={<SaveIcon />}
                style={{color:dealerColor,backgroundColor:dealerBackgroundColor}}
                onClick={createMachine}
              >
                VALIDER
              </Button>
        </Grid>
      </form>
    </Grid>
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open={alertSnackbarIsOpen}
      autoHideDuration={4000}
      onClose={()=>setAlertSnackbarIsOpen(false)}
      message={alertSnackbarMessage&&alertSnackbarMessage}
      action={
        <React.Fragment>
          <IconButton size="small" aria-label="close" color="inherit" onClick={()=>setAlertSnackbarIsOpen(false)}>
            <CloseIcon fontSize="small" />
             </IconButton>
        </React.Fragment>
      }
    />
      
      
    </div>
  );
}